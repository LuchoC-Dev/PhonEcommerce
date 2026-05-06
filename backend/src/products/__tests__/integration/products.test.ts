import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeAdminToken, makeUserToken } from '../../../__tests__/helpers/auth'

let app: FastifyInstance
let brandId: string
let categoryId: string

beforeAll(async () => {
  app = await buildTestApp()
})

afterAll(async () => {
  await app.close()
  await testPrisma.$disconnect()
})

beforeEach(async () => {
  await cleanDatabase()
  const brand = await testPrisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } })
  const category = await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })
  brandId = brand.id
  categoryId = category.id
})

const basePayload = () => ({
  name: 'Galaxy S24',
  slug: 'galaxy-s24',
  price: 999.99,
  brandId,
  categoryId,
})

describe('GET /api/v1/products', () => {
  it('returns paginated empty result', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/products' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.data).toEqual([])
    expect(body.total).toBe(0)
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(20)
    expect(body.totalPages).toBe(0)
  })

  it('returns published products', async () => {
    await testPrisma.product.create({
      data: { name: 'Galaxy S24', slug: 'galaxy-s24', price: 999, status: 'PUBLISHED', brandId, categoryId },
    })
    await testPrisma.product.create({
      data: { name: 'Galaxy S23', slug: 'galaxy-s23', price: 799, status: 'DRAFT', brandId, categoryId },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/products?status=PUBLISHED' })
    expect(res.statusCode).toBe(200)
    expect(res.json().total).toBe(1)
    expect(res.json().data[0].slug).toBe('galaxy-s24')
  })

  it('filters by brandId', async () => {
    const otherBrand = await testPrisma.brand.create({ data: { name: 'Apple', slug: 'apple' } })
    await testPrisma.product.create({
      data: { name: 'Galaxy S24', slug: 'galaxy-s24', price: 999, status: 'PUBLISHED', brandId, categoryId },
    })
    await testPrisma.product.create({
      data: { name: 'iPhone 15', slug: 'iphone-15', price: 1099, status: 'PUBLISHED', brandId: otherBrand.id, categoryId },
    })

    const res = await app.inject({ method: 'GET', url: `/api/v1/products?brandId=${brandId}` })
    expect(res.json().total).toBe(1)
    expect(res.json().data[0].slug).toBe('galaxy-s24')
  })

  it('filters by price range', async () => {
    await testPrisma.product.create({
      data: { name: 'Cheap Phone', slug: 'cheap-phone', price: 199, status: 'PUBLISHED', brandId, categoryId },
    })
    await testPrisma.product.create({
      data: { name: 'Expensive Phone', slug: 'expensive-phone', price: 1499, status: 'PUBLISHED', brandId, categoryId },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/products?minPrice=100&maxPrice=500' })
    expect(res.json().total).toBe(1)
    expect(res.json().data[0].slug).toBe('cheap-phone')
  })

  it('searches by name', async () => {
    await testPrisma.product.create({
      data: { name: 'Galaxy S24', slug: 'galaxy-s24', price: 999, status: 'PUBLISHED', brandId, categoryId },
    })
    await testPrisma.product.create({
      data: { name: 'iPhone 15', slug: 'iphone-15', price: 1099, status: 'PUBLISHED', brandId, categoryId },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/products?search=galaxy' })
    expect(res.json().total).toBe(1)
    expect(res.json().data[0].slug).toBe('galaxy-s24')
  })

  it('paginates correctly', async () => {
    for (let i = 1; i <= 5; i++) {
      await testPrisma.product.create({
        data: { name: `Phone ${i}`, slug: `phone-${i}`, price: 100 * i, status: 'PUBLISHED', brandId, categoryId },
      })
    }

    const res = await app.inject({ method: 'GET', url: '/api/v1/products?page=2&pageSize=2' })
    const body = res.json()
    expect(body.data).toHaveLength(2)
    expect(body.page).toBe(2)
    expect(body.totalPages).toBe(3)
  })
})

describe('GET /api/v1/products/:slug', () => {
  it('returns product with relations', async () => {
    await testPrisma.product.create({
      data: {
        name: 'Galaxy S24',
        slug: 'galaxy-s24',
        price: 999,
        status: 'PUBLISHED',
        brandId,
        categoryId,
        images: { create: [{ url: '/img.jpg', altText: 'S24', position: 0 }] },
      },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/products/galaxy-s24' })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.slug).toBe('galaxy-s24')
    expect(body.brand.slug).toBe('samsung')
    expect(body.category.slug).toBe('smartphones')
    expect(body.images).toHaveLength(1)
  })

  it('returns 404 for unknown slug', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/products/nonexistent' })
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /api/v1/products', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/products', payload: basePayload() })
    expect(res.statusCode).toBe(401)
  })

  it('returns 403 with user token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/products',
      headers: { authorization: `Bearer ${makeUserToken()}` },
      payload: basePayload(),
    })
    expect(res.statusCode).toBe(403)
  })

  it('creates product with admin token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/products',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: {
        ...basePayload(),
        description: 'Flagship 2024',
        stock: 50,
        status: 'PUBLISHED',
        images: [{ url: '/s24.jpg', altText: 'S24', position: 0 }],
      },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.slug).toBe('galaxy-s24')
    expect(body.price).toBe(999.99)
    expect(body.images).toHaveLength(1)
    expect(body.brand.slug).toBe('samsung')
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/products',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Galaxy S24', slug: 'galaxy-s24' }, // missing price, brandId, categoryId
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 409 on duplicate slug', async () => {
    await testPrisma.product.create({
      data: { name: 'Galaxy S24', slug: 'galaxy-s24', price: 999, brandId, categoryId },
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/products',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: basePayload(),
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('PUT /api/v1/products/:id', () => {
  it('updates product', async () => {
    const product = await testPrisma.product.create({
      data: { name: 'Galaxy S24', slug: 'galaxy-s24', price: 999, brandId, categoryId },
    })

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/products/${product.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { price: 899, status: 'PUBLISHED' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().price).toBe(899)
    expect(res.json().status).toBe('PUBLISHED')
  })

  it('replaces images when images array is provided', async () => {
    const product = await testPrisma.product.create({
      data: {
        name: 'Galaxy S24',
        slug: 'galaxy-s24',
        price: 999,
        brandId,
        categoryId,
        images: { create: [{ url: '/old.jpg', position: 0 }] },
      },
    })

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/products/${product.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { images: [{ url: '/new1.jpg', position: 0 }, { url: '/new2.jpg', position: 1 }] },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().images).toHaveLength(2)
  })

  it('returns 404 for nonexistent product', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/products/nonexistent',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { price: 899 },
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/v1/products/:id', () => {
  it('deletes product and cascades images', async () => {
    const product = await testPrisma.product.create({
      data: {
        name: 'Galaxy S24',
        slug: 'galaxy-s24',
        price: 999,
        brandId,
        categoryId,
        images: { create: [{ url: '/img.jpg', position: 0 }] },
      },
    })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/products/${product.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
    })
    expect(res.statusCode).toBe(204)

    const found = await testPrisma.product.findUnique({ where: { id: product.id } })
    const images = await testPrisma.productImage.findMany({ where: { productId: product.id } })
    expect(found).toBeNull()
    expect(images).toHaveLength(0)
  })

  it('returns 404 for nonexistent product', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/v1/products/nonexistent',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
    })
    expect(res.statusCode).toBe(404)
  })
})

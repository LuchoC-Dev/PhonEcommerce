import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeUserToken } from '../../../__tests__/helpers/auth'

let app: FastifyInstance
let brandId: string
let categoryId: string
let productId: string

const USER_TOKEN = makeUserToken('test-user-1')
const AUTH_HEADERS = { authorization: `Bearer ${USER_TOKEN}` }

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
  const product = await testPrisma.product.create({
    data: {
      name: 'Galaxy S24',
      slug: 'galaxy-s24',
      price: 999.99,
      status: 'PUBLISHED',
      brandId,
      categoryId,
      images: { create: [{ url: '/s24.jpg', altText: 'S24', position: 0 }] },
    },
  })
  productId = product.id
})

// ─── GET /api/v1/cart ─────────────────────────────────────────────────────────

describe('GET /api/v1/cart', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/cart' })
    expect(res.statusCode).toBe(401)
  })

  it('creates and returns empty cart on first call', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: AUTH_HEADERS })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.accountId).toBe('test-user-1')
    expect(body.items).toEqual([])
    expect(body.expiresAt).toBeDefined()
  })

  it('returns same cart on subsequent calls', async () => {
    const r1 = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: AUTH_HEADERS })
    const r2 = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: AUTH_HEADERS })
    expect(r1.json().id).toBe(r2.json().id)
  })

  it('resets expired cart and returns empty items', async () => {
    const past = new Date(Date.now() - 1000)
    await testPrisma.cart.create({
      data: {
        accountId: 'test-user-1',
        expiresAt: past,
        items: {
          create: [{ productId, quantity: 1, priceAtAdd: 999.99 }],
        },
      },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: AUTH_HEADERS })
    expect(res.statusCode).toBe(200)
    expect(res.json().items).toHaveLength(0)
  })
})

// ─── POST /api/v1/cart/items ──────────────────────────────────────────────────

describe('POST /api/v1/cart/items', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      payload: { productId, quantity: 1 },
    })
    expect(res.statusCode).toBe(401)
  })

  it('adds a product to the cart', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 2 },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.items).toHaveLength(1)
    expect(body.items[0].quantity).toBe(2)
    expect(body.items[0].priceAtAdd).toBe(999.99)
    expect(body.items[0].currentPrice).toBe(999.99)
    expect(body.items[0].product.slug).toBe('galaxy-s24')
  })

  it('sums quantity when same product is added twice', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 1 },
    })
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 3 },
    })
    expect(res.json().items[0].quantity).toBe(4)
  })

  it('returns 404 for non-existent product', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId: 'non-existent', quantity: 1 },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns current price (not stale price) in response', async () => {
    // Add item at price 999.99, then update product price
    await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 1 },
    })

    // Simulate price change in DB
    await testPrisma.product.update({ where: { id: productId }, data: { price: 799.99 } })

    const res = await app.inject({ method: 'GET', url: '/api/v1/cart', headers: AUTH_HEADERS })
    const item = res.json().items[0]
    expect(item.priceAtAdd).toBe(999.99)
    expect(item.currentPrice).toBe(799.99)
  })
})

// ─── PUT /api/v1/cart/items/:productId ───────────────────────────────────────

describe('PUT /api/v1/cart/items/:productId', () => {
  beforeEach(async () => {
    await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 1 },
    })
  })

  it('updates item quantity', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/cart/items/${productId}`,
      headers: AUTH_HEADERS,
      payload: { quantity: 5 },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().items[0].quantity).toBe(5)
  })

  it('returns 400 when quantity is 0', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/cart/items/${productId}`,
      headers: AUTH_HEADERS,
      payload: { quantity: 0 },
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 404 for item not in cart', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/cart/items/non-existent',
      headers: AUTH_HEADERS,
      payload: { quantity: 1 },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── DELETE /api/v1/cart/items/:productId ────────────────────────────────────

describe('DELETE /api/v1/cart/items/:productId', () => {
  beforeEach(async () => {
    await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 2 },
    })
  })

  it('removes item from cart', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/cart/items/${productId}`,
      headers: AUTH_HEADERS,
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().items).toHaveLength(0)
  })

  it('returns 404 for item not in cart', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/v1/cart/items/non-existent',
      headers: AUTH_HEADERS,
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── DELETE /api/v1/cart ──────────────────────────────────────────────────────

describe('DELETE /api/v1/cart', () => {
  it('returns 404 when no cart exists', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/v1/cart', headers: AUTH_HEADERS })
    expect(res.statusCode).toBe(404)
  })

  it('clears all items from cart', async () => {
    // Create cart with items
    await app.inject({
      method: 'POST',
      url: '/api/v1/cart/items',
      headers: AUTH_HEADERS,
      payload: { productId, quantity: 3 },
    })

    const res = await app.inject({ method: 'DELETE', url: '/api/v1/cart', headers: AUTH_HEADERS })
    expect(res.statusCode).toBe(200)
    expect(res.json().items).toHaveLength(0)
  })
})

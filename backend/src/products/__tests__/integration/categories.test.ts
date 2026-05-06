import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeAdminToken } from '../../../__tests__/helpers/auth'

let app: FastifyInstance

beforeAll(async () => {
  app = await buildTestApp()
})

afterAll(async () => {
  await app.close()
  await testPrisma.$disconnect()
})

beforeEach(async () => {
  await cleanDatabase()
})

describe('GET /api/v1/categories', () => {
  it('returns empty array when no categories', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/categories' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual([])
  })

  it('returns tree structure with children', async () => {
    const parent = await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })
    await testPrisma.category.create({ data: { name: 'Android', slug: 'android', parentId: parent.id } })
    await testPrisma.category.create({ data: { name: 'iOS', slug: 'ios', parentId: parent.id } })

    const res = await app.inject({ method: 'GET', url: '/api/v1/categories' })
    expect(res.statusCode).toBe(200)

    const body = res.json()
    expect(body).toHaveLength(1)
    expect(body[0].children).toHaveLength(2)
  })

  it('only returns root categories at top level', async () => {
    await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })
    await testPrisma.category.create({ data: { name: 'Tablets', slug: 'tablets' } })

    const res = await app.inject({ method: 'GET', url: '/api/v1/categories' })
    const body = res.json()
    expect(body).toHaveLength(2)
    body.forEach((cat: { parentId: unknown }) => expect(cat.parentId).toBeNull())
  })
})

describe('POST /api/v1/categories', () => {
  it('creates root category', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/categories',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Smartphones', slug: 'smartphones' },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().parentId).toBeNull()
  })

  it('creates subcategory with parentId', async () => {
    const parent = await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/categories',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Android', slug: 'android', parentId: parent.id },
    })
    expect(res.statusCode).toBe(201)
    expect(res.json().parentId).toBe(parent.id)
  })

  it('returns 409 on duplicate slug', async () => {
    await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/categories',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Smartphones 2', slug: 'smartphones' },
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('PUT /api/v1/categories/:id', () => {
  it('updates category name', async () => {
    const cat = await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/categories/${cat.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Mobile Phones' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().name).toBe('Mobile Phones')
  })
})

describe('DELETE /api/v1/categories/:id', () => {
  it('deletes category', async () => {
    const cat = await testPrisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones' } })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/categories/${cat.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
    })
    expect(res.statusCode).toBe(204)
  })
})

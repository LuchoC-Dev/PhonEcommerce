import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeAdminToken, makeUserToken } from '../../../__tests__/helpers/auth'

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

describe('GET /api/v1/brands', () => {
  it('returns empty array when no brands', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/brands' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual([])
  })

  it('returns list of brands', async () => {
    await testPrisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } })
    await testPrisma.brand.create({ data: { name: 'Apple', slug: 'apple' } })

    const res = await app.inject({ method: 'GET', url: '/api/v1/brands' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toHaveLength(2)
  })
})

describe('POST /api/v1/brands', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/brands',
      payload: { name: 'Samsung', slug: 'samsung' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 403 with user token (no permission)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/brands',
      headers: { authorization: `Bearer ${makeUserToken()}` },
      payload: { name: 'Samsung', slug: 'samsung' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('creates brand with admin token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/brands',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Samsung', slug: 'samsung' },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.name).toBe('Samsung')
    expect(body.slug).toBe('samsung')
    expect(body.id).toBeDefined()
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/brands',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Samsung' }, // missing slug
    })
    expect(res.statusCode).toBe(400)
  })

  it('returns 409 when slug already exists', async () => {
    await testPrisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/brands',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Samsung 2', slug: 'samsung' },
    })
    expect(res.statusCode).toBe(409)
  })
})

describe('PUT /api/v1/brands/:id', () => {
  it('updates brand with admin token', async () => {
    const brand = await testPrisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } })

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/brands/${brand.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'Samsung Electronics' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().name).toBe('Samsung Electronics')
  })

  it('returns 404 when brand does not exist', async () => {
    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/brands/nonexistent-id',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
      payload: { name: 'New Name' },
    })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /api/v1/brands/:id', () => {
  it('deletes brand with admin token', async () => {
    const brand = await testPrisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } })

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/brands/${brand.id}`,
      headers: { authorization: `Bearer ${makeAdminToken()}` },
    })
    expect(res.statusCode).toBe(204)

    const found = await testPrisma.brand.findUnique({ where: { id: brand.id } })
    expect(found).toBeNull()
  })

  it('returns 404 when brand does not exist', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: '/api/v1/brands/nonexistent-id',
      headers: { authorization: `Bearer ${makeAdminToken()}` },
    })
    expect(res.statusCode).toBe(404)
  })
})

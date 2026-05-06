import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeAdminToken, makeUserToken } from '../../../__tests__/helpers/auth'

let app: FastifyInstance
let productId: string

const ADMIN_TOKEN = makeAdminToken('test-admin-1')
const USER_TOKEN = makeUserToken('test-user-1')
const ADMIN_HEADERS = { authorization: `Bearer ${ADMIN_TOKEN}` }
const USER_HEADERS = { authorization: `Bearer ${USER_TOKEN}` }

beforeAll(async () => {
  app = await buildTestApp()
})

afterAll(async () => {
  await app.close()
  await testPrisma.$disconnect()
})

beforeEach(async () => {
  await cleanDatabase()
  const brand = await testPrisma.brand.create({ data: { name: 'Apple', slug: 'apple' } })
  const category = await testPrisma.category.create({ data: { name: 'Phones', slug: 'phones' } })
  const product = await testPrisma.product.create({
    data: {
      name: 'iPhone 15',
      slug: 'iphone-15',
      price: 1299,
      stock: 20,
      status: 'PUBLISHED',
      brandId: brand.id,
      categoryId: category.id,
    },
  })
  productId = product.id
})

// ─── GET /api/v1/stock/:productId ─────────────────────────────────────────────

describe('GET /api/v1/stock/:productId', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/v1/stock/${productId}` })
    expect(res.statusCode).toBe(401)
  })

  it('returns 403 for regular user', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/v1/stock/${productId}`, headers: USER_HEADERS })
    expect(res.statusCode).toBe(403)
  })

  it('returns current stock level for admin', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/v1/stock/${productId}`, headers: ADMIN_HEADERS })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.productId).toBe(productId)
    expect(body.quantity).toBe(20)
  })

  it('returns 404 for unknown product', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/stock/nonexistent', headers: ADMIN_HEADERS })
    expect(res.statusCode).toBe(404)
  })
})

// ─── POST /api/v1/stock/:productId/adjust ─────────────────────────────────────

describe('POST /api/v1/stock/:productId/adjust', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      payload: { delta: 10, type: 'RESTOCK' },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 403 for regular user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: USER_HEADERS,
      payload: { delta: 10, type: 'RESTOCK' },
    })
    expect(res.statusCode).toBe(403)
  })

  it('adds stock with RESTOCK and returns movement', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: 10, type: 'RESTOCK', reason: 'New batch' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.type).toBe('RESTOCK')
    expect(body.quantity).toBe(10)
    expect(body.stockBefore).toBe(20)
    expect(body.stockAfter).toBe(30)
    expect(body.reason).toBe('New batch')

    // Verify product stock was updated
    const product = await testPrisma.product.findUnique({ where: { id: productId } })
    expect(product?.stock).toBe(30)
  })

  it('removes stock with ADJUSTMENT', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: -5, type: 'ADJUSTMENT' },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.stockAfter).toBe(15)
  })

  it('returns 409 when deduction exceeds stock', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: -100, type: 'ADJUSTMENT' },
    })
    expect(res.statusCode).toBe(409)
  })

  it('returns 400 when delta is 0', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: 0, type: 'RESTOCK' },
    })
    expect(res.statusCode).toBe(400)
  })
})

// ─── GET /api/v1/stock/:productId/movements ────────────────────────────────────

describe('GET /api/v1/stock/:productId/movements', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: `/api/v1/stock/${productId}/movements` })
    expect(res.statusCode).toBe(401)
  })

  it('returns empty movements page when no history', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/stock/${productId}/movements`,
      headers: ADMIN_HEADERS,
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.data).toEqual([])
    expect(body.total).toBe(0)
    expect(body.page).toBe(1)
    expect(body.pageSize).toBe(20)
  })

  it('returns movements after adjustments, newest first', async () => {
    // Create two movements
    await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: 5, type: 'RESTOCK' },
    })
    await app.inject({
      method: 'POST',
      url: `/api/v1/stock/${productId}/adjust`,
      headers: ADMIN_HEADERS,
      payload: { delta: -2, type: 'ADJUSTMENT' },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/stock/${productId}/movements`,
      headers: ADMIN_HEADERS,
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.total).toBe(2)
    expect(body.data[0].type).toBe('ADJUSTMENT') // newest first
    expect(body.data[1].type).toBe('RESTOCK')
  })
})

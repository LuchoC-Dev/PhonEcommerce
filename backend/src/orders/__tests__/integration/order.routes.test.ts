import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'
import { makeUserToken, makeAdminToken } from '../../../__tests__/helpers/auth'

let app: FastifyInstance
let brandId: string
let categoryId: string
let productId: string

const USER_ID = 'test-user-orders'
const ADMIN_ID = 'test-admin-orders'

const USER_TOKEN = makeUserToken(USER_ID)
const ADMIN_TOKEN = makeAdminToken(ADMIN_ID)

const USER_HEADERS = { authorization: `Bearer ${USER_TOKEN}` }
const ADMIN_HEADERS = { authorization: `Bearer ${ADMIN_TOKEN}` }

const shipping = {
  name: 'John Doe',
  address: '123 Main St',
  city: 'Buenos Aires',
  country: 'AR',
  zipCode: '1000',
}

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
  brandId = brand.id
  categoryId = category.id
  const product = await testPrisma.product.create({
    data: {
      name: 'iPhone 15',
      slug: 'iphone-15',
      price: 1000,
      stock: 10,
      status: 'PUBLISHED',
      brandId,
      categoryId,
    },
  })
  productId = product.id
})

async function addProductToCart(userId: string, token: string) {
  // Ensure cart exists first
  await app.inject({ method: 'GET', url: '/api/v1/cart', headers: { authorization: `Bearer ${token}` } })
  return app.inject({
    method: 'POST',
    url: '/api/v1/cart/items',
    headers: { authorization: `Bearer ${token}` },
    payload: { productId, quantity: 2 },
  })
}

// ─── Preview from cart ─────────────────────────────────────────────────────────

describe('POST /api/v1/orders/checkout/preview', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/preview',
      payload: { shipping },
    })
    expect(res.statusCode).toBe(401)
  })

  it('returns 404 when cart does not exist', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/preview',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns preview with current prices', async () => {
    await addProductToCart(USER_ID, USER_TOKEN)

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/preview',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.items).toHaveLength(1)
    expect(body.items[0].unitPrice).toBe(1000)
    expect(body.totalAmount).toBe(2000)
  })
})

// ─── Confirm from cart ─────────────────────────────────────────────────────────

describe('POST /api/v1/orders/checkout/confirm', () => {
  it('creates order, deducts stock, clears cart', async () => {
    await addProductToCart(USER_ID, USER_TOKEN)

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/confirm',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    expect(res.statusCode).toBe(201)
    const order = res.json()
    expect(order.status).toBe('PENDING')
    expect(order.totalAmount).toBe(2000)
    expect(order.items).toHaveLength(1)
    expect(order.statusHistory).toHaveLength(1)

    // Stock deducted
    const product = await testPrisma.product.findUnique({ where: { id: productId } })
    expect(product!.stock).toBe(8)

    // Cart cleared
    const cart = await testPrisma.cart.findUnique({
      where: { accountId: USER_ID },
      include: { items: true },
    })
    expect(cart!.items).toHaveLength(0)
  })

  it('returns 409 when stock is insufficient', async () => {
    await testPrisma.product.update({ where: { id: productId }, data: { stock: 1 } })
    await addProductToCart(USER_ID, USER_TOKEN)

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/confirm',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    expect(res.statusCode).toBe(409)
  })
})

// ─── Quick buy ─────────────────────────────────────────────────────────────────

describe('POST /api/v1/orders/quick-buy/confirm', () => {
  it('creates order for single product', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/quick-buy/confirm',
      headers: USER_HEADERS,
      payload: { productId, quantity: 1, shipping },
    })
    expect(res.statusCode).toBe(201)
    const order = res.json()
    expect(order.totalAmount).toBe(1000)
    expect(order.items[0].quantity).toBe(1)

    const product = await testPrisma.product.findUnique({ where: { id: productId } })
    expect(product!.stock).toBe(9)
  })

  it('returns 404 for unknown product', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/quick-buy/confirm',
      headers: USER_HEADERS,
      payload: { productId: 'nonexistent', quantity: 1, shipping },
    })
    expect(res.statusCode).toBe(404)
  })
})

// ─── List & detail ─────────────────────────────────────────────────────────────

describe('GET /api/v1/orders', () => {
  it('returns own orders for user', async () => {
    await addProductToCart(USER_ID, USER_TOKEN)
    await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/confirm',
      headers: USER_HEADERS,
      payload: { shipping },
    })

    const res = await app.inject({ method: 'GET', url: '/api/v1/orders', headers: USER_HEADERS })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.total).toBe(1)
    expect(body.data[0].accountId).toBe(USER_ID)
  })
})

// ─── Cancel ───────────────────────────────────────────────────────────────────

describe('PATCH /api/v1/orders/:id/cancel', () => {
  it('user cancels own PENDING order', async () => {
    await addProductToCart(USER_ID, USER_TOKEN)
    const confirmRes = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/confirm',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    const orderId = confirmRes.json().id

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/orders/${orderId}/cancel`,
      headers: USER_HEADERS,
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('CANCELLED')
  })
})

// ─── Admin status update ───────────────────────────────────────────────────────

describe('PATCH /api/v1/orders/:id/status', () => {
  it('admin transitions PENDING → CONFIRMED', async () => {
    await addProductToCart(USER_ID, USER_TOKEN)
    const confirmRes = await app.inject({
      method: 'POST',
      url: '/api/v1/orders/checkout/confirm',
      headers: USER_HEADERS,
      payload: { shipping },
    })
    const orderId = confirmRes.json().id

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/orders/${orderId}/status`,
      headers: ADMIN_HEADERS,
      payload: { status: 'CONFIRMED' },
    })
    expect(res.statusCode).toBe(200)
    expect(res.json().status).toBe('CONFIRMED')
  })

  it('returns 403 for non-admin', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/v1/orders/some-id/status',
      headers: USER_HEADERS,
      payload: { status: 'CONFIRMED' },
    })
    expect(res.statusCode).toBe(403)
  })
})

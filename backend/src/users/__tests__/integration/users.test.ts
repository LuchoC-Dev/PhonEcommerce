import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { FastifyInstance } from 'fastify'
import { buildTestApp } from '../../../__tests__/helpers/app'
import { cleanDatabase, testPrisma } from '../../../__tests__/helpers/db'

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

async function registerAndLogin() {
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: { email: 'user@test.com', username: 'testuser', password: 'password123', name: 'Test User' },
  })
  return res.json() as { accessToken: string; account: { id: string } }
}

const addressPayload = {
  street: 'Av. Corrientes 1234',
  city: 'Buenos Aires',
  country: 'Argentina',
  zipCode: '1043',
}

// ─── Profile ──────────────────────────────────────────────────────────────────

describe('GET /api/v1/users/profile', () => {
  it('returns profile with empty addresses', async () => {
    const { accessToken } = await registerAndLogin()

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users/profile',
      headers: { authorization: `Bearer ${accessToken}` },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.name).toBe('Test User')
    expect(body.addresses).toEqual([])
    expect(body.accountId).toBeDefined()
  })

  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/users/profile' })
    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /api/v1/users/profile', () => {
  it('updates profile fields', async () => {
    const { accessToken } = await registerAndLogin()

    const res = await app.inject({
      method: 'PUT',
      url: '/api/v1/users/profile',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { name: 'Updated Name', bio: 'Hello world', phone: '+5491112345678' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.name).toBe('Updated Name')
    expect(body.bio).toBe('Hello world')
    expect(body.phone).toBe('+5491112345678')
  })

  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'PUT', url: '/api/v1/users/profile', payload: { name: 'X' } })
    expect(res.statusCode).toBe(401)
  })
})

// ─── Addresses ────────────────────────────────────────────────────────────────

describe('POST /api/v1/users/addresses', () => {
  it('creates address and marks it as default (first address)', async () => {
    const { accessToken } = await registerAndLogin()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: addressPayload,
    })

    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.street).toBe('Av. Corrientes 1234')
    expect(body.isDefault).toBe(true)
  })

  it('second address is not default by default', async () => {
    const { accessToken } = await registerAndLogin()

    await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: addressPayload,
    })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { ...addressPayload, street: 'Otra calle 567' },
    })

    expect(res.statusCode).toBe(201)
    expect(res.json().isDefault).toBe(false)
  })

  it('returns 400 when required fields are missing', async () => {
    const { accessToken } = await registerAndLogin()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { street: 'Only street' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/users/addresses', payload: addressPayload })
    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /api/v1/users/addresses/:id', () => {
  it('updates address fields', async () => {
    const { accessToken } = await registerAndLogin()

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: addressPayload,
    })
    const addressId = createRes.json().id

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/addresses/${addressId}`,
      headers: { authorization: `Bearer ${accessToken}` },
      payload: { city: 'Rosario' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().city).toBe('Rosario')
  })

  it('returns 403 when address belongs to another user', async () => {
    const { accessToken: token1 } = await registerAndLogin()
    const { accessToken: token2 } = await (async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: { email: 'other@test.com', username: 'otheruser', password: 'password123', name: 'Other User' },
      })
      return res.json()
    })()

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${token1}` },
      payload: addressPayload,
    })
    const addressId = createRes.json().id

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/addresses/${addressId}`,
      headers: { authorization: `Bearer ${token2}` },
      payload: { city: 'Hack' },
    })

    expect(res.statusCode).toBe(403)
  })
})

describe('DELETE /api/v1/users/addresses/:id', () => {
  it('deletes address', async () => {
    const { accessToken } = await registerAndLogin()

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${accessToken}` },
      payload: addressPayload,
    })
    const addressId = createRes.json().id

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/users/addresses/${addressId}`,
      headers: { authorization: `Bearer ${accessToken}` },
    })

    expect(res.statusCode).toBe(204)

    const found = await testPrisma.address.findUnique({ where: { id: addressId } })
    expect(found).toBeNull()
  })

  it('returns 403 when address belongs to another user', async () => {
    const { accessToken: token1 } = await registerAndLogin()
    const { accessToken: token2 } = await (async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/register',
        payload: { email: 'other@test.com', username: 'otheruser', password: 'password123', name: 'Other User' },
      })
      return res.json()
    })()

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/users/addresses',
      headers: { authorization: `Bearer ${token1}` },
      payload: addressPayload,
    })
    const addressId = createRes.json().id

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/users/addresses/${addressId}`,
      headers: { authorization: `Bearer ${token2}` },
    })

    expect(res.statusCode).toBe(403)
  })

  it('returns 404 for nonexistent address', async () => {
    const { accessToken } = await registerAndLogin()

    const res = await app.inject({
      method: 'DELETE',
      url: '/api/v1/users/addresses/nonexistent-id',
      headers: { authorization: `Bearer ${accessToken}` },
    })

    expect(res.statusCode).toBe(404)
  })
})

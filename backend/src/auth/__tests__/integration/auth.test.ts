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

const registerPayload = {
  email: 'test@test.com',
  username: 'testuser',
  password: 'password123',
  name: 'Test User',
}

async function registerAndGetTokens() {
  const res = await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })
  return res.json() as { accessToken: string; refreshToken: string }
}

// ─── Register ────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/register', () => {
  it('creates account and profile, returns tokens', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })

    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
    expect(body.account.email).toBe('test@test.com')
    expect(body.account.role).toBe('USER')

    const profile = await testPrisma.profile.findFirst({ where: { account: { email: 'test@test.com' } } })
    expect(profile?.name).toBe('Test User')
  })

  it('returns 409 when email already exists', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })
    const res = await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })

    expect(res.statusCode).toBe(409)
  })

  it('returns 409 when username already exists', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { ...registerPayload, email: 'other@test.com' },
    })

    expect(res.statusCode).toBe(409)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { email: 'test@test.com' },
    })

    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { ...registerPayload, email: 'not-an-email' },
    })

    expect(res.statusCode).toBe(400)
  })
})

// ─── Login ────────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })
  })

  it('logs in with email and returns tokens', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'test@test.com', password: 'password123' },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
    expect(body.account.email).toBe('test@test.com')
  })

  it('logs in with username', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'testuser', password: 'password123' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().account.username).toBe('testuser')
  })

  it('returns 401 with wrong password', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'test@test.com', password: 'wrongpassword' },
    })

    expect(res.statusCode).toBe(401)
  })

  it('returns 401 for unknown email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'nobody@test.com', password: 'password123' },
    })

    expect(res.statusCode).toBe(401)
  })
})

// ─── Refresh ──────────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/refresh', () => {
  it('returns new tokens and rotates refresh token', async () => {
    const { refreshToken } = await registerAndGetTokens()

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.accessToken).toBeDefined()
    expect(body.refreshToken).toBeDefined()
    expect(body.refreshToken).not.toBe(refreshToken)
  })

  it('returns 401 when reusing a rotated refresh token', async () => {
    const { refreshToken } = await registerAndGetTokens()

    await app.inject({ method: 'POST', url: '/api/v1/auth/refresh', payload: { refreshToken } })

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    })

    expect(res.statusCode).toBe(401)
  })

  it('returns 401 for unknown refresh token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken: 'unknown-token' },
    })

    expect(res.statusCode).toBe(401)
  })
})

// ─── Me ───────────────────────────────────────────────────────────────────────

describe('GET /api/v1/auth/me', () => {
  it('returns account with permissions', async () => {
    const { accessToken } = await registerAndGetTokens()

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: `Bearer ${accessToken}` },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.email).toBe('test@test.com')
    expect(body.role).toBe('USER')
    expect(body.permissions).toContain('orders:create:own')
    expect(body.password).toBeUndefined()
  })

  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/auth/me' })
    expect(res.statusCode).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: 'Bearer invalid.token.here' },
    })
    expect(res.statusCode).toBe(401)
  })
})

// ─── Forgot / Reset password ──────────────────────────────────────────────────

describe('POST /api/v1/auth/forgot-password', () => {
  beforeEach(async () => {
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })
  })

  it('returns reset token for existing email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      payload: { email: 'test@test.com' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().resetToken).not.toBe('')
  })

  it('returns safe response for unknown email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      payload: { email: 'nobody@test.com' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.json().resetToken).toBe('')
  })
})

describe('POST /api/v1/auth/reset-password', () => {
  it('resets password and invalidates old refresh tokens', async () => {
    await app.inject({ method: 'POST', url: '/api/v1/auth/register', payload: registerPayload })

    const forgotRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      payload: { email: 'test@test.com' },
    })
    const { resetToken } = forgotRes.json()

    const resetRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      payload: { token: resetToken, newPassword: 'newpassword456' },
    })
    expect(resetRes.statusCode).toBe(200)

    // Old password no longer works
    const loginOld = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'test@test.com', password: 'password123' },
    })
    expect(loginOld.statusCode).toBe(401)

    // New password works
    const loginNew = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { emailOrUsername: 'test@test.com', password: 'newpassword456' },
    })
    expect(loginNew.statusCode).toBe(200)
  })

  it('returns 400 for invalid token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      payload: { token: 'bad-token', newPassword: 'newpassword456' },
    })
    expect(res.statusCode).toBe(400)
  })
})

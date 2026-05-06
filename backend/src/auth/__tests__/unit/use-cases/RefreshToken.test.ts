import { describe, it, expect, vi } from 'vitest'
import { RefreshTokenUseCase } from '../../../application/use-cases/RefreshToken'
import { IAuthRepository } from '../../../domain/repositories/auth.repository'
import { ITokenService } from '@shared/utils/token.service'
import { UnauthorizedError } from '@shared/errors/AppError'
import { AccountWithPermissions, RefreshToken } from '../../../domain/entities/auth.entity'

const mockRefreshToken: RefreshToken = {
  id: 'rt-1',
  token: 'valid-refresh',
  accountId: 'acc-1',
  expiresAt: new Date(Date.now() + 60_000),
  isRevoked: false,
  revokedAt: null,
  createdAt: new Date(),
}

const mockAccount: AccountWithPermissions = {
  id: 'acc-1',
  email: 'test@test.com',
  username: 'testuser',
  password: 'hashed',
  role: 'USER',
  isActive: true,
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}

function makeAuthRepo(overrides?: Partial<IAuthRepository>): IAuthRepository {
  return {
    findAccountById: vi.fn(),
    findAccountByEmail: vi.fn(),
    findAccountByUsername: vi.fn(),
    findAccountWithPermissions: vi.fn().mockResolvedValue(mockAccount),
    createAccount: vi.fn(),
    createRefreshToken: vi.fn().mockResolvedValue({}),
    findRefreshToken: vi.fn().mockResolvedValue(mockRefreshToken),
    revokeRefreshToken: vi.fn().mockResolvedValue(undefined),
    revokeAllRefreshTokens: vi.fn(),
    createPasswordReset: vi.fn(),
    findPasswordReset: vi.fn(),
    markPasswordResetUsed: vi.fn(),
    updateAccountPassword: vi.fn(),
    ...overrides,
  }
}

function makeTokenService(): ITokenService {
  return {
    generateAccessToken: vi.fn().mockReturnValue('new-access-token'),
    generateRefreshToken: vi.fn().mockReturnValue('new-refresh-token'),
    verifyAccessToken: vi.fn(),
  }
}

describe('RefreshTokenUseCase', () => {
  it('rotates refresh token and returns new tokens', async () => {
    const repo = makeAuthRepo()
    const useCase = new RefreshTokenUseCase(repo, makeTokenService())

    const result = await useCase.execute({ refreshToken: 'valid-refresh' })

    expect(result.accessToken).toBe('new-access-token')
    expect(result.refreshToken).toBe('new-refresh-token')
    expect(repo.revokeRefreshToken).toHaveBeenCalledWith('valid-refresh')
    expect(repo.createRefreshToken).toHaveBeenCalled()
  })

  it('throws UnauthorizedError when token not found', async () => {
    const repo = makeAuthRepo({ findRefreshToken: vi.fn().mockResolvedValue(null) })
    const useCase = new RefreshTokenUseCase(repo, makeTokenService())

    await expect(useCase.execute({ refreshToken: 'unknown' })).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when token is revoked', async () => {
    const repo = makeAuthRepo({
      findRefreshToken: vi.fn().mockResolvedValue({ ...mockRefreshToken, isRevoked: true }),
    })
    const useCase = new RefreshTokenUseCase(repo, makeTokenService())

    await expect(useCase.execute({ refreshToken: 'valid-refresh' })).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when token is expired', async () => {
    const repo = makeAuthRepo({
      findRefreshToken: vi.fn().mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 60_000),
      }),
    })
    const useCase = new RefreshTokenUseCase(repo, makeTokenService())

    await expect(useCase.execute({ refreshToken: 'valid-refresh' })).rejects.toThrow(UnauthorizedError)
  })
})

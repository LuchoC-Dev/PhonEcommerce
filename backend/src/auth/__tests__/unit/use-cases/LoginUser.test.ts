import { describe, it, expect, vi } from 'vitest'
import { LoginUser } from '../../../application/use-cases/LoginUser'
import { IAuthRepository } from '../../../domain/repositories/auth.repository'
import { IHashService } from '@shared/utils/hash.service'
import { ITokenService } from '@shared/utils/token.service'
import { UnauthorizedError } from '@shared/errors/AppError'
import { Account, AccountWithPermissions } from '../../../domain/entities/auth.entity'

const mockAccount: Account = {
  id: 'acc-1',
  email: 'test@test.com',
  username: 'testuser',
  password: 'hashed',
  role: 'USER',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockAccountWithPerms: AccountWithPermissions = { ...mockAccount, permissions: [] }

function makeAuthRepo(overrides?: Partial<IAuthRepository>): IAuthRepository {
  return {
    findAccountById: vi.fn(),
    findAccountByEmail: vi.fn().mockResolvedValue(mockAccount),
    findAccountByUsername: vi.fn().mockResolvedValue(mockAccount),
    findAccountWithPermissions: vi.fn().mockResolvedValue(mockAccountWithPerms),
    createAccount: vi.fn(),
    createRefreshToken: vi.fn().mockResolvedValue({}),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
    revokeAllRefreshTokens: vi.fn(),
    createPasswordReset: vi.fn(),
    findPasswordReset: vi.fn(),
    markPasswordResetUsed: vi.fn(),
    updateAccountPassword: vi.fn(),
    ...overrides,
  }
}

function makeHashService(valid = true): IHashService {
  return {
    hash: vi.fn(),
    compare: vi.fn().mockResolvedValue(valid),
  }
}

function makeTokenService(): ITokenService {
  return {
    generateAccessToken: vi.fn().mockReturnValue('access-token'),
    generateRefreshToken: vi.fn().mockReturnValue('refresh-token'),
    verifyAccessToken: vi.fn(),
  }
}

describe('LoginUser', () => {
  it('logs in with email and returns tokens', async () => {
    const useCase = new LoginUser(makeAuthRepo(), makeHashService(), makeTokenService())
    const result = await useCase.execute({ emailOrUsername: 'test@test.com', password: 'password123' })

    expect(result.accessToken).toBe('access-token')
    expect(result.refreshToken).toBe('refresh-token')
    expect(result.account.email).toBe('test@test.com')
  })

  it('logs in with username', async () => {
    const useCase = new LoginUser(makeAuthRepo(), makeHashService(), makeTokenService())
    const result = await useCase.execute({ emailOrUsername: 'testuser', password: 'password123' })

    expect(result.account.username).toBe('testuser')
  })

  it('throws UnauthorizedError when account not found', async () => {
    const repo = makeAuthRepo({
      findAccountByEmail: vi.fn().mockResolvedValue(null),
      findAccountByUsername: vi.fn().mockResolvedValue(null),
    })
    const useCase = new LoginUser(repo, makeHashService(), makeTokenService())

    await expect(useCase.execute({ emailOrUsername: 'no@no.com', password: 'x' })).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when password is wrong', async () => {
    const useCase = new LoginUser(makeAuthRepo(), makeHashService(false), makeTokenService())

    await expect(useCase.execute({ emailOrUsername: 'test@test.com', password: 'wrong' })).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when account is inactive', async () => {
    const repo = makeAuthRepo({
      findAccountByEmail: vi.fn().mockResolvedValue({ ...mockAccount, isActive: false }),
    })
    const useCase = new LoginUser(repo, makeHashService(), makeTokenService())

    await expect(useCase.execute({ emailOrUsername: 'test@test.com', password: 'password123' })).rejects.toThrow(UnauthorizedError)
  })
})

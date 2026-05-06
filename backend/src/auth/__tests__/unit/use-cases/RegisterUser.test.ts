import { describe, it, expect, vi } from 'vitest'
import { RegisterUser } from '../../../application/use-cases/RegisterUser'
import { IAuthRepository } from '../../../domain/repositories/auth.repository'
import { IUserRepository } from '../../../../users/domain/repositories/user.repository'
import { IHashService } from '@shared/utils/hash.service'
import { ITokenService } from '@shared/utils/token.service'
import { ConflictError } from '@shared/errors/AppError'
import { Account } from '../../../domain/entities/auth.entity'

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

function makeAuthRepo(overrides?: Partial<IAuthRepository>): IAuthRepository {
  return {
    findAccountById: vi.fn().mockResolvedValue(null),
    findAccountByEmail: vi.fn().mockResolvedValue(null),
    findAccountByUsername: vi.fn().mockResolvedValue(null),
    findAccountWithPermissions: vi.fn().mockResolvedValue(null),
    createAccount: vi.fn().mockResolvedValue(mockAccount),
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

function makeUserRepo(): IUserRepository {
  return {
    findProfileByAccountId: vi.fn().mockResolvedValue(null),
    createProfile: vi.fn().mockResolvedValue({}),
    updateProfile: vi.fn(),
    findAddressById: vi.fn(),
    addAddress: vi.fn(),
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    setDefaultAddress: vi.fn(),
  }
}

function makeHashService(): IHashService {
  return {
    hash: vi.fn().mockResolvedValue('hashed'),
    compare: vi.fn(),
  }
}

function makeTokenService(): ITokenService {
  return {
    generateAccessToken: vi.fn().mockReturnValue('access-token'),
    generateRefreshToken: vi.fn().mockReturnValue('refresh-token'),
    verifyAccessToken: vi.fn(),
  }
}

const input = { email: 'test@test.com', username: 'testuser', password: 'password123', name: 'Test User' }

describe('RegisterUser', () => {
  it('registers user and returns tokens', async () => {
    const authRepo = makeAuthRepo()
    const userRepo = makeUserRepo()
    const useCase = new RegisterUser(authRepo, userRepo, makeHashService(), makeTokenService())

    const result = await useCase.execute(input)

    expect(result.accessToken).toBe('access-token')
    expect(result.refreshToken).toBe('refresh-token')
    expect(result.account.email).toBe('test@test.com')
    expect(authRepo.createAccount).toHaveBeenCalled()
    expect(userRepo.createProfile).toHaveBeenCalledWith({ name: 'Test User', accountId: 'acc-1' })
    expect(authRepo.createRefreshToken).toHaveBeenCalled()
  })

  it('throws ConflictError when email already exists', async () => {
    const authRepo = makeAuthRepo({ findAccountByEmail: vi.fn().mockResolvedValue(mockAccount) })
    const useCase = new RegisterUser(authRepo, makeUserRepo(), makeHashService(), makeTokenService())

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError)
    expect(authRepo.createAccount).not.toHaveBeenCalled()
  })

  it('throws ConflictError when username already exists', async () => {
    const authRepo = makeAuthRepo({ findAccountByUsername: vi.fn().mockResolvedValue(mockAccount) })
    const useCase = new RegisterUser(authRepo, makeUserRepo(), makeHashService(), makeTokenService())

    await expect(useCase.execute(input)).rejects.toThrow(ConflictError)
    expect(authRepo.createAccount).not.toHaveBeenCalled()
  })
})

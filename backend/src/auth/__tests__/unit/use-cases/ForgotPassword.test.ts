import { describe, it, expect, vi } from 'vitest'
import { ForgotPassword } from '../../../application/use-cases/ForgotPassword'
import { IAuthRepository } from '../../../domain/repositories/auth.repository'
import { ITokenService } from '@shared/utils/token.service'
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
    findAccountById: vi.fn(),
    findAccountByEmail: vi.fn().mockResolvedValue(mockAccount),
    findAccountByUsername: vi.fn(),
    findAccountWithPermissions: vi.fn(),
    createAccount: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
    revokeAllRefreshTokens: vi.fn(),
    createPasswordReset: vi.fn().mockResolvedValue({}),
    findPasswordReset: vi.fn(),
    markPasswordResetUsed: vi.fn(),
    updateAccountPassword: vi.fn(),
    ...overrides,
  }
}

function makeTokenService(): ITokenService {
  return {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn().mockReturnValue('reset-token-123'),
    verifyAccessToken: vi.fn(),
  }
}

describe('ForgotPassword', () => {
  it('returns reset token when email exists', async () => {
    const repo = makeAuthRepo()
    const useCase = new ForgotPassword(repo, makeTokenService())

    const result = await useCase.execute({ email: 'test@test.com' })

    expect(result.resetToken).toBe('reset-token-123')
    expect(repo.createPasswordReset).toHaveBeenCalled()
  })

  it('returns empty token (safe response) when email does not exist', async () => {
    const repo = makeAuthRepo({ findAccountByEmail: vi.fn().mockResolvedValue(null) })
    const useCase = new ForgotPassword(repo, makeTokenService())

    const result = await useCase.execute({ email: 'unknown@no.com' })

    expect(result.resetToken).toBe('')
    expect(repo.createPasswordReset).not.toHaveBeenCalled()
  })

  it('returns empty token (safe response) when account is inactive', async () => {
    const repo = makeAuthRepo({
      findAccountByEmail: vi.fn().mockResolvedValue({ ...mockAccount, isActive: false }),
    })
    const useCase = new ForgotPassword(repo, makeTokenService())

    const result = await useCase.execute({ email: 'test@test.com' })

    expect(result.resetToken).toBe('')
    expect(repo.createPasswordReset).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { ResetPassword } from '../../../application/use-cases/ResetPassword'
import { IAuthRepository } from '../../../domain/repositories/auth.repository'
import { IHashService } from '@shared/utils/hash.service'
import { AppError } from '@shared/errors/AppError'
import { PasswordReset } from '../../../domain/entities/auth.entity'

const mockReset: PasswordReset = {
  id: 'pr-1',
  token: 'valid-token',
  accountId: 'acc-1',
  expiresAt: new Date(Date.now() + 60_000),
  usedAt: null,
  createdAt: new Date(),
}

function makeAuthRepo(overrides?: Partial<IAuthRepository>): IAuthRepository {
  return {
    findAccountById: vi.fn(),
    findAccountByEmail: vi.fn(),
    findAccountByUsername: vi.fn(),
    findAccountWithPermissions: vi.fn(),
    createAccount: vi.fn(),
    createRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    revokeRefreshToken: vi.fn(),
    revokeAllRefreshTokens: vi.fn().mockResolvedValue(undefined),
    createPasswordReset: vi.fn(),
    findPasswordReset: vi.fn().mockResolvedValue(mockReset),
    markPasswordResetUsed: vi.fn().mockResolvedValue(undefined),
    updateAccountPassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function makeHashService(): IHashService {
  return {
    hash: vi.fn().mockResolvedValue('new-hashed'),
    compare: vi.fn(),
  }
}

describe('ResetPassword', () => {
  it('resets password with valid token', async () => {
    const repo = makeAuthRepo()
    const useCase = new ResetPassword(repo, makeHashService())

    await useCase.execute({ token: 'valid-token', newPassword: 'newpass123' })

    expect(repo.updateAccountPassword).toHaveBeenCalledWith('acc-1', 'new-hashed')
    expect(repo.markPasswordResetUsed).toHaveBeenCalledWith('valid-token')
    expect(repo.revokeAllRefreshTokens).toHaveBeenCalledWith('acc-1')
  })

  it('throws AppError when token not found', async () => {
    const repo = makeAuthRepo({ findPasswordReset: vi.fn().mockResolvedValue(null) })
    const useCase = new ResetPassword(repo, makeHashService())

    await expect(useCase.execute({ token: 'bad', newPassword: 'newpass123' })).rejects.toThrow(AppError)
  })

  it('throws AppError when token already used', async () => {
    const repo = makeAuthRepo({
      findPasswordReset: vi.fn().mockResolvedValue({ ...mockReset, usedAt: new Date() }),
    })
    const useCase = new ResetPassword(repo, makeHashService())

    await expect(useCase.execute({ token: 'valid-token', newPassword: 'newpass123' })).rejects.toThrow(AppError)
  })

  it('throws AppError when token is expired', async () => {
    const repo = makeAuthRepo({
      findPasswordReset: vi.fn().mockResolvedValue({
        ...mockReset,
        expiresAt: new Date(Date.now() - 60_000),
      }),
    })
    const useCase = new ResetPassword(repo, makeHashService())

    await expect(useCase.execute({ token: 'valid-token', newPassword: 'newpass123' })).rejects.toThrow(AppError)
  })
})

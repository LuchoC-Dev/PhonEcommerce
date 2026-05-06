import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { IHashService } from '@shared/utils/hash.service'
import { AppError } from '@shared/errors/AppError'

interface ResetPasswordInput {
  token: string
  newPassword: string
}

export class ResetPassword {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const reset = await this.authRepository.findPasswordReset(input.token)

    if (!reset) throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN')
    if (reset.usedAt) throw new AppError('Reset token already used', 400, 'TOKEN_USED')
    if (reset.expiresAt < new Date()) throw new AppError('Reset token expired', 400, 'TOKEN_EXPIRED')

    const hashedPassword = await this.hashService.hash(input.newPassword)

    await Promise.all([
      this.authRepository.updateAccountPassword(reset.accountId, hashedPassword),
      this.authRepository.markPasswordResetUsed(input.token),
      this.authRepository.revokeAllRefreshTokens(reset.accountId),
    ])
  }
}

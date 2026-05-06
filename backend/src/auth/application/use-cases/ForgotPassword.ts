import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { ITokenService } from '@shared/utils/token.service'

interface ForgotPasswordInput {
  email: string
}

interface ForgotPasswordOutput {
  // In production this would be sent via email.
  // For now, the token is returned in the response (simulated).
  resetToken: string
  message: string
}

export class ForgotPassword {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: ForgotPasswordInput): Promise<ForgotPasswordOutput> {
    const account = await this.authRepository.findAccountByEmail(input.email)

    // Always return success to prevent email enumeration
    const genericMessage = 'If that email exists, a reset link has been sent.'

    if (!account || !account.isActive) {
      return { resetToken: '', message: genericMessage }
    }

    const resetToken = this.tokenService.generateRefreshToken() // reuse random token generator
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await this.authRepository.createPasswordReset({
      token: resetToken,
      accountId: account.id,
      expiresAt,
    })

    // TODO: send email in production
    return { resetToken, message: genericMessage }
  }
}

import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { ITokenService } from '@shared/utils/token.service'
import { ROLE_PERMISSIONS } from '@shared/permissions/permission.types'
import { UnauthorizedError } from '@shared/errors/AppError'

interface RefreshTokenInput {
  refreshToken: string
}

interface RefreshTokenOutput {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RefreshTokenInput): Promise<RefreshTokenOutput> {
    const stored = await this.authRepository.findRefreshToken(input.refreshToken)

    if (!stored) throw new UnauthorizedError('Invalid refresh token')
    if (stored.isRevoked) throw new UnauthorizedError('Refresh token has been revoked')
    if (stored.expiresAt < new Date()) throw new UnauthorizedError('Refresh token expired')

    const accountWithPerms = await this.authRepository.findAccountWithPermissions(stored.accountId)
    if (!accountWithPerms) throw new UnauthorizedError('Account not found')
    if (!accountWithPerms.isActive) throw new UnauthorizedError('Account is disabled')

    // Rotate: revoke old, issue new
    await this.authRepository.revokeRefreshToken(input.refreshToken)

    const rolePerms = ROLE_PERMISSIONS[accountWithPerms.role] ?? []
    const customPerms = accountWithPerms.permissions ?? []
    const permissions = [...new Set([...rolePerms, ...customPerms])]

    const accessToken = this.tokenService.generateAccessToken({
      sub: accountWithPerms.id,
      email: accountWithPerms.email,
      username: accountWithPerms.username,
      role: accountWithPerms.role,
      permissions,
    })

    const newRawRefreshToken = this.tokenService.generateRefreshToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.authRepository.createRefreshToken({
      token: newRawRefreshToken,
      accountId: accountWithPerms.id,
      expiresAt,
    })

    return { accessToken, refreshToken: newRawRefreshToken }
  }
}

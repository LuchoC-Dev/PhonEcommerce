import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { IHashService } from '@shared/utils/hash.service'
import { ITokenService } from '@shared/utils/token.service'
import { ROLE_PERMISSIONS } from '@shared/permissions/permission.types'
import { UnauthorizedError } from '@shared/errors/AppError'
import { Role } from '@prisma/client'

interface LoginUserInput {
  emailOrUsername: string
  password: string
}

interface LoginUserOutput {
  accessToken: string
  refreshToken: string
  account: {
    id: string
    email: string
    username: string
    role: Role
  }
}

export class LoginUser {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const isEmail = input.emailOrUsername.includes('@')

    const account = isEmail
      ? await this.authRepository.findAccountByEmail(input.emailOrUsername)
      : await this.authRepository.findAccountByUsername(input.emailOrUsername)

    if (!account) throw new UnauthorizedError('Invalid credentials')
    if (!account.isActive) throw new UnauthorizedError('Account is disabled')

    const passwordMatch = await this.hashService.compare(input.password, account.password)
    if (!passwordMatch) throw new UnauthorizedError('Invalid credentials')

    // Merge role permissions with custom account permissions
    const accountWithPerms = await this.authRepository.findAccountWithPermissions(account.id)
    const rolePerms = ROLE_PERMISSIONS[account.role] ?? []
    const customPerms = accountWithPerms?.permissions ?? []
    const permissions = [...new Set([...rolePerms, ...customPerms])]

    const accessToken = this.tokenService.generateAccessToken({
      sub: account.id,
      email: account.email,
      username: account.username,
      role: account.role,
      permissions,
    })

    const rawRefreshToken = this.tokenService.generateRefreshToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await this.authRepository.createRefreshToken({
      token: rawRefreshToken,
      accountId: account.id,
      expiresAt,
    })

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      account: {
        id: account.id,
        email: account.email,
        username: account.username,
        role: account.role,
      },
    }
  }
}

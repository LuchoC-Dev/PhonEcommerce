import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { IHashService } from '@shared/utils/hash.service'
import { ITokenService } from '@shared/utils/token.service'
import { ROLE_PERMISSIONS } from '@shared/permissions/permission.types'
import { ConflictError } from '@shared/errors/AppError'
import { IUserRepository } from '../../../users/domain/repositories/user.repository'
import { Role } from '@prisma/client'

interface RegisterUserInput {
  email: string
  username: string
  password: string
  name: string
}

interface RegisterUserOutput {
  accessToken: string
  refreshToken: string
  account: {
    id: string
    email: string
    username: string
    role: Role
  }
}

export class RegisterUser {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.authRepository.findAccountByEmail(input.email),
      this.authRepository.findAccountByUsername(input.username),
    ])

    if (existingEmail) throw new ConflictError('Email already in use')
    if (existingUsername) throw new ConflictError('Username already taken')

    const hashedPassword = await this.hashService.hash(input.password)

    const account = await this.authRepository.createAccount({
      email: input.email,
      username: input.username,
      password: hashedPassword,
    })

    // Create profile linked to the new account
    await this.userRepository.createProfile({
      name: input.name,
      accountId: account.id,
    })

    const permissions = ROLE_PERMISSIONS[account.role] ?? []

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

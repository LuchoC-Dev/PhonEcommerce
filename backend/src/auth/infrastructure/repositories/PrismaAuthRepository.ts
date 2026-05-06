import { PrismaClient } from '@prisma/client'
import {
  IAuthRepository,
  CreateAccountData,
  CreateRefreshTokenData,
  CreatePasswordResetData,
} from '../../domain/repositories/auth.repository'
import { Account, AccountWithPermissions, RefreshToken, PasswordReset } from '../../domain/entities/auth.entity'

export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAccountById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { id } })
  }

  async findAccountByEmail(email: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { email } })
  }

  async findAccountByUsername(username: string): Promise<Account | null> {
    return this.prisma.account.findUnique({ where: { username } })
  }

  async findAccountWithPermissions(id: string): Promise<AccountWithPermissions | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    })

    if (!account) return null

    return {
      ...account,
      permissions: account.permissions.map((ap) => ap.permission.name),
    }
  }

  async createAccount(data: CreateAccountData): Promise<Account> {
    return this.prisma.account.create({ data })
  }

  async createRefreshToken(data: CreateRefreshTokenData): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data })
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { token } })
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true, revokedAt: new Date() },
    })
  }

  async revokeAllRefreshTokens(accountId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { accountId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    })
  }

  async createPasswordReset(data: CreatePasswordResetData): Promise<PasswordReset> {
    return this.prisma.passwordReset.create({ data })
  }

  async findPasswordReset(token: string): Promise<PasswordReset | null> {
    return this.prisma.passwordReset.findUnique({ where: { token } })
  }

  async markPasswordResetUsed(token: string): Promise<void> {
    await this.prisma.passwordReset.update({
      where: { token },
      data: { usedAt: new Date() },
    })
  }

  async updateAccountPassword(accountId: string, hashedPassword: string): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    })
  }
}

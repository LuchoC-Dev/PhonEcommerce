import { Account, AccountWithPermissions, RefreshToken, PasswordReset } from '../entities/auth.entity'

export interface IAuthRepository {
  // Account
  findAccountById(id: string): Promise<Account | null>
  findAccountByEmail(email: string): Promise<Account | null>
  findAccountByUsername(username: string): Promise<Account | null>
  findAccountWithPermissions(id: string): Promise<AccountWithPermissions | null>
  createAccount(data: CreateAccountData): Promise<Account>

  // Refresh tokens
  createRefreshToken(data: CreateRefreshTokenData): Promise<RefreshToken>
  findRefreshToken(token: string): Promise<RefreshToken | null>
  revokeRefreshToken(token: string): Promise<void>
  revokeAllRefreshTokens(accountId: string): Promise<void>

  // Password reset
  createPasswordReset(data: CreatePasswordResetData): Promise<PasswordReset>
  findPasswordReset(token: string): Promise<PasswordReset | null>
  markPasswordResetUsed(token: string): Promise<void>
  updateAccountPassword(accountId: string, hashedPassword: string): Promise<void>
}

export interface CreateAccountData {
  email: string
  username: string
  password: string
}

export interface CreateRefreshTokenData {
  token: string
  accountId: string
  expiresAt: Date
}

export interface CreatePasswordResetData {
  token: string
  accountId: string
  expiresAt: Date
}

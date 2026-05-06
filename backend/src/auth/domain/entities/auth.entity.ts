import { Role } from '@prisma/client'

export interface Account {
  id: string
  email: string
  username: string
  password: string
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RefreshToken {
  id: string
  token: string
  accountId: string
  expiresAt: Date
  isRevoked: boolean
  revokedAt: Date | null
  createdAt: Date
}

export interface PasswordReset {
  id: string
  token: string
  accountId: string
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}

export interface AccountWithPermissions extends Account {
  permissions: string[]
}

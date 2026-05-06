import { IAuthRepository } from '../../domain/repositories/auth.repository'
import { ROLE_PERMISSIONS } from '@shared/permissions/permission.types'
import { NotFoundError, UnauthorizedError } from '@shared/errors/AppError'
import { Role } from '@prisma/client'

interface GetMeOutput {
  id: string
  email: string
  username: string
  role: Role
  permissions: string[]
  isActive: boolean
  createdAt: Date
}

export class GetMe {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(accountId: string): Promise<GetMeOutput> {
    const accountWithPerms = await this.authRepository.findAccountWithPermissions(accountId)
    if (!accountWithPerms) throw new NotFoundError('Account')
    if (!accountWithPerms.isActive) throw new UnauthorizedError('Account is disabled')

    const rolePerms = ROLE_PERMISSIONS[accountWithPerms.role] ?? []
    const customPerms = accountWithPerms.permissions ?? []
    const permissions = [...new Set([...rolePerms, ...customPerms])]

    return {
      id: accountWithPerms.id,
      email: accountWithPerms.email,
      username: accountWithPerms.username,
      role: accountWithPerms.role,
      permissions,
      isActive: accountWithPerms.isActive,
      createdAt: accountWithPerms.createdAt,
    }
  }
}

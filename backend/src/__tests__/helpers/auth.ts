import { JwtTokenService } from '@shared/utils/token.service'

const tokenService = new JwtTokenService()

export function makeAdminToken(accountId = 'test-admin-id'): string {
  return tokenService.generateAccessToken({
    sub: accountId,
    email: 'admin@test.com',
    username: 'admin',
    role: 'ADMIN',
    permissions: [
      'products:create:any',
      'products:update:any',
      'products:delete:any',
      'brands:create:any',
      'brands:update:any',
      'brands:delete:any',
      'categories:create:any',
      'categories:update:any',
      'categories:delete:any',
      'stock:read:any',
      'stock:manage:any',
      'orders:create:any',
      'orders:view:any',
      'orders:cancel:any',
      'orders:manage:any',
    ],
  })
}

export function makeUserToken(accountId = 'test-user-id'): string {
  return tokenService.generateAccessToken({
    sub: accountId,
    email: 'user@test.com',
    username: 'user',
    role: 'USER',
    permissions: [
      'orders:create:own',
      'orders:view:own',
      'orders:cancel:own',
      'cart:manage:own',
    ],
  })
}

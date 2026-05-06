// Permission format: "resource:action:scope"
// scope: "any" = over any record | "own" = only own records

export type PermissionScope = 'any' | 'own'

export type PermissionString = `${string}:${string}:${PermissionScope}`

// Default permissions per role (seeded/hardcoded)
// Custom per-account permissions are stored in AccountPermission table
export const ROLE_PERMISSIONS: Record<string, PermissionString[]> = {
  USER: [
    'orders:create:own',
    'orders:view:own',
    'orders:cancel:own',
    'cart:manage:own',
    'profile:update:own',
    'profile:view:own',
    'reviews:create:own',
    'reviews:update:own',
    'reviews:delete:own',
    'addresses:manage:own',
  ],
  ADMIN: [
    'orders:create:any',
    'orders:view:any',
    'orders:cancel:any',
    'orders:manage:any',
    'cart:manage:any',
    'profile:update:any',
    'profile:view:any',
    'reviews:create:any',
    'reviews:update:any',
    'reviews:delete:any',
    'addresses:manage:any',
    'products:create:any',
    'products:update:any',
    'products:delete:any',
    'users:view:any',
    'users:ban:any',
    'users:manage:any',
    'admin:access:any',
  ],
}

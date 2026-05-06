import { PrismaClient } from '@prisma/client'

export const testPrisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  log: [],
})

export async function cleanDatabase(): Promise<void> {
  await testPrisma.$executeRaw`
    TRUNCATE TABLE
      "ProductImage", "Product", "Brand", "Category",
      "AccountPermission", "Permission",
      "RefreshToken", "PasswordReset",
      "Address", "Profile", "Account"
    CASCADE
  `
}

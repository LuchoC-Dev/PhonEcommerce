import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from '@auth/presentation/routes/auth.routes'
import { userRoutes } from '@users/presentation/routes/user.routes'
import { productRoutes } from '@products/presentation/routes/product.routes'
import { brandRoutes } from '@products/presentation/routes/brand.routes'
import { categoryRoutes } from '@products/presentation/routes/category.routes'
import { cartRoutes } from '@cart/presentation/routes/cart.routes'
import { stockRoutes } from '@stock/presentation/routes/stock.routes'
import { orderRoutes } from '@orders/presentation/routes/order.routes'

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false })

  await app.register(cors, { origin: '*' })
  app.register(authRoutes, { prefix: '/api/v1/auth' })
  app.register(userRoutes, { prefix: '/api/v1/users' })
  app.register(productRoutes, { prefix: '/api/v1/products' })
  app.register(brandRoutes, { prefix: '/api/v1/brands' })
  app.register(categoryRoutes, { prefix: '/api/v1/categories' })
  app.register(cartRoutes, { prefix: '/api/v1/cart' })
  app.register(stockRoutes, { prefix: '/api/v1/stock' })
  app.register(orderRoutes, { prefix: '/api/v1/orders' })

  await app.ready()
  return app
}

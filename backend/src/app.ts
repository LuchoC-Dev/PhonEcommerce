import Fastify from 'fastify'
import cors from '@fastify/cors'
import { authRoutes } from '@auth/presentation/routes/auth.routes'
import { userRoutes } from '@users/presentation/routes/user.routes'
import { productRoutes } from '@products/presentation/routes/product.routes'
import { brandRoutes } from '@products/presentation/routes/brand.routes'
import { categoryRoutes } from '@products/presentation/routes/category.routes'

const app = Fastify({ logger: true })

// Plugins
app.register(cors, {
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  credentials: true,
})

// Health check
app.get('/health', async () => ({ status: 'ok' }))

// Routes
app.register(authRoutes, { prefix: '/api/v1/auth' })
app.register(userRoutes, { prefix: '/api/v1/users' })
app.register(productRoutes, { prefix: '/api/v1/products' })
app.register(brandRoutes, { prefix: '/api/v1/brands' })
app.register(categoryRoutes, { prefix: '/api/v1/categories' })

const start = async (): Promise<void> => {
  try {
    const port = Number(process.env.PORT) || 3001
    await app.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

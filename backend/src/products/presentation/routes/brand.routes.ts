import { FastifyInstance } from 'fastify'
import { BrandController } from '../controllers/brand.controller'
import { authenticate, requirePermission } from '@shared/middlewares/auth.middleware'
import { GetBrands } from '../../application/use-cases/GetBrands'
import { CreateBrand } from '../../application/use-cases/CreateBrand'
import { UpdateBrand } from '../../application/use-cases/UpdateBrand'
import { DeleteBrand } from '../../application/use-cases/DeleteBrand'
import { PrismaBrandRepository } from '../../infrastructure/repositories/PrismaBrandRepository'
import { prisma } from '@shared/database/prisma'

export async function brandRoutes(app: FastifyInstance): Promise<void> {
  const repository = new PrismaBrandRepository(prisma)
  const controller = new BrandController(
    new GetBrands(repository),
    new CreateBrand(repository),
    new UpdateBrand(repository),
    new DeleteBrand(repository),
  )

  // Public
  app.get('/', controller.listHandler.bind(controller))

  // Admin
  app.post('/', {
    preHandler: [authenticate, requirePermission('brands:create:any')],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          logo: { type: 'string' },
        },
      },
    },
    handler: controller.createHandler.bind(controller),
  })

  app.put('/:id', {
    preHandler: [authenticate, requirePermission('brands:update:any')],
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          logo: { type: 'string' },
        },
      },
    },
    handler: controller.updateHandler.bind(controller),
  })

  app.delete('/:id', {
    preHandler: [authenticate, requirePermission('brands:delete:any')],
    handler: controller.deleteHandler.bind(controller),
  })
}

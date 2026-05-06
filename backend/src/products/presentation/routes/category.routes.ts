import { FastifyInstance } from 'fastify'
import { CategoryController } from '../controllers/category.controller'
import { authenticate, requirePermission } from '@shared/middlewares/auth.middleware'
import { GetCategories } from '../../application/use-cases/GetCategories'
import { CreateCategory } from '../../application/use-cases/CreateCategory'
import { UpdateCategory } from '../../application/use-cases/UpdateCategory'
import { DeleteCategory } from '../../application/use-cases/DeleteCategory'
import { PrismaCategoryRepository } from '../../infrastructure/repositories/PrismaCategoryRepository'
import { prisma } from '@shared/database/prisma'

export async function categoryRoutes(app: FastifyInstance): Promise<void> {
  const repository = new PrismaCategoryRepository(prisma)
  const controller = new CategoryController(
    new GetCategories(repository),
    new CreateCategory(repository),
    new UpdateCategory(repository),
    new DeleteCategory(repository),
  )

  // Public
  app.get('/', controller.listHandler.bind(controller))

  // Admin
  app.post('/', {
    preHandler: [authenticate, requirePermission('categories:create:any')],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'slug'],
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          parentId: { type: 'string' },
        },
      },
    },
    handler: controller.createHandler.bind(controller),
  })

  app.put('/:id', {
    preHandler: [authenticate, requirePermission('categories:update:any')],
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          parentId: { type: ['string', 'null'] },
        },
      },
    },
    handler: controller.updateHandler.bind(controller),
  })

  app.delete('/:id', {
    preHandler: [authenticate, requirePermission('categories:delete:any')],
    handler: controller.deleteHandler.bind(controller),
  })
}

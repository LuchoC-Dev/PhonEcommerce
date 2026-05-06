import { FastifyInstance } from 'fastify'
import { ProductController } from '../controllers/product.controller'
import { authenticate, requirePermission } from '@shared/middlewares/auth.middleware'
import { GetProducts } from '../../application/use-cases/GetProducts'
import { GetProductBySlug } from '../../application/use-cases/GetProductBySlug'
import { CreateProduct } from '../../application/use-cases/CreateProduct'
import { UpdateProduct } from '../../application/use-cases/UpdateProduct'
import { DeleteProduct } from '../../application/use-cases/DeleteProduct'
import { PrismaProductRepository } from '../../infrastructure/repositories/PrismaProductRepository'
import { prisma } from '@shared/database/prisma'

export async function productRoutes(app: FastifyInstance): Promise<void> {
  const repository = new PrismaProductRepository(prisma)
  const controller = new ProductController(
    new GetProducts(repository),
    new GetProductBySlug(repository),
    new CreateProduct(repository),
    new UpdateProduct(repository),
    new DeleteProduct(repository),
  )

  // Public routes
  app.get('/', controller.listHandler.bind(controller))
  app.get('/:slug', controller.getBySlugHandler.bind(controller))

  // Admin routes
  app.post('/', {
    preHandler: [authenticate, requirePermission('products:create:any')],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'slug', 'price', 'brandId', 'categoryId'],
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          stock: { type: 'integer', minimum: 0 },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          brandId: { type: 'string' },
          categoryId: { type: 'string' },
          images: {
            type: 'array',
            items: {
              type: 'object',
              required: ['url'],
              properties: {
                url: { type: 'string' },
                altText: { type: 'string' },
                position: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    handler: controller.createHandler.bind(controller),
  })

  app.put('/:id', {
    preHandler: [authenticate, requirePermission('products:update:any')],
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          slug: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          stock: { type: 'integer', minimum: 0 },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          brandId: { type: 'string' },
          categoryId: { type: 'string' },
          images: {
            type: 'array',
            items: {
              type: 'object',
              required: ['url'],
              properties: {
                url: { type: 'string' },
                altText: { type: 'string' },
                position: { type: 'integer' },
              },
            },
          },
        },
      },
    },
    handler: controller.updateHandler.bind(controller),
  })

  app.delete('/:id', {
    preHandler: [authenticate, requirePermission('products:delete:any')],
    handler: controller.deleteHandler.bind(controller),
  })
}

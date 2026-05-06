import type { FastifyInstance } from 'fastify'
import { authenticate, requirePermission } from '@shared/middlewares/auth.middleware'
import { StockController } from '../controllers/stock.controller'
import { GetStock } from '../../application/use-cases/GetStock'
import { AdjustStock } from '../../application/use-cases/AdjustStock'
import { GetMovements } from '../../application/use-cases/GetMovements'
import { PrismaStockRepository } from '../../infrastructure/repositories/PrismaStockRepository'
import { prisma } from '@shared/database/prisma'

const stockLevelSchema = {
  type: 'object',
  properties: {
    productId: { type: 'string' },
    quantity: { type: 'integer' },
  },
}

const movementSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    productId: { type: 'string' },
    type: { type: 'string', enum: ['RESTOCK', 'SALE', 'ADJUSTMENT', 'RETURN'] },
    quantity: { type: 'integer' },
    stockBefore: { type: 'integer' },
    stockAfter: { type: 'integer' },
    reason: { type: 'string', nullable: true },
    createdBy: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const productIdParam = {
  type: 'object',
  required: ['productId'],
  properties: { productId: { type: 'string', description: 'Product CUID' } },
}

export async function stockRoutes(app: FastifyInstance): Promise<void> {
  const repo = new PrismaStockRepository(prisma)
  const controller = new StockController(
    new GetStock(repo),
    new AdjustStock(repo),
    new GetMovements(repo),
  )

  /**
   * GET /:productId
   * Returns the current stock level for a product.
   */
  app.get('/:productId', {
    preHandler: [authenticate, requirePermission('stock:read:any')],
    schema: {
      tags: ['Stock'],
      summary: 'Get current stock level',
      params: productIdParam,
      response: {
        200: stockLevelSchema,
        404: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
      },
    },
    handler: controller.getStockHandler.bind(controller),
  })

  /**
   * POST /:productId/adjust
   * Admin: manually adjusts stock (RESTOCK or ADJUSTMENT).
   */
  app.post('/:productId/adjust', {
    preHandler: [authenticate, requirePermission('stock:manage:any')],
    schema: {
      tags: ['Stock'],
      summary: 'Adjust stock (admin)',
      description: 'Add or remove stock manually. Positive delta = add, negative = remove.',
      params: productIdParam,
      body: {
        type: 'object',
        required: ['delta', 'type'],
        properties: {
          delta: { type: 'integer', description: 'Positive = add stock, negative = remove' },
          type: {
            type: 'string',
            enum: ['RESTOCK', 'ADJUSTMENT'],
            description: 'Use RESTOCK for incoming inventory, ADJUSTMENT for corrections',
          },
          reason: { type: 'string', description: 'Optional reason for the adjustment' },
        },
      },
      response: {
        200: movementSchema,
        400: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
        409: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
      },
    },
    handler: controller.adjustStockHandler.bind(controller),
  })

  /**
   * GET /:productId/movements
   * Returns paginated movement history for a product.
   */
  app.get('/:productId/movements', {
    preHandler: [authenticate, requirePermission('stock:read:any')],
    schema: {
      tags: ['Stock'],
      summary: 'Get stock movement history',
      params: productIdParam,
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: movementSchema },
            total: { type: 'integer' },
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
          },
        },
        404: { type: 'object', properties: { error: { type: 'string' }, message: { type: 'string' } } },
      },
    },
    handler: controller.getMovementsHandler.bind(controller),
  })
}

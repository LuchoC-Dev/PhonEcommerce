import { FastifyInstance } from 'fastify'
import { authenticate } from '@shared/middlewares/auth.middleware'
import { CartController } from '../controllers/cart.controller'
import { GetCart } from '../../application/use-cases/GetCart'
import { AddItem } from '../../application/use-cases/AddItem'
import { UpdateItemQuantity } from '../../application/use-cases/UpdateItemQuantity'
import { RemoveItem } from '../../application/use-cases/RemoveItem'
import { ClearCart } from '../../application/use-cases/ClearCart'
import { PrismaCartRepository } from '../../infrastructure/repositories/PrismaCartRepository'
import { PrismaProductRepository } from '@products/infrastructure/repositories/PrismaProductRepository'
import { prisma } from '@shared/database/prisma'

const cartItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    cartId: { type: 'string' },
    productId: { type: 'string' },
    quantity: { type: 'integer' },
    priceAtAdd: { type: 'number' },
    currentPrice: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    product: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        slug: { type: 'string' },
        images: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              url: { type: 'string' },
              altText: { type: ['string', 'null'] },
            },
          },
        },
      },
    },
  },
}

const cartResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    expiresAt: { type: 'string', format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    items: { type: 'array', items: cartItemSchema },
  },
}

export async function cartRoutes(app: FastifyInstance): Promise<void> {
  const cartRepo = new PrismaCartRepository(prisma)
  const productRepo = new PrismaProductRepository(prisma)

  const controller = new CartController(
    new GetCart(cartRepo),
    new AddItem(cartRepo, productRepo),
    new UpdateItemQuantity(cartRepo),
    new RemoveItem(cartRepo),
    new ClearCart(cartRepo),
  )

  app.get('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Cart'],
      summary: 'Get the current user cart',
      description:
        'Returns the active cart with all items, including current product prices. ' +
        'Creates an empty cart if none exists. Resets expired carts.',
      security: [{ bearerAuth: [] }],
      response: {
        200: cartResponseSchema,
      },
    },
    handler: controller.getHandler.bind(controller),
  })

  app.post('/items', {
    preHandler: [authenticate],
    schema: {
      tags: ['Cart'],
      summary: 'Add a product to the cart',
      description:
        'Adds the product to the cart. If the product is already in the cart, its quantity is incremented.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string', description: 'ID of the product to add' },
          quantity: { type: 'integer', minimum: 1, description: 'Number of units to add' },
        },
      },
      response: {
        201: cartResponseSchema,
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, message: { type: 'string' } },
        },
      },
    },
    handler: controller.addItemHandler.bind(controller),
  })

  app.put('/items/:productId', {
    preHandler: [authenticate],
    schema: {
      tags: ['Cart'],
      summary: 'Update item quantity',
      description: 'Overwrites the quantity of an existing cart item.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['productId'],
        properties: { productId: { type: 'string' } },
      },
      body: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'integer', minimum: 1 },
        },
      },
      response: {
        200: cartResponseSchema,
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, message: { type: 'string' } },
        },
      },
    },
    handler: controller.updateItemHandler.bind(controller),
  })

  app.delete('/items/:productId', {
    preHandler: [authenticate],
    schema: {
      tags: ['Cart'],
      summary: 'Remove an item from the cart',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['productId'],
        properties: { productId: { type: 'string' } },
      },
      response: {
        200: cartResponseSchema,
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, message: { type: 'string' } },
        },
      },
    },
    handler: controller.removeItemHandler.bind(controller),
  })

  app.delete('/', {
    preHandler: [authenticate],
    schema: {
      tags: ['Cart'],
      summary: 'Clear the cart',
      description: 'Removes all items from the cart. The cart itself is preserved.',
      security: [{ bearerAuth: [] }],
      response: {
        200: cartResponseSchema,
        404: {
          type: 'object',
          properties: { error: { type: 'string' }, message: { type: 'string' } },
        },
      },
    },
    handler: controller.clearHandler.bind(controller),
  })
}

import { FastifyInstance } from 'fastify'
import { authenticate, requirePermission } from '@shared/middlewares/auth.middleware'
import { OrderController } from '../controllers/order.controller'
import { PreviewOrderFromCart } from '../../application/use-cases/PreviewOrderFromCart'
import { PreviewOrderQuickBuy } from '../../application/use-cases/PreviewOrderQuickBuy'
import { CreateOrderFromCart } from '../../application/use-cases/CreateOrderFromCart'
import { CreateOrderQuickBuy } from '../../application/use-cases/CreateOrderQuickBuy'
import { GetOrders } from '../../application/use-cases/GetOrders'
import { GetOrderById } from '../../application/use-cases/GetOrderById'
import { CancelOrder } from '../../application/use-cases/CancelOrder'
import { UpdateOrderStatus } from '../../application/use-cases/UpdateOrderStatus'
import { PrismaOrderRepository } from '../../infrastructure/repositories/PrismaOrderRepository'
import { PrismaCartRepository } from '@cart/infrastructure/repositories/PrismaCartRepository'
import { prisma } from '@shared/database/prisma'

// ─── Reusable schemas ─────────────────────────────────────────────────────────

const shippingSchema = {
  type: 'object',
  required: ['name', 'address', 'city', 'country', 'zipCode'],
  properties: {
    name: { type: 'string', description: 'Recipient full name' },
    phone: { type: 'string', description: 'Recipient phone (optional)' },
    address: { type: 'string', description: 'Street address' },
    city: { type: 'string' },
    state: { type: 'string', description: 'State / province (optional)' },
    country: { type: 'string' },
    zipCode: { type: 'string' },
  },
}

const previewItemSchema = {
  type: 'object',
  properties: {
    productId: { type: 'string' },
    productName: { type: 'string' },
    quantity: { type: 'integer' },
    unitPrice: { type: 'number' },
    subtotal: { type: 'number' },
  },
}

const previewResponseSchema = {
  type: 'object',
  properties: {
    items: { type: 'array', items: previewItemSchema },
    totalAmount: { type: 'number' },
    shipping: shippingSchema,
  },
}

const orderItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    orderId: { type: 'string' },
    productId: { type: 'string' },
    quantity: { type: 'integer' },
    unitPrice: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const statusHistorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    orderId: { type: 'string' },
    fromStatus: { type: ['string', 'null'] },
    toStatus: { type: 'string' },
    changedBy: { type: ['string', 'null'] },
    note: { type: ['string', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
  },
}

const orderSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
    totalAmount: { type: 'number' },
    shippingName: { type: 'string' },
    shippingPhone: { type: ['string', 'null'] },
    shippingAddress: { type: 'string' },
    shippingCity: { type: 'string' },
    shippingState: { type: ['string', 'null'] },
    shippingCountry: { type: 'string' },
    shippingZipCode: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
}

const orderWithDetailsSchema = {
  ...orderSchema,
  properties: {
    ...orderSchema.properties,
    items: { type: 'array', items: orderItemSchema },
    statusHistory: { type: 'array', items: statusHistorySchema },
  },
}

const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
}

// ─── Route registration ────────────────────────────────────────────────────────

export async function orderRoutes(app: FastifyInstance): Promise<void> {
  const orderRepo = new PrismaOrderRepository(prisma)
  const cartRepo = new PrismaCartRepository(prisma)

  const controller = new OrderController(
    new PreviewOrderFromCart(cartRepo),
    new PreviewOrderQuickBuy(prisma),
    new CreateOrderFromCart(orderRepo, cartRepo),
    new CreateOrderQuickBuy(orderRepo, prisma),
    new GetOrders(orderRepo),
    new GetOrderById(orderRepo),
    new CancelOrder(orderRepo),
    new UpdateOrderStatus(orderRepo),
  )

  // ── Checkout from cart ──────────────────────────────────────────────────────

  app.post('/checkout/preview', {
    preHandler: [authenticate, requirePermission('orders:create:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Preview checkout from cart',
      description:
        'Returns a price summary using current product prices before the order is confirmed. No data is written.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['shipping'],
        properties: { shipping: shippingSchema },
      },
      response: {
        200: previewResponseSchema,
        400: errorSchema,
        404: errorSchema,
      },
    },
    handler: controller.previewFromCartHandler.bind(controller),
  })

  app.post('/checkout/confirm', {
    preHandler: [authenticate, requirePermission('orders:create:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Confirm checkout from cart',
      description:
        'Creates an order from the active cart using current prices. Deducts stock atomically and clears the cart.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['shipping'],
        properties: { shipping: shippingSchema },
      },
      response: {
        201: orderWithDetailsSchema,
        400: errorSchema,
        404: errorSchema,
        409: errorSchema,
      },
    },
    handler: controller.confirmFromCartHandler.bind(controller),
  })

  // ── Quick buy ───────────────────────────────────────────────────────────────

  app.post('/quick-buy/preview', {
    preHandler: [authenticate, requirePermission('orders:create:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Preview quick buy (single product)',
      description: 'Returns a price summary for a single product. No data is written.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'quantity', 'shipping'],
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          shipping: shippingSchema,
        },
      },
      response: {
        200: previewResponseSchema,
        404: errorSchema,
      },
    },
    handler: controller.previewQuickBuyHandler.bind(controller),
  })

  app.post('/quick-buy/confirm', {
    preHandler: [authenticate, requirePermission('orders:create:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Confirm quick buy (single product)',
      description:
        'Creates an order for a single product using the current price. Deducts stock atomically.',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'quantity', 'shipping'],
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          shipping: shippingSchema,
        },
      },
      response: {
        201: orderWithDetailsSchema,
        404: errorSchema,
        409: errorSchema,
      },
    },
    handler: controller.confirmQuickBuyHandler.bind(controller),
  })

  // ── Order listing & detail ──────────────────────────────────────────────────

  app.get('/', {
    preHandler: [authenticate, requirePermission('orders:view:own')],
    schema: {
      tags: ['Orders'],
      summary: 'List orders',
      description:
        'Returns the authenticated user\'s orders. Admins receive all orders across all accounts.',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: orderSchema },
            total: { type: 'integer' },
            page: { type: 'integer' },
            pageSize: { type: 'integer' },
          },
        },
      },
    },
    handler: controller.listOrdersHandler.bind(controller),
  })

  app.get('/:id', {
    preHandler: [authenticate, requirePermission('orders:view:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Get order detail',
      description: 'Returns full order detail including items and status history.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
      response: {
        200: orderWithDetailsSchema,
        403: errorSchema,
        404: errorSchema,
      },
    },
    handler: controller.getOrderHandler.bind(controller),
  })

  // ── Status management ───────────────────────────────────────────────────────

  app.patch('/:id/cancel', {
    preHandler: [authenticate, requirePermission('orders:cancel:own')],
    schema: {
      tags: ['Orders'],
      summary: 'Cancel an order',
      description:
        'Users can cancel orders in PENDING or CONFIRMED status. Admins can cancel any non-terminal order.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
      response: {
        200: orderSchema,
        403: errorSchema,
        404: errorSchema,
        409: errorSchema,
      },
    },
    handler: controller.cancelOrderHandler.bind(controller),
  })

  app.patch('/:id/status', {
    preHandler: [authenticate, requirePermission('orders:manage:any')],
    schema: {
      tags: ['Orders'],
      summary: 'Update order status (admin)',
      description:
        'Admin-only. Transitions an order to a new status following the allowed state machine.',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } },
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            description: 'New status for the order',
          },
          note: { type: 'string', description: 'Optional admin note for the status change' },
        },
      },
      response: {
        200: orderSchema,
        404: errorSchema,
        409: errorSchema,
      },
    },
    handler: controller.updateStatusHandler.bind(controller),
  })
}

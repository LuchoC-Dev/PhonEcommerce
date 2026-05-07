import { PrismaClient, Prisma } from '@prisma/client'
import type { IOrderRepository, CreateOrderInput, FindOrdersOptions } from '../../domain/repositories/order.repository'
import type {
  Order,
  OrderItem,
  OrderPage,
  OrderStatus,
  OrderStatusHistory,
  OrderWithDetails,
} from '../../domain/entities/order.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

type RawOrder = {
  id: string
  accountId: string
  status: string
  totalAmount: Prisma.Decimal
  shippingName: string
  shippingPhone: string | null
  shippingAddress: string
  shippingCity: string
  shippingState: string | null
  shippingCountry: string
  shippingZipCode: string
  createdAt: Date
  updatedAt: Date
}

type RawOrderItem = {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: Prisma.Decimal
  createdAt: Date
}

type RawStatusHistory = {
  id: string
  orderId: string
  fromStatus: string | null
  toStatus: string
  changedBy: string | null
  note: string | null
  createdAt: Date
}

function toOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    accountId: raw.accountId,
    status: raw.status as OrderStatus,
    totalAmount: Number(raw.totalAmount),
    shippingName: raw.shippingName,
    shippingPhone: raw.shippingPhone,
    shippingAddress: raw.shippingAddress,
    shippingCity: raw.shippingCity,
    shippingState: raw.shippingState,
    shippingCountry: raw.shippingCountry,
    shippingZipCode: raw.shippingZipCode,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

function toOrderItem(raw: RawOrderItem): OrderItem {
  return {
    id: raw.id,
    orderId: raw.orderId,
    productId: raw.productId,
    quantity: raw.quantity,
    unitPrice: Number(raw.unitPrice),
    createdAt: raw.createdAt,
  }
}

function toStatusHistory(raw: RawStatusHistory): OrderStatusHistory {
  return {
    id: raw.id,
    orderId: raw.orderId,
    fromStatus: raw.fromStatus as OrderStatus | null,
    toStatus: raw.toStatus as OrderStatus,
    changedBy: raw.changedBy,
    note: raw.note,
    createdAt: raw.createdAt,
  }
}

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Atomically:
   * 1. Validates & deducts stock for each item (with SALE StockMovement).
   * 2. Creates the Order + OrderItems + initial OrderStatusHistory.
   * 3. Clears cart items when cartId is provided.
   */
  async createOrder(input: CreateOrderInput): Promise<OrderWithDetails> {
    const { accountId, items, shipping, cartId } = input

    // Pre-validate stock outside the transaction to return meaningful errors
    const productIds = items.map((i) => i.productId)
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, status: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product || product.status !== 'PUBLISHED') {
        throw new NotFoundError('Product')
      }
      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product ${item.productId}. Available: ${product.stock}, requested: ${item.quantity}`,
          409,
          'INSUFFICIENT_STOCK',
        )
      }
    }

    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Re-check stock inside transaction to avoid race conditions
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })
        if (!product || product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for product ${item.productId}`,
            409,
            'INSUFFICIENT_STOCK',
          )
        }

        const stockAfter = product.stock - item.quantity

        // Deduct stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: stockAfter },
        })

        // Record SALE movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: 'SALE',
            quantity: -item.quantity,
            stockBefore: product.stock,
            stockAfter,
            reason: 'Order placed',
            createdBy: accountId,
          },
        })
      }

      // 2. Create order
      const order = await tx.order.create({
        data: {
          accountId,
          totalAmount,
          shippingName: shipping.name,
          shippingPhone: shipping.phone ?? null,
          shippingAddress: shipping.address,
          shippingCity: shipping.city,
          shippingState: shipping.state ?? null,
          shippingCountry: shipping.country,
          shippingZipCode: shipping.zipCode,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: 'PENDING',
              changedBy: accountId,
              note: 'Order created',
            },
          },
        },
        include: {
          items: true,
          statusHistory: { orderBy: { createdAt: 'asc' } },
        },
      })

      // 3. Clear cart if applicable
      if (cartId) {
        await tx.cartItem.deleteMany({ where: { cartId } })
      }

      return order
    })

    return {
      ...toOrder(result),
      items: result.items.map(toOrderItem),
      statusHistory: result.statusHistory.map(toStatusHistory),
    }
  }

  async findById(id: string): Promise<OrderWithDetails | null> {
    const raw = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (!raw) return null

    return {
      ...toOrder(raw),
      items: raw.items.map(toOrderItem),
      statusHistory: raw.statusHistory.map(toStatusHistory),
    }
  }

  async findOrders(options: FindOrdersOptions): Promise<OrderPage> {
    const { page, pageSize, accountId } = options
    const skip = (page - 1) * pageSize
    const where = accountId ? { accountId } : {}

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ])

    return {
      data: rows.map(toOrder),
      total,
      page,
      pageSize,
    }
  }

  async updateStatus(
    orderId: string,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
    changedBy: string,
    note?: string,
  ): Promise<Order> {
    const [updated] = await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: toStatus },
      }),
      this.prisma.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus,
          toStatus,
          changedBy,
          note: note ?? null,
        },
      }),
    ])

    return toOrder(updated)
  }
}

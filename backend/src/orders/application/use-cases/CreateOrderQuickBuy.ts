import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { OrderWithDetails, ShippingInfo } from '../../domain/entities/order.entity'
import { NotFoundError } from '@shared/errors/AppError'
import { PrismaClient } from '@prisma/client'

export interface CreateOrderQuickBuyInput {
  accountId: string
  productId: string
  quantity: number
  shipping: ShippingInfo
}

/**
 * Confirms a quick-buy order for a single product.
 * - Uses the current product price.
 * - Deducts stock atomically.
 * - Does NOT touch the cart.
 *
 * @throws {NotFoundError} if the product does not exist or is not published.
 * @throws {AppError} if there is insufficient stock.
 */
export class CreateOrderQuickBuy {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(input: CreateOrderQuickBuyInput): Promise<OrderWithDetails> {
    const { accountId, productId, quantity, shipping } = input

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, status: true },
    })

    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundError('Product')
    }

    return this.orderRepository.createOrder({
      accountId,
      items: [{ productId, quantity, unitPrice: Number(product.price) }],
      shipping,
    })
  }
}

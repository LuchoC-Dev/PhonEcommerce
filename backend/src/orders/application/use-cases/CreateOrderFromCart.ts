import type { ICartRepository } from '@cart/domain/repositories/cart.repository'
import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { OrderWithDetails, ShippingInfo } from '../../domain/entities/order.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

export interface CreateOrderFromCartInput {
  accountId: string
  shipping: ShippingInfo
}

/**
 * Confirms a checkout from the user's active cart.
 * - Uses current product prices (not priceAtAdd).
 * - Deducts stock atomically for each item.
 * - Clears the cart after successful order creation.
 *
 * @throws {NotFoundError} if the cart does not exist.
 * @throws {AppError} if the cart is empty.
 * @throws {AppError} if any item has insufficient stock.
 */
export class CreateOrderFromCart {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly cartRepository: ICartRepository,
  ) {}

  async execute(input: CreateOrderFromCartInput): Promise<OrderWithDetails> {
    const { accountId, shipping } = input

    const cart = await this.cartRepository.findWithItems(accountId)
    if (!cart) throw new NotFoundError('Cart')
    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 400, 'CART_EMPTY')
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.currentPrice,
    }))

    return this.orderRepository.createOrder({
      accountId,
      items,
      shipping,
      cartId: cart.id,
    })
  }
}

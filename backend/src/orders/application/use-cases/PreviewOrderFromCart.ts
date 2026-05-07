import type { ICartRepository } from '@cart/domain/repositories/cart.repository'
import type { OrderPreview, ShippingInfo } from '../../domain/entities/order.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

export interface PreviewOrderFromCartInput {
  accountId: string
  shipping: ShippingInfo
}

/**
 * Builds a checkout preview from the user's active cart using current product prices.
 * Does NOT write to the database — use CreateOrderFromCart to confirm.
 *
 * @throws {NotFoundError} if the cart does not exist.
 * @throws {AppError} if the cart is empty.
 */
export class PreviewOrderFromCart {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: PreviewOrderFromCartInput): Promise<OrderPreview> {
    const { accountId, shipping } = input

    const cart = await this.cartRepository.findWithItems(accountId)
    if (!cart) throw new NotFoundError('Cart')
    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 400, 'CART_EMPTY')
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.currentPrice,
      subtotal: item.currentPrice * item.quantity,
    }))

    const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0)

    return { items, totalAmount, shipping }
  }
}

import { ICartRepository } from '../../domain/repositories/cart.repository'
import { CartWithItems } from '../../domain/entities/cart.entity'
import { NotFoundError, AppError } from '@shared/errors/AppError'

export interface UpdateItemQuantityInput {
  accountId: string
  productId: string
  quantity: number
}

/**
 * Update the quantity of an item already in the cart.
 *
 * - Throws if the cart or item does not exist.
 * - Quantity must be >= 1.
 */
export class UpdateItemQuantity {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: UpdateItemQuantityInput): Promise<CartWithItems> {
    const { accountId, productId, quantity } = input

    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400, 'INVALID_QUANTITY')
    }

    const cart = await this.cartRepository.findByAccountId(accountId)
    if (!cart) throw new NotFoundError('Cart')

    const item = await this.cartRepository.findItem(cart.id, productId)
    if (!item) throw new NotFoundError('Cart item')

    await this.cartRepository.updateItemQuantity(cart.id, productId, quantity)

    return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
  }
}

import { ICartRepository } from '../../domain/repositories/cart.repository'
import { CartWithItems } from '../../domain/entities/cart.entity'
import { NotFoundError } from '@shared/errors/AppError'

export interface RemoveItemInput {
  accountId: string
  productId: string
}

/**
 * Remove a single item from the cart.
 *
 * - Throws if the cart or item does not exist.
 */
export class RemoveItem {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(input: RemoveItemInput): Promise<CartWithItems> {
    const { accountId, productId } = input

    const cart = await this.cartRepository.findByAccountId(accountId)
    if (!cart) throw new NotFoundError('Cart')

    const item = await this.cartRepository.findItem(cart.id, productId)
    if (!item) throw new NotFoundError('Cart item')

    await this.cartRepository.removeItem(cart.id, productId)

    return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
  }
}

import { ICartRepository } from '../../domain/repositories/cart.repository'
import { CartWithItems } from '../../domain/entities/cart.entity'
import { NotFoundError } from '@shared/errors/AppError'

/**
 * Remove all items from the user's cart.
 *
 * The cart itself is kept; only its items are removed.
 * Throws if the user has no cart.
 */
export class ClearCart {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(accountId: string): Promise<CartWithItems> {
    const cart = await this.cartRepository.findByAccountId(accountId)
    if (!cart) throw new NotFoundError('Cart')

    await this.cartRepository.clearItems(cart.id)

    return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
  }
}

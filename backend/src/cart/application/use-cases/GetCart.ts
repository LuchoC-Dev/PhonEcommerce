import { ICartRepository } from '../../domain/repositories/cart.repository'
import { CartWithItems } from '../../domain/entities/cart.entity'

const CART_TTL_DAYS = 7

/**
 * Retrieve the active cart for a user.
 *
 * - If no cart exists, creates a new empty one.
 * - If the cart is expired, it is reset (items cleared, expiry renewed).
 * - Each item includes the current product price alongside the price at add.
 */
export class GetCart {
  constructor(private readonly cartRepository: ICartRepository) {}

  async execute(accountId: string): Promise<CartWithItems> {
    const existing = await this.cartRepository.findByAccountId(accountId)

    if (!existing) {
      const expiresAt = this.newExpiry()
      await this.cartRepository.create(accountId, expiresAt)
      return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
    }

    if (existing.expiresAt < new Date()) {
      // Cart expired: clear items and renew expiry
      await this.cartRepository.clearItems(existing.id)
      await this.cartRepository.resetExpiry(existing.id, this.newExpiry())
    }

    return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
  }

  private newExpiry(): Date {
    const d = new Date()
    d.setDate(d.getDate() + CART_TTL_DAYS)
    return d
  }
}

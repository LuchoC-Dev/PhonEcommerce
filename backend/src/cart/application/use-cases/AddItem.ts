import { ICartRepository } from '../../domain/repositories/cart.repository'
import { CartWithItems } from '../../domain/entities/cart.entity'
import { IProductRepository } from '@products/domain/repositories/product.repository'
import { NotFoundError } from '@shared/errors/AppError'

const CART_TTL_DAYS = 7

export interface AddItemInput {
  accountId: string
  productId: string
  quantity: number
}

/**
 * Add a product to the cart (or increment its quantity if already present).
 *
 * Business rules:
 * - Creates the cart if it does not exist.
 * - If the same product is added again, the quantities are summed.
 * - TODO: Validate stock availability once the stock service is implemented.
 */
export class AddItem {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(input: AddItemInput): Promise<CartWithItems> {
    const { accountId, productId, quantity } = input

    const product = await this.productRepository.findById(productId)
    if (!product) throw new NotFoundError('Product')

    // TODO: Check stock availability via stock service (not yet implemented).
    // Once the stock service exists, call it here and throw if stock < quantity.

    const cart = await this.getOrCreateCart(accountId)

    await this.cartRepository.upsertItem(cart.id, productId, quantity, product.price)

    return this.cartRepository.findWithItems(accountId) as Promise<CartWithItems>
  }

  private async getOrCreateCart(accountId: string) {
    const existing = await this.cartRepository.findByAccountId(accountId)
    if (existing) {
      if (existing.expiresAt < new Date()) {
        await this.cartRepository.clearItems(existing.id)
        await this.cartRepository.resetExpiry(existing.id, this.newExpiry())
      }
      return existing
    }
    return this.cartRepository.create(accountId, this.newExpiry())
  }

  private newExpiry(): Date {
    const d = new Date()
    d.setDate(d.getDate() + CART_TTL_DAYS)
    return d
  }
}

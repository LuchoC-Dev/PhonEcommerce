import { Cart, CartItem, CartWithItems } from '../entities/cart.entity'

/**
 * Contract for cart persistence.
 * Infrastructure layer implements this interface.
 */
export interface ICartRepository {
  /** Find cart by account ID (without items). */
  findByAccountId(accountId: string): Promise<Cart | null>

  /** Find cart with all items enriched with live product data. */
  findWithItems(accountId: string): Promise<CartWithItems | null>

  /** Create a new empty cart for the given account. */
  create(accountId: string, expiresAt: Date): Promise<Cart>

  /** Update the cart's expiry date. */
  resetExpiry(cartId: string, expiresAt: Date): Promise<void>

  /** Remove all items from the cart (keeps the cart itself). */
  clearItems(cartId: string): Promise<void>

  /** Find a single item in the cart by productId. */
  findItem(cartId: string, productId: string): Promise<CartItem | null>

  /**
   * Create or update a cart item.
   * If the item already exists, its quantity is incremented by `quantity`.
   * @param priceAtAdd - Only used when creating the item for the first time.
   */
  upsertItem(
    cartId: string,
    productId: string,
    quantity: number,
    priceAtAdd: number,
  ): Promise<CartItem>

  /** Overwrite the quantity of an existing item. */
  updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem>

  /** Remove a single item from the cart. */
  removeItem(cartId: string, productId: string): Promise<void>
}

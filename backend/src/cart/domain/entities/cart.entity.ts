/**
 * Raw cart item as stored in the database.
 */
export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  /** Price captured at the moment the item was added to the cart. */
  priceAtAdd: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Cart item enriched with live product data fetched on each query.
 */
export interface CartItemWithProduct extends CartItem {
  /** Current product price (may differ from priceAtAdd). */
  currentPrice: number
  product: {
    id: string
    name: string
    slug: string
    images: { url: string; altText: string | null }[]
  }
}

/** Cart aggregate root. */
export interface Cart {
  id: string
  accountId: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

/** Cart with all items enriched with live product data. */
export interface CartWithItems extends Cart {
  items: CartItemWithProduct[]
}

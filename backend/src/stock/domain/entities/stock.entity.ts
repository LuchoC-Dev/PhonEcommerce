/** Movement types that can affect a product's stock level. */
export type StockMovementType = 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RETURN'

/**
 * Represents the current stock state of a product.
 * Uses the `stock` field on the Product model as the source of truth.
 */
export interface StockLevel {
  productId: string
  /** Current available units. */
  quantity: number
}

/**
 * A single recorded stock movement (audit trail entry).
 */
export interface StockMovement {
  id: string
  productId: string
  type: StockMovementType
  /** Positive = in, negative = out. */
  quantity: number
  stockBefore: number
  stockAfter: number
  reason: string | null
  /** accountId of who triggered the movement. Null for system-generated. */
  createdBy: string | null
  createdAt: Date
}

/** Paginated result of stock movements. */
export interface StockMovementPage {
  data: StockMovement[]
  total: number
  page: number
  pageSize: number
}

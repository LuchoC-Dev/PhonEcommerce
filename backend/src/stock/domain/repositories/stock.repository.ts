import type { StockLevel, StockMovement, StockMovementPage, StockMovementType } from '../entities/stock.entity'

export interface CreateMovementInput {
  productId: string
  type: StockMovementType
  /** Positive = in, negative = out. */
  quantity: number
  stockBefore: number
  stockAfter: number
  reason?: string
  createdBy?: string
}

export interface FindMovementsOptions {
  page: number
  pageSize: number
}

/**
 * Persistence contract for the stock domain.
 * Use-cases depend only on this interface, never on Prisma directly.
 */
export interface IStockRepository {
  /** Returns the current stock level for a product, or null if the product doesn't exist. */
  findByProductId(productId: string): Promise<StockLevel | null>

  /**
   * Atomically updates the product's stock and records a movement.
   * Returns the created movement.
   */
  applyMovement(input: CreateMovementInput): Promise<StockMovement>

  /** Retrieves paginated movement history for a product, newest first. */
  findMovements(productId: string, options: FindMovementsOptions): Promise<StockMovementPage>
}

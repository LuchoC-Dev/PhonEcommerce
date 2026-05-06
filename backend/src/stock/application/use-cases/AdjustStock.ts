import type { IStockRepository } from '../../domain/repositories/stock.repository'
import type { StockMovement } from '../../domain/entities/stock.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

export interface AdjustStockInput {
  productId: string
  /** Positive = add stock, negative = remove stock. */
  delta: number
  /** 'RESTOCK' for adding inventory, 'ADJUSTMENT' for corrections. */
  type: 'RESTOCK' | 'ADJUSTMENT'
  reason?: string
  /** accountId of the admin performing the action. */
  createdBy: string
}

/**
 * Admin use-case: manually adjusts a product's stock up or down.
 * Records a RESTOCK or ADJUSTMENT movement.
 * @throws {NotFoundError} if the product does not exist.
 * @throws {AppError} if the resulting stock would go below 0.
 */
export class AdjustStock {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(input: AdjustStockInput): Promise<StockMovement> {
    const { productId, delta, type, reason, createdBy } = input

    if (delta === 0) {
      throw new AppError('Delta must be non-zero', 400, 'INVALID_DELTA')
    }

    const stock = await this.stockRepository.findByProductId(productId)
    if (!stock) throw new NotFoundError('Product')

    const newQuantity = stock.quantity + delta
    if (newQuantity < 0) {
      throw new AppError(
        `Insufficient stock. Available: ${stock.quantity}, requested deduction: ${Math.abs(delta)}`,
        409,
        'INSUFFICIENT_STOCK',
      )
    }

    return this.stockRepository.applyMovement({
      productId,
      type,
      quantity: delta,
      stockBefore: stock.quantity,
      stockAfter: newQuantity,
      reason,
      createdBy,
    })
  }
}

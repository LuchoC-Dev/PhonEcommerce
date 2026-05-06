import type { IStockRepository } from '../../domain/repositories/stock.repository'
import type { StockMovement } from '../../domain/entities/stock.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

export interface DeductStockInput {
  productId: string
  quantity: number
  /** Optional reason, e.g. order ID. */
  reason?: string
  /** accountId of the customer/system triggering the deduction. */
  createdBy?: string
}

/**
 * Internal use-case: deducts stock when an order is confirmed.
 * Intended to be called by the orders domain, not exposed as a direct HTTP endpoint.
 * Records a SALE movement.
 * @throws {NotFoundError} if the product does not exist.
 * @throws {AppError} if there is not enough stock available.
 */
export class DeductStock {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(input: DeductStockInput): Promise<StockMovement> {
    const { productId, quantity, reason, createdBy } = input

    if (quantity <= 0) {
      throw new AppError('Quantity must be greater than 0', 400, 'INVALID_QUANTITY')
    }

    const stock = await this.stockRepository.findByProductId(productId)
    if (!stock) throw new NotFoundError('Product')

    if (stock.quantity < quantity) {
      throw new AppError(
        `Insufficient stock. Available: ${stock.quantity}, requested: ${quantity}`,
        409,
        'INSUFFICIENT_STOCK',
      )
    }

    return this.stockRepository.applyMovement({
      productId,
      type: 'SALE',
      quantity: -quantity,
      stockBefore: stock.quantity,
      stockAfter: stock.quantity - quantity,
      reason,
      createdBy,
    })
  }
}

import type { IStockRepository } from '../../domain/repositories/stock.repository'
import type { StockLevel } from '../../domain/entities/stock.entity'
import { NotFoundError } from '@shared/errors/AppError'

/**
 * Returns the current stock level for a given product.
 * @throws {NotFoundError} if the product does not exist.
 */
export class GetStock {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(productId: string): Promise<StockLevel> {
    const stock = await this.stockRepository.findByProductId(productId)
    if (!stock) throw new NotFoundError('Product')
    return stock
  }
}

import type { IStockRepository } from '../../domain/repositories/stock.repository'
import type { StockMovementPage } from '../../domain/entities/stock.entity'
import { NotFoundError } from '@shared/errors/AppError'

export interface GetMovementsInput {
  productId: string
  page: number
  pageSize: number
}

/**
 * Returns paginated movement history for a product's stock.
 * @throws {NotFoundError} if the product does not exist.
 */
export class GetMovements {
  constructor(private readonly stockRepository: IStockRepository) {}

  async execute(input: GetMovementsInput): Promise<StockMovementPage> {
    const { productId, page, pageSize } = input

    const stock = await this.stockRepository.findByProductId(productId)
    if (!stock) throw new NotFoundError('Product')

    return this.stockRepository.findMovements(productId, { page, pageSize })
  }
}

import { IProductRepository, GetProductsFilters } from '../../domain/repositories/product.repository'
import { PaginatedProducts } from '../../domain/entities/product.entity'

export class GetProducts {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters: GetProductsFilters): Promise<PaginatedProducts> {
    return this.productRepository.findAll(filters)
  }
}

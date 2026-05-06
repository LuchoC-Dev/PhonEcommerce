import { IProductRepository } from '../../domain/repositories/product.repository'
import { ProductWithRelations } from '../../domain/entities/product.entity'
import { NotFoundError } from '@shared/errors/AppError'

export class GetProductBySlug {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(slug: string): Promise<ProductWithRelations> {
    const product = await this.productRepository.findBySlug(slug)
    if (!product) throw new NotFoundError('Product')
    return product
  }
}

import { IProductRepository, UpdateProductData } from '../../domain/repositories/product.repository'
import { ProductWithRelations } from '../../domain/entities/product.entity'
import { NotFoundError, ConflictError } from '@shared/errors/AppError'

export class UpdateProduct {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, data: UpdateProductData): Promise<ProductWithRelations> {
    const product = await this.productRepository.findById(id)
    if (!product) throw new NotFoundError('Product')

    if (data.slug && data.slug !== product.slug) {
      const existing = await this.productRepository.findBySlug(data.slug)
      if (existing) throw new ConflictError(`Product with slug "${data.slug}" already exists`)
    }

    return this.productRepository.update(id, data)
  }
}

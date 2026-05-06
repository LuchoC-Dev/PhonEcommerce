import { IProductRepository, CreateProductData } from '../../domain/repositories/product.repository'
import { ProductWithRelations } from '../../domain/entities/product.entity'
import { ConflictError } from '@shared/errors/AppError'

export class CreateProduct {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: CreateProductData): Promise<ProductWithRelations> {
    const existing = await this.productRepository.findBySlug(data.slug)
    if (existing) throw new ConflictError(`Product with slug "${data.slug}" already exists`)
    return this.productRepository.create(data)
  }
}

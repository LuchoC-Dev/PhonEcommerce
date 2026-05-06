import { IProductRepository } from '../../domain/repositories/product.repository'
import { NotFoundError } from '@shared/errors/AppError'

export class DeleteProduct {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id)
    if (!product) throw new NotFoundError('Product')
    await this.productRepository.delete(id)
  }
}

import { IBrandRepository } from '../../domain/repositories/brand.repository'
import { NotFoundError } from '@shared/errors/AppError'

export class DeleteBrand {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: string): Promise<void> {
    const brand = await this.brandRepository.findById(id)
    if (!brand) throw new NotFoundError('Brand')
    await this.brandRepository.delete(id)
  }
}

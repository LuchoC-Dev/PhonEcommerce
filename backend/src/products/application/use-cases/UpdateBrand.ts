import { IBrandRepository, UpdateBrandData } from '../../domain/repositories/brand.repository'
import { Brand } from '../../domain/entities/brand.entity'
import { NotFoundError, ConflictError } from '@shared/errors/AppError'

export class UpdateBrand {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(id: string, data: UpdateBrandData): Promise<Brand> {
    const brand = await this.brandRepository.findById(id)
    if (!brand) throw new NotFoundError('Brand')

    if (data.slug && data.slug !== brand.slug) {
      const existing = await this.brandRepository.findBySlug(data.slug)
      if (existing) throw new ConflictError(`Brand with slug "${data.slug}" already exists`)
    }

    return this.brandRepository.update(id, data)
  }
}

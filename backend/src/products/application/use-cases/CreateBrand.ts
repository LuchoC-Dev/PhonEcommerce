import { IBrandRepository, CreateBrandData } from '../../domain/repositories/brand.repository'
import { Brand } from '../../domain/entities/brand.entity'
import { ConflictError } from '@shared/errors/AppError'

export class CreateBrand {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(data: CreateBrandData): Promise<Brand> {
    const existing = await this.brandRepository.findBySlug(data.slug)
    if (existing) throw new ConflictError(`Brand with slug "${data.slug}" already exists`)
    return this.brandRepository.create(data)
  }
}

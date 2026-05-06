import { IBrandRepository } from '../../domain/repositories/brand.repository'
import { Brand } from '../../domain/entities/brand.entity'

export class GetBrands {
  constructor(private readonly brandRepository: IBrandRepository) {}

  async execute(): Promise<Brand[]> {
    return this.brandRepository.findAll()
  }
}

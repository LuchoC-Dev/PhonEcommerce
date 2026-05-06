import { ICategoryRepository } from '../../domain/repositories/category.repository'
import { CategoryWithChildren } from '../../domain/entities/category.entity'

export class GetCategories {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(): Promise<CategoryWithChildren[]> {
    return this.categoryRepository.findAll()
  }
}

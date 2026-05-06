import { ICategoryRepository, CreateCategoryData } from '../../domain/repositories/category.repository'
import { Category } from '../../domain/entities/category.entity'
import { ConflictError } from '@shared/errors/AppError'

export class CreateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(data: CreateCategoryData): Promise<Category> {
    const existing = await this.categoryRepository.findBySlug(data.slug)
    if (existing) throw new ConflictError(`Category with slug "${data.slug}" already exists`)
    return this.categoryRepository.create(data)
  }
}

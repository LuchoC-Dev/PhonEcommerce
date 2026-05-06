import { ICategoryRepository, UpdateCategoryData } from '../../domain/repositories/category.repository'
import { Category } from '../../domain/entities/category.entity'
import { NotFoundError, ConflictError } from '@shared/errors/AppError'

export class UpdateCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string, data: UpdateCategoryData): Promise<Category> {
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new NotFoundError('Category')

    if (data.slug && data.slug !== category.slug) {
      const existing = await this.categoryRepository.findBySlug(data.slug)
      if (existing) throw new ConflictError(`Category with slug "${data.slug}" already exists`)
    }

    return this.categoryRepository.update(id, data)
  }
}

import { ICategoryRepository } from '../../domain/repositories/category.repository'
import { NotFoundError } from '@shared/errors/AppError'

export class DeleteCategory {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new NotFoundError('Category')
    await this.categoryRepository.delete(id)
  }
}

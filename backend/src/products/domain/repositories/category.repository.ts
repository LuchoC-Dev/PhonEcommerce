import { Category, CategoryWithChildren } from '../entities/category.entity'

export interface CreateCategoryData {
  name: string
  slug: string
  parentId?: string
}

export interface UpdateCategoryData {
  name?: string
  slug?: string
  parentId?: string | null
}

export interface ICategoryRepository {
  findAll(): Promise<CategoryWithChildren[]>
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
  create(data: CreateCategoryData): Promise<Category>
  update(id: string, data: UpdateCategoryData): Promise<Category>
  delete(id: string): Promise<void>
}

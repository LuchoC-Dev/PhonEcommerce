import { PrismaClient } from '@prisma/client'
import { ICategoryRepository, CreateCategoryData, UpdateCategoryData } from '../../domain/repositories/category.repository'
import { Category, CategoryWithChildren } from '../../domain/entities/category.entity'

export class PrismaCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<CategoryWithChildren[]> {
    const roots = await this.prisma.category.findMany({
      where: { parentId: null },
      include: { children: { include: { children: { include: { children: true } } } } },
      orderBy: { name: 'asc' },
    })
    return roots as CategoryWithChildren[]
  }

  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } })
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { slug } })
  }

  async create(data: CreateCategoryData): Promise<Category> {
    return this.prisma.category.create({ data })
  }

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } })
  }
}

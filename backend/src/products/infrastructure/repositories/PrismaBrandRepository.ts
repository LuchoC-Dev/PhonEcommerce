import { PrismaClient } from '@prisma/client'
import { IBrandRepository, CreateBrandData, UpdateBrandData } from '../../domain/repositories/brand.repository'
import { Brand } from '../../domain/entities/brand.entity'

export class PrismaBrandRepository implements IBrandRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Brand[]> {
    return this.prisma.brand.findMany({ orderBy: { name: 'asc' } })
  }

  async findById(id: string): Promise<Brand | null> {
    return this.prisma.brand.findUnique({ where: { id } })
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    return this.prisma.brand.findUnique({ where: { slug } })
  }

  async create(data: CreateBrandData): Promise<Brand> {
    return this.prisma.brand.create({ data })
  }

  async update(id: string, data: UpdateBrandData): Promise<Brand> {
    return this.prisma.brand.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.brand.delete({ where: { id } })
  }
}

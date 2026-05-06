import { Brand } from '../entities/brand.entity'

export interface CreateBrandData {
  name: string
  slug: string
  logo?: string
}

export interface UpdateBrandData {
  name?: string
  slug?: string
  logo?: string
}

export interface IBrandRepository {
  findAll(): Promise<Brand[]>
  findById(id: string): Promise<Brand | null>
  findBySlug(slug: string): Promise<Brand | null>
  create(data: CreateBrandData): Promise<Brand>
  update(id: string, data: UpdateBrandData): Promise<Brand>
  delete(id: string): Promise<void>
}

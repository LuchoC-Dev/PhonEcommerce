import { Product, ProductWithRelations, PaginatedProducts, ProductStatus } from '../entities/product.entity'

export interface GetProductsFilters {
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  status?: ProductStatus
  search?: string
  page?: number
  pageSize?: number
}

export interface CreateProductData {
  name: string
  slug: string
  description?: string
  price: number
  stock?: number
  status?: ProductStatus
  brandId: string
  categoryId: string
  images?: { url: string; altText?: string; position?: number }[]
}

export interface UpdateProductData {
  name?: string
  slug?: string
  description?: string
  price?: number
  stock?: number
  status?: ProductStatus
  brandId?: string
  categoryId?: string
  images?: { url: string; altText?: string; position?: number }[]
}

export interface IProductRepository {
  findAll(filters: GetProductsFilters): Promise<PaginatedProducts>
  findBySlug(slug: string): Promise<ProductWithRelations | null>
  findById(id: string): Promise<Product | null>
  create(data: CreateProductData): Promise<ProductWithRelations>
  update(id: string, data: UpdateProductData): Promise<ProductWithRelations>
  delete(id: string): Promise<void>
}

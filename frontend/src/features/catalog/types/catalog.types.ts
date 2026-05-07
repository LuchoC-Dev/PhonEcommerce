export interface Brand {
  id: string
  name: string
  slug: string
}

export interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

export interface ProductImage {
  id: string
  url: string
  altText: string | null
  position: number
  productId: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  brand: Brand
  category: Category
  images: ProductImage[]
  createdAt: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ProductsResponse {
  data: Product[]
  meta: PaginationMeta
}

export interface BrandsResponse {
  data: Brand[]
}

export interface CategoriesResponse {
  data: Category[]
}

export interface ProductFilters {
  brandId?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  page?: number
  pageSize?: number
}

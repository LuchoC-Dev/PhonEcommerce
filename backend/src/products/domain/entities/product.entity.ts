export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface ProductImage {
  id: string
  url: string
  altText: string | null
  position: number
  productId: string
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  status: ProductStatus
  brandId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductWithRelations extends Product {
  images: ProductImage[]
  brand: { id: string; name: string; slug: string }
  category: { id: string; name: string; slug: string }
}

export interface PaginatedProducts {
  data: ProductWithRelations[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

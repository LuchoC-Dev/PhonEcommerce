export interface StatCardProps {
  icon: string
  title: string
  value: string | number
  href: string
}

export interface AdminStats {
  products: number
  brands: number
  categories: number
  orders: number
}

export interface CreateProductDTO {
  name: string
  description?: string
  price: number
  brandId: string
  categoryId: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface CreateBrandDTO {
  name: string
}

export interface UpdateBrandDTO {
  name: string
}

export interface CreateCategoryDTO {
  name: string
  parentId?: string | null
}

export interface UpdateCategoryDTO {
  name: string
  parentId?: string | null
}
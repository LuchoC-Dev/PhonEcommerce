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

export type StockMovementType = 'RESTOCK' | 'SALE' | 'ADJUSTMENT' | 'RETURN'

export interface StockInfo {
  productId: string
  stock: number
}

export interface StockMovement {
  id: string
  productId: string
  delta: number
  type: StockMovementType
  reason: string
  createdAt: string
}

export interface StockMovementsResponse {
  data: StockMovement[]
  meta: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface AdjustStockDTO {
  delta: number
  type: 'RESTOCK' | 'ADJUSTMENT'
  reason: string
}
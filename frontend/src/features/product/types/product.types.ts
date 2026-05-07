export type { Product, ProductImage, Brand, Category } from '@features/catalog/types/catalog.types'

export interface AddToCartPayload {
  productId: string
  quantity: number
}

export interface AddToCartResponse {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
  }
}

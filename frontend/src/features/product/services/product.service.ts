import api from '@shared/lib/api'
import type { Product } from '@features/catalog/types/catalog.types'
import type { AddToCartPayload, AddToCartResponse } from '../types/product.types'

export async function getProductBySlug(slug: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${slug}`)
  return data
}

export async function addToCart(payload: AddToCartPayload): Promise<AddToCartResponse> {
  const { data } = await api.post<AddToCartResponse>('/cart/items', payload)
  return data
}

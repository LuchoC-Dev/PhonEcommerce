import api from '@shared/lib/api'
import type { CartResponse, AddCartItemPayload, UpdateCartItemPayload } from '../types/cart.types'

export async function fetchCart(): Promise<CartResponse> {
  const { data } = await api.get<CartResponse>('/cart')
  return data
}

export async function addItem(payload: AddCartItemPayload): Promise<CartResponse> {
  const { data } = await api.post<CartResponse>('/cart/items', payload)
  return data
}

export async function updateItem(productId: string, payload: UpdateCartItemPayload): Promise<CartResponse> {
  const { data } = await api.put<CartResponse>(`/cart/items/${productId}`, payload)
  return data
}

export async function removeItem(productId: string): Promise<CartResponse> {
  const { data } = await api.delete<CartResponse>(`/cart/items/${productId}`)
  return data
}

export async function clearCart(): Promise<void> {
  await api.delete('/cart')
}

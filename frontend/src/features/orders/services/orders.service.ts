import api from '@shared/lib/api'
import type { CheckoutPreview, CheckoutRequest, OrderWithDetails, OrderPage } from '../types/orders.types'

export async function checkoutPreview(payload: CheckoutRequest): Promise<CheckoutPreview> {
  const { data } = await api.post<CheckoutPreview>('/orders/checkout/preview', payload)
  return data
}

export async function checkoutConfirm(payload: CheckoutRequest): Promise<OrderWithDetails> {
  const { data } = await api.post<OrderWithDetails>('/orders/checkout/confirm', payload)
  return data
}

export async function getOrders(page = 1, pageSize = 20): Promise<OrderPage> {
  const { data } = await api.get<OrderPage>('/orders', { params: { page, pageSize } })
  return data
}

export async function getOrder(id: string): Promise<OrderWithDetails> {
  const { data } = await api.get<OrderWithDetails>(`/orders/${id}`)
  return data
}

export async function cancelOrder(id: string): Promise<OrderWithDetails> {
  const { data } = await api.patch<OrderWithDetails>(`/orders/${id}/cancel`)
  return data
}

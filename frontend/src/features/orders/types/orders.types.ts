export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface ShippingAddress {
  name: string
  phone?: string
  address: string
  city: string
  state?: string
  country: string
  zipCode: string
}

// Preview

export interface PreviewItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface CheckoutPreview {
  items: PreviewItem[]
  totalAmount: number
  shipping: ShippingAddress
}

// Order (flat shape from backend)

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  createdAt: string
}

export interface Order {
  id: string
  accountId: string
  status: OrderStatus
  totalAmount: number
  shippingName: string
  shippingPhone: string | null
  shippingAddress: string
  shippingCity: string
  shippingState: string | null
  shippingCountry: string
  shippingZipCode: string
  createdAt: string
  updatedAt: string
}

export interface OrderWithDetails extends Order {
  items: OrderItem[]
  statusHistory: Array<{
    id: string
    orderId: string
    fromStatus: OrderStatus | null
    toStatus: OrderStatus
    changedBy: string | null
    note: string | null
    createdAt: string
  }>
}

// Paginated list
export interface OrderPage {
  data: Order[]
  total: number
  page: number
  pageSize: number
}

export interface CheckoutRequest {
  shipping: ShippingAddress
}

/** Valid lifecycle states for an order. */
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

/** Shipping address snapshot captured at checkout. */
export interface ShippingInfo {
  name: string
  phone?: string | null
  address: string
  city: string
  state?: string | null
  country: string
  zipCode: string
}

/** A single line item in an order, with the price locked at checkout time. */
export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  /** Price per unit at the time the order was placed. */
  unitPrice: number
  createdAt: Date
}

/** One entry in the status change history. */
export interface OrderStatusHistory {
  id: string
  orderId: string
  fromStatus: OrderStatus | null
  toStatus: OrderStatus
  changedBy: string | null
  note: string | null
  createdAt: Date
}

/** Order aggregate root (without items). */
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
  createdAt: Date
  updatedAt: Date
}

/** Order with all items and status history. */
export interface OrderWithDetails extends Order {
  items: OrderItem[]
  statusHistory: OrderStatusHistory[]
}

/** A line item in a preview (before order is created). */
export interface PreviewItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

/** Result of a checkout preview (no DB writes). */
export interface OrderPreview {
  items: PreviewItem[]
  totalAmount: number
  shipping: ShippingInfo
}

/** Paginated order list. */
export interface OrderPage {
  data: Order[]
  total: number
  page: number
  pageSize: number
}

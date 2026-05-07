export interface CartItem {
  productId: string
  name: string
  slug: string
  image: string
  quantity: number
  priceAtAdd: number
  currentPrice: number
}

export interface CartResponse {
  items: CartItem[]
}

export interface AddCartItemPayload {
  productId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  quantity: number
}

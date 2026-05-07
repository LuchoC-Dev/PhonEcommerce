import { create } from 'zustand'
import type { CartItem } from '../types/cart.types'
import * as cartService from '../services/cart.service'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  error: string | null

  open: () => void
  close: () => void
  reset: () => void
  sync: () => Promise<void>
  addItem: (productId: string, quantity: number) => Promise<void>
  updateItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ items: [], isOpen: false, error: null }),

  sync: async () => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartService.fetchCart()
      set({ items: cart.items ?? [], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'No se pudo cargar el carrito' })
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartService.addItem({ productId, quantity })
      set({ items: cart.items ?? [], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'No se pudo agregar el producto' })
      throw new Error('add_failed')
    }
  },

  updateItem: async (productId, quantity) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartService.updateItem(productId, { quantity })
      set({ items: cart.items ?? [], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'No se pudo actualizar la cantidad' })
    }
  },

  removeItem: async (productId) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartService.removeItem(productId)
      set({ items: cart.items ?? [], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'No se pudo eliminar el producto' })
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null })
    try {
      await cartService.clearCart()
      set({ items: [], isLoading: false })
    } catch {
      set({ isLoading: false, error: 'No se pudo vaciar el carrito' })
    }
  },
}))

export function selectItemCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0)
}

export function selectTotal(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0)
}

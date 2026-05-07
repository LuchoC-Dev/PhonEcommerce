'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@features/auth/store/auth.store'
import { useCartStore } from '@features/cart/store/cart.store'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseAddToCartResult {
  status: Status
  add: (productId: string, quantity: number) => Promise<void>
}

export function useAddToCart(): UseAddToCartResult {
  const [status, setStatus] = useState<Status>('idle')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const cartAddItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.open)
  const router = useRouter()

  async function add(productId: string, quantity: number) {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setStatus('loading')
    try {
      await cartAddItem(productId, quantity)
      setStatus('success')
      openCart()
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return { status, add }
}

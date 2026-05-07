'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@features/auth/store/auth.store'
import { addToCart } from '../services/product.service'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface UseAddToCartResult {
  status: Status
  add: (productId: string, quantity: number) => Promise<void>
}

export function useAddToCart(): UseAddToCartResult {
  const [status, setStatus] = useState<Status>('idle')
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()

  async function add(productId: string, quantity: number) {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setStatus('loading')
    try {
      await addToCart({ productId, quantity })
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return { status, add }
}

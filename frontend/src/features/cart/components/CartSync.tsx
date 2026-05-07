'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@features/auth/store/auth.store'
import { useCartStore } from '../store/cart.store'

export function CartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const sync = useCartStore((s) => s.sync)
  const reset = useCartStore((s) => s.reset)

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated) {
      sync()
    } else {
      reset()
    }
  }, [isAuthenticated, isLoading, sync, reset])

  return null
}

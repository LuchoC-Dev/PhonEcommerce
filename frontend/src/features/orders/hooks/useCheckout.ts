'use client'

import { useState } from 'react'
import { useCartStore } from '@features/cart/store/cart.store'
import * as ordersService from '../services/orders.service'
import type { ShippingAddress, CheckoutPreview, OrderWithDetails } from '../types/orders.types'

type CheckoutStep = 0 | 1 | 2

export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>(0)
  const [shipping, setShipping] = useState<ShippingAddress | null>(null)
  const [preview, setPreview] = useState<CheckoutPreview | null>(null)
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCartStore((s) => s.reset)

  async function submitShipping(data: ShippingAddress) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await ordersService.checkoutPreview({ shipping: data })
      setShipping(data)
      setPreview(result)
      setStep(1)
    } catch {
      setError('No se pudo cargar el resumen. Intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  async function confirmOrder() {
    if (!shipping) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await ordersService.checkoutConfirm({ shipping })
      setOrder(result)
      reset()
      setStep(2)
    } catch {
      setError('No se pudo confirmar el pedido. Intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  function goBack() {
    if (step === 1) setStep(0)
  }

  return { step, shipping, preview, order, isLoading, error, submitShipping, confirmOrder, goBack }
}

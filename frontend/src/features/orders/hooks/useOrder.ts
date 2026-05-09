'use client'

import { useCallback, useEffect, useState } from 'react'
import * as ordersService from '../services/orders.service'
import type { OrderWithDetails } from '../types/orders.types'

export function useOrder(id: string) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ordersService.getOrder(id)
      .then((data) => { if (!cancelled) setOrder(data) })
      .catch(() => { if (!cancelled) setError('No se pudo cargar la orden.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const cancelOrder = useCallback(async () => {
    setIsCancelling(true)
    setCancelError(null)
    try {
      const updated = await ordersService.cancelOrder(id)
      setOrder((prev) => (prev ? { ...prev, ...updated } : updated))
    } catch {
      setCancelError('No se pudo cancelar la orden. Intentá de nuevo.')
    } finally {
      setIsCancelling(false)
    }
  }, [id])

  return { order, isLoading, error, cancelOrder, isCancelling, cancelError }
}

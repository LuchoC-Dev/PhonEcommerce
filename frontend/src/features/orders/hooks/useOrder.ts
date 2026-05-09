'use client'

import { useEffect, useState } from 'react'
import * as ordersService from '../services/orders.service'
import type { OrderWithDetails } from '../types/orders.types'

export function useOrder(id: string) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ordersService.getOrder(id)
      .then((data) => { if (!cancelled) setOrder(data) })
      .catch(() => { if (!cancelled) setError('No se pudo cargar la orden.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [id])

  return { order, isLoading, error }
}

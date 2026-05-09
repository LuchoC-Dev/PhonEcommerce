'use client'

import { useEffect, useState } from 'react'
import * as ordersService from '../services/orders.service'
import type { Order } from '../types/orders.types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ordersService.getOrders()
      .then((page) => { if (!cancelled) setOrders(page.data) })
      .catch(() => { if (!cancelled) setError('No se pudieron cargar las órdenes.') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { orders, isLoading, error }
}

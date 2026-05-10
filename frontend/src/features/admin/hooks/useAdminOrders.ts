'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/admin.service'
import type { Order } from '@features/orders/types/orders.types'

interface UseAdminOrdersReturn {
  orders: Order[]
  totalPages: number
  total: number
  page: number
  loading: boolean
  error: string | null
  fetchOrders: (page?: number) => Promise<void>
  setPage: (page: number) => void
}

export function useAdminOrders(): UseAdminOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async (p?: number) => {
    const currentPage = p ?? page
    setLoading(true)
    setError(null)
    try {
      const response = await adminService.getOrders(currentPage, 20)
      setOrders(response.data)
      setTotalPages(Math.ceil(response.total / response.pageSize) || 1)
      setTotal(response.total)
      if (p !== undefined) setPage(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { orders, totalPages, total, page, loading, error, fetchOrders, setPage }
}
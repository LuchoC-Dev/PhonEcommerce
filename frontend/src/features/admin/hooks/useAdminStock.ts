'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/admin.service'
import type { StockInfo, StockMovement, AdjustStockDTO } from '../types/admin.types'

interface UseAdminStockReturn {
  stockInfo: StockInfo | null
  movements: StockMovement[]
  page: number
  totalPages: number
  total: number
  loading: boolean
  movementsLoading: boolean
  error: string | null
  fetchStock: () => Promise<void>
  fetchMovements: (p?: number) => Promise<void>
  adjustStock: (data: AdjustStockDTO) => Promise<boolean>
  setPage: (page: number) => void
}

export function useAdminStock(productId: string): UseAdminStockReturn {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [movementsLoading, setMovementsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStock = useCallback(async () => {
    try {
      const data = await adminService.getProductStock(productId)
      setStockInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar stock')
    }
  }, [productId])

  const fetchMovements = useCallback(async (p?: number) => {
    const currentPage = p ?? page
    setMovementsLoading(true)
    try {
      const response = await adminService.getStockMovements(productId, currentPage)
      setMovements(response.data)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
      if (p !== undefined) setPage(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar movimientos')
    } finally {
      setMovementsLoading(false)
    }
  }, [productId, page])

  const adjustStock = useCallback(async (data: AdjustStockDTO): Promise<boolean> => {
    try {
      await adminService.adjustStock(productId, data)
      await fetchStock()
      await fetchMovements(page)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al ajustar stock')
      return false
    }
  }, [productId, fetchStock, fetchMovements, page])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchStock()
      setLoading(false)
    }
    load()
  }, [fetchStock])

  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  return {
    stockInfo,
    movements,
    page,
    totalPages,
    total,
    loading,
    movementsLoading,
    error,
    fetchStock,
    fetchMovements,
    adjustStock,
    setPage,
  }
}
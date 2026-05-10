'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/admin.service'
import type { Product } from '@features/catalog/types/catalog.types'

interface UseAdminProductsReturn {
  products: Product[]
  totalPages: number
  total: number
  page: number
  loading: boolean
  error: string | null
  fetchProducts: (page?: number) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  setPage: (page: number) => void
}

export function useAdminProducts(): UseAdminProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (p?: number) => {
    const currentPage = p ?? page
    setLoading(true)
    setError(null)
    try {
      const response = await adminService.getProducts(currentPage, 20)
      setProducts(response.data)
      setTotalPages(response.totalPages)
      setTotal(response.total)
      if (p !== undefined) setPage(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [page])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      await adminService.deleteProduct(id)
      await fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto')
    }
  }, [fetchProducts])

  useEffect(() => {
    fetchProducts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { products, totalPages, total, page, loading, error, fetchProducts, deleteProduct, setPage }
}
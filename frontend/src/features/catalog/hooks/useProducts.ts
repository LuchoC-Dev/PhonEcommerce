'use client'

import { useState, useEffect, useCallback } from 'react'
import { catalogService } from '../services/catalog.service'
import type { Product, PaginationMeta, ProductFilters } from '../types/catalog.types'

interface UseProductsReturn {
  products: Product[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useProducts(filters: ProductFilters): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await catalogService.getProducts(filters)
      setProducts(response.data)
      setMeta(response.meta)
    } catch {
      setError('No se pudieron cargar los productos. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { products, meta, loading, error, refetch: fetch }
}

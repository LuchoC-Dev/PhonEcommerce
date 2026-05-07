'use client'

import { useState, useEffect } from 'react'
import type { Product } from '@features/catalog/types/catalog.types'
import { getProductBySlug } from '../services/product.service'

interface UseProductResult {
  product: Product | null
  isLoading: boolean
  error: string | null
}

export function useProduct(slug: string): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    getProductBySlug(slug)
      .then((data) => {
        if (!cancelled) setProduct(data)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudo cargar el producto.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { product, isLoading, error }
}

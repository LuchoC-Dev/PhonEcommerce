'use client'

import { useState, useEffect } from 'react'
import { catalogService } from '../services/catalog.service'
import type { Brand } from '../types/catalog.types'

interface UseBrandsReturn {
  brands: Brand[]
  loading: boolean
  error: string | null
}

export function useBrands(): UseBrandsReturn {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    catalogService
      .getBrands()
      .then((res) => setBrands(res.data))
      .catch(() => setError('No se pudieron cargar las marcas.'))
      .finally(() => setLoading(false))
  }, [])

  return { brands, loading, error }
}

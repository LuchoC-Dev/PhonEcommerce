'use client'

import { useState, useEffect } from 'react'
import { catalogService } from '../services/catalog.service'
import type { Category } from '../types/catalog.types'

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    catalogService
      .getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setError('No se pudieron cargar las categorías.'))
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading, error }
}

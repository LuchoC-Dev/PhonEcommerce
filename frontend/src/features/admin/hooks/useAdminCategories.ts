'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/admin.service'
import type { Category } from '@features/catalog/types/catalog.types'
import type { CreateCategoryDTO, UpdateCategoryDTO } from '../types/admin.types'

interface UseAdminCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  createCategory: (data: CreateCategoryDTO) => Promise<void>
  updateCategory: (id: string, data: UpdateCategoryDTO) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = []
  for (const cat of categories) {
    result.push(cat)
    if (cat.children?.length) {
      result.push(...flattenCategories(cat.children))
    }
  }
  return result
}

export function useAdminCategories(): UseAdminCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getCategories()
      setCategories(flattenCategories(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (data: CreateCategoryDTO) => {
    try {
      await adminService.createCategory(data)
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear categoría')
      throw err
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryDTO) => {
    try {
      await adminService.updateCategory(id, data)
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría')
      throw err
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await adminService.deleteCategory(id)
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría')
    }
  }, [fetchCategories])

  useEffect(() => {
    fetchCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
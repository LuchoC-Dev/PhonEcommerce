'use client'

import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../services/admin.service'
import type { Brand } from '@features/catalog/types/catalog.types'
import type { CreateBrandDTO, UpdateBrandDTO } from '../types/admin.types'

interface UseAdminBrandsReturn {
  brands: Brand[]
  loading: boolean
  error: string | null
  fetchBrands: () => Promise<void>
  createBrand: (data: CreateBrandDTO) => Promise<void>
  updateBrand: (id: string, data: UpdateBrandDTO) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
}

export function useAdminBrands(): UseAdminBrandsReturn {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getBrands()
      setBrands(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar marcas')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBrand = useCallback(async (data: CreateBrandDTO) => {
    try {
      await adminService.createBrand(data)
      await fetchBrands()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear marca')
      throw err
    }
  }, [fetchBrands])

  const updateBrand = useCallback(async (id: string, data: UpdateBrandDTO) => {
    try {
      await adminService.updateBrand(id, data)
      await fetchBrands()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar marca')
      throw err
    }
  }, [fetchBrands])

  const deleteBrand = useCallback(async (id: string) => {
    try {
      await adminService.deleteBrand(id)
      await fetchBrands()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar marca')
    }
  }, [fetchBrands])

  useEffect(() => {
    fetchBrands()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { brands, loading, error, fetchBrands, createBrand, updateBrand, deleteBrand }
}
'use client'

import { useState, useCallback } from 'react'
import {
  ProductGrid,
  FilterSidebar,
  SearchBar,
  Pagination,
  useProducts,
  useBrands,
  useCategories,
} from '@features/catalog'
import type { ProductFilters } from '@features/catalog'

const DEFAULT_PAGE_SIZE = 20

const INITIAL_FILTERS: ProductFilters = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}

export default function CatalogPage() {
  const [filters, setFilters] = useState<ProductFilters>(INITIAL_FILTERS)

  const { products, meta, loading, error } = useProducts(filters)
  const { brands } = useBrands()
  const { categories } = useCategories()

  const handleFilterChange = useCallback((partial: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }))
  }, [])

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS)
  }, [])

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const activeFiltersCount = [
    filters.brandId,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#161618]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[--font-display] text-3xl font-bold text-[--color-text]">
            Catálogo
          </h1>
          <p className="mt-1 text-[--color-text-muted]">
            Los mejores smartphones, curados para vos.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar value={filters.search ?? ''} onChange={handleSearch} />
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                brands={brands}
                categories={categories}
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Results info */}
            <div className="flex items-center justify-between">
              {meta && !loading && (
                <p className="text-sm text-[--color-text-subtle]">
                  {meta.total} {meta.total === 1 ? 'producto' : 'productos'}
                  {activeFiltersCount > 0 && ' con filtros aplicados'}
                </p>
              )}
            </div>

            <ProductGrid products={products} loading={loading} error={error} />

            {meta && (
              <Pagination meta={meta} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

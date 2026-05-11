'use client'

import { Button } from '@shared/components'
import type { Brand, Category, ProductFilters } from '../types/catalog.types'

interface FilterSidebarProps {
  brands: Brand[]
  categories: Category[]
  filters: ProductFilters
  onChange: (filters: Partial<ProductFilters>) => void
  onReset: () => void
}

function CategoryTree({
  categories,
  selectedId,
  onSelect,
  depth = 0,
}: {
  categories: Category[]
  selectedId?: string
  onSelect: (id: string) => void
  depth?: number
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            onClick={() => onSelect(cat.id)}
            className={`w-full text-left text-sm px-2 py-1.5 rounded-[--radius-md] transition-colors ${
              depth > 0 ? 'pl-5' : ''
            } ${
              selectedId === cat.id
                ? 'bg-primary text-white font-medium'
                : 'text-text-muted hover:text-text hover:bg-border'
            }`}
          >
            {cat.name}
          </button>
          {cat.children && cat.children.length > 0 && (
            <CategoryTree
              categories={cat.children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </li>
      ))}
    </ul>
  )
}

export function FilterSidebar({
  brands = [],
  categories = [],
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.brandId || filters.categoryId || filters.minPrice || filters.maxPrice

  function handleBrandClick(id: string) {
    onChange({ brandId: filters.brandId === id ? undefined : id, page: 1 })
  }

  function handleCategoryClick(id: string) {
    onChange({ categoryId: filters.categoryId === id ? undefined : id, page: 1 })
  }

  function handlePriceChange(field: 'minPrice' | 'maxPrice', raw: string) {
    const val = raw === '' ? undefined : Number(raw)
    onChange({ [field]: val, page: 1 })
  }

  return (
    <aside className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-[--font-display] text-sm font-semibold text-text uppercase tracking-wider">
          Filtros
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-primary hover:text-primary-light transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Marcas */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Marca</p>
        <div className="flex flex-col gap-0.5">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-[--radius-md] transition-colors ${
                filters.brandId === brand.id
                  ? 'bg-primary text-white font-medium'
                  : 'text-text-muted hover:text-text hover:bg-border'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categorías */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Categoría</p>
          <CategoryTree
            categories={categories}
            selectedId={filters.categoryId}
            onSelect={handleCategoryClick}
          />
        </div>
      )}

      {/* Precio */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Precio</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full bg-card border border-border rounded-[--radius-md] px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-primary"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full bg-card border border-border rounded-[--radius-md] px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-primary"
          />
        </div>
      </div>
    </aside>
  )
}

'use client'

import { Spinner } from '@shared/components'
import { ProductCard } from './ProductCard'
import type { Product } from '../types/catalog.types'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  error: string | null
}

export function ProductGrid({ products, loading, error }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <p className="text-[--color-text-muted]">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <span className="text-5xl opacity-20">🔍</span>
        <p className="text-[--color-text-muted]">No se encontraron productos con esos filtros.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

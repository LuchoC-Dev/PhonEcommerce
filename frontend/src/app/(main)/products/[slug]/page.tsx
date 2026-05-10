'use client'

import { use } from 'react'
import { useProduct } from '@features/product/hooks/useProduct'
import { ProductGallery } from '@features/product/components/ProductGallery'
import { ProductInfo } from '@features/product/components/ProductInfo'
import { ProductSpecs } from '@features/product/components/ProductSpecs'
import { Spinner } from '@shared/components/Spinner'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params)
  const { product, isLoading, error } = useProduct(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#161618] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#161618] flex items-center justify-center">
        <p className="text-[#9090a0]">{error ?? 'Producto no encontrado.'}</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#161618]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info + carrito */}
          <ProductInfo product={product} />
        </div>

        {/* Specs */}
        <div className="mt-12">
          <ProductSpecs product={product} />
        </div>
      </div>
    </main>
  )
}

'use client'

import { use } from 'react'
import Link from 'next/link'
import { withAdmin } from '@shared/components/withAdmin'
import { Badge } from '@shared/components/Badge'
import { Spinner } from '@shared/components/Spinner'
import { useAdminStock } from '@features/admin/hooks/useAdminStock'
import { useAdminProducts } from '@features/admin/hooks/useAdminProducts'
import { StockAdjustForm } from '@features/admin/components/stock/StockAdjustForm'
import { StockMovementList } from '@features/admin/components/stock/StockMovementList'
import type { AdjustStockDTO } from '@features/admin/types/admin.types'

function getStockBadge(stock: number) {
  if (stock === 0) return { label: 'Sin stock', variant: 'danger' as const }
  if (stock <= 5) return { label: 'Stock bajo', variant: 'warning' as const }
  return { label: 'En stock', variant: 'success' as const }
}

function ProductStockPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params)
  const { products } = useAdminProducts()
  const {
    stockInfo,
    movements,
    page,
    totalPages,
    total,
    loading,
    movementsLoading,
    error,
    adjustStock,
    fetchMovements,
    setPage,
  } = useAdminStock(productId)

  const product = products.find((p) => p.id === productId)
  const productName = product?.name ?? 'Producto'
  const productBrand = product?.brand?.name ?? '—'

  const handleAdjust = async (data: AdjustStockDTO) => {
    return adjustStock(data)
  }

  const handleMovementsPageChange = (newPage: number) => {
    setPage(newPage)
    fetchMovements(newPage)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error && !stockInfo) {
    return (
      <div className="p-8">
        <p className="text-[--color-danger] text-center py-8">{error}</p>
      </div>
    )
  }

  const currentStock = stockInfo?.stock ?? 0
  const badge = getStockBadge(currentStock)

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/stock"
          className="text-sm text-[#818cf8] hover:text-[#6366f1] transition-colors mb-2 inline-block"
        >
          ← Volver al stock
        </Link>
        <div className="flex items-center gap-4 mt-2">
          <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">{productName}</h1>
          <Badge variant={badge.variant}>{badge.label} ({currentStock})</Badge>
        </div>
        <p className="text-[#94a3b8] mt-1">Marca: {productBrand}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
          <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Ajustar stock</h2>
          <StockAdjustForm onSubmit={handleAdjust} />
        </div>

        <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
          <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Historial de movimientos</h2>
          <StockMovementList
            movements={movements}
            loading={movementsLoading}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={handleMovementsPageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default withAdmin(ProductStockPage)
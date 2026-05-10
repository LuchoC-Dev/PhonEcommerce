'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'
import type { Product } from '@features/catalog/types/catalog.types'

interface ProductsTableProps {
  products: Product[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onDelete: (id: string) => Promise<void>
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  PUBLISHED: { label: 'Publicado', variant: 'success' },
  DRAFT: { label: 'Borrador', variant: 'warning' },
  ARCHIVED: { label: 'Archivado', variant: 'default' },
}

function ProductsTable({ products, loading, error, page, totalPages, total, onPageChange, onDelete }: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error) {
    return <p className="text-[--color-danger] text-center py-8">{error}</p>
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#94a3b8] mb-4">No hay productos</p>
        <Link href="/admin/products/new">
          <Button size="sm">Crear producto</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
              <th className="py-3 px-4 font-medium">Nombre</th>
              <th className="py-3 px-4 font-medium">Marca</th>
              <th className="py-3 px-4 font-medium">Categoría</th>
              <th className="py-3 px-4 font-medium">Precio</th>
              <th className="py-3 px-4 font-medium">Stock</th>
              <th className="py-3 px-4 font-medium">Estado</th>
              <th className="py-3 px-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                <td className="py-3 px-4 text-[#f8fafc] font-medium">{product.name}</td>
                <td className="py-3 px-4 text-[#94a3b8]">{product.brand?.name ?? '—'}</td>
                <td className="py-3 px-4 text-[#94a3b8]">{product.category?.name ?? '—'}</td>
                <td className="py-3 px-4 text-[#f8fafc]">{formatPrice(product.price)}</td>
                <td className="py-3 px-4 text-[#f8fafc]">{product.stock}</td>
                <td className="py-3 px-4">
                  <Badge variant={statusConfig[product.status]?.variant ?? 'default'}>
                    {statusConfig[product.status]?.label ?? product.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  {confirmId === product.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94a3b8]">¿Eliminar?</span>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        Sí
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmId(null)}
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button size="sm" variant="secondary">Editar</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmId(product.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e1e2e]">
        <p className="text-sm text-[#94a3b8]">{total} producto{total !== 1 ? 's' : ''}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </Button>
          <span className="flex items-center px-3 text-sm text-[#94a3b8]">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente →
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProductsTable }
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Spinner } from '@shared/components/Spinner'
import type { Product } from '@features/catalog/types/catalog.types'

interface StockTableProps {
  products: Product[]
  loading: boolean
  error: string | null
  search: string
  onSearchChange: (value: string) => void
}

function getStockBadge(stock: number) {
  if (stock === 0) return { label: 'Sin stock', variant: 'danger' as const }
  if (stock <= 5) return { label: 'Stock bajo', variant: 'warning' as const }
  return { label: 'En stock', variant: 'success' as const }
}

function StockTable({ products, loading, error, search, onSearchChange }: StockTableProps) {
  const [searchInput, setSearchInput] = useState(search)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchInput.toLowerCase())
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    onSearchChange(e.target.value)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error) {
    return <p className="text-[--color-danger] text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#94a3b8]">
            {searchInput ? 'No se encontraron productos' : 'No hay productos'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
                <th className="py-3 px-4 font-medium">Nombre</th>
                <th className="py-3 px-4 font-medium">Marca</th>
                <th className="py-3 px-4 font-medium">Stock</th>
                <th className="py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const badge = getStockBadge(product.stock)
                return (
                  <tr key={product.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                    <td className="py-3 px-4 text-[#f8fafc] font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-[#94a3b8]">{product.brand?.name ?? '—'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={badge.variant}>{badge.label} ({product.stock})</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/stock/${product.id}`}>
                        <Button size="sm" variant="secondary">Gestionar</Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export { StockTable }
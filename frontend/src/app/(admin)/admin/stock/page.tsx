'use client'

import { useState } from 'react'
import { withAdmin } from '@shared/components/withAdmin'
import { useAdminProducts } from '@features/admin/hooks/useAdminProducts'
import { StockTable } from '@features/admin/components/stock/StockTable'

function StockPage() {
  const { products, loading, error } = useAdminProducts()
  const [search, setSearch] = useState('')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Stock</h1>
        <p className="text-[#94a3b8] mt-1">Gestioná el stock de los productos</p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <StockTable
          products={products}
          loading={loading}
          error={error}
          search={search}
          onSearchChange={setSearch}
        />
      </div>
    </div>
  )
}

export default withAdmin(StockPage)
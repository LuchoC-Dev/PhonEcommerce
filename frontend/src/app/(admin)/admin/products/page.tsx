'use client'

import Link from 'next/link'
import { withAdmin } from '@shared/components/withAdmin'
import { Button } from '@shared/components/Button'
import { useAdminProducts } from '@features/admin/hooks/useAdminProducts'
import { ProductsTable } from '@features/admin/components/products/ProductsTable'

function ProductsPage() {
  const { products, totalPages, total, page, loading, error, fetchProducts, deleteProduct, setPage } = useAdminProducts()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Productos</h1>
          <p className="text-[#94a3b8] mt-1">Gestioná el catálogo de productos</p>
        </div>
        <Link href="/admin/products/new">
          <Button>Nuevo producto</Button>
        </Link>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <ProductsTable
          products={products}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={(p) => { setPage(p); fetchProducts(p) }}
          onDelete={deleteProduct}
        />
      </div>
    </div>
  )
}

export default withAdmin(ProductsPage)
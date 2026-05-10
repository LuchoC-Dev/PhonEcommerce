'use client'

import { withAdmin } from '@shared/components/withAdmin'
import { useAdminBrands } from '@features/admin/hooks/useAdminBrands'
import { BrandsTable } from '@features/admin/components/brands/BrandsTable'

function BrandsPage() {
  const { brands, loading, error, createBrand, updateBrand, deleteBrand } = useAdminBrands()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Marcas</h1>
        <p className="text-[#94a3b8] mt-1">Gestioná las marcas de productos</p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <BrandsTable
          brands={brands}
          loading={loading}
          error={error}
          onCreate={createBrand}
          onUpdate={updateBrand}
          onDelete={deleteBrand}
        />
      </div>
    </div>
  )
}

export default withAdmin(BrandsPage)
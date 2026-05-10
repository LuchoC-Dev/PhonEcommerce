'use client'

import { use } from 'react'
import { withAdmin } from '@shared/components/withAdmin'
import { ProductForm } from '@features/admin/components/products/ProductForm'

function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">
          {isNew ? 'Nuevo producto' : 'Editar producto'}
        </h1>
        <p className="text-[#94a3b8] mt-1">
          {isNew ? 'Completá los datos del nuevo producto' : 'Modificá los datos del producto'}
        </p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <ProductForm productId={isNew ? undefined : id} />
      </div>
    </div>
  )
}

export default withAdmin(ProductEditPage)
'use client'

import { withAdmin } from '@shared/components/withAdmin'
import { useAdminCategories } from '@features/admin/hooks/useAdminCategories'
import { CategoriesTable } from '@features/admin/components/categories/CategoriesTable'

function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useAdminCategories()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Categorías</h1>
        <p className="text-[#94a3b8] mt-1">Gestioná las categorías de productos</p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <CategoriesTable
          categories={categories}
          loading={loading}
          error={error}
          onCreate={createCategory}
          onUpdate={updateCategory}
          onDelete={deleteCategory}
        />
      </div>
    </div>
  )
}

export default withAdmin(CategoriesPage)
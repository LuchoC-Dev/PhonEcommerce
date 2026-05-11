'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'
import { CategoryForm } from './CategoryForm'
import type { Category } from '@features/catalog/types/catalog.types'
import type { CreateCategoryDTO, UpdateCategoryDTO } from '@features/admin/types/admin.types'

interface CategoriesTableProps {
  categories: Category[]
  loading: boolean
  error: string | null
  onCreate: (data: CreateCategoryDTO) => Promise<void>
  onUpdate: (id: string, data: UpdateCategoryDTO) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function CategoriesTable({ categories, loading, error, onCreate, onUpdate, onDelete }: CategoriesTableProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const handleCreate = async (data: CreateCategoryDTO) => {
    await onCreate(data)
    setShowForm(false)
  }

  const handleUpdate = async (data: UpdateCategoryDTO) => {
    if (!editingCategory) return
    await onUpdate(editingCategory.id, data)
    setEditingCategory(null)
  }

  const parentName = (parentId: string | null | undefined) => {
    if (!parentId) return '—'
    const parent = categories.find((c) => c.id === parentId)
    return parent?.name ?? '—'
  }

  const rootCategories = categories.filter((c) => !c.parentId)

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error) {
    return <p className="text-danger text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => { setShowForm(true); setEditingCategory(null) }}>
          + Nueva categoría
        </Button>
      </div>

      {(showForm || editingCategory) && (
        <div className="mb-6 p-4 rounded-xl border border-[#1e1e2e] bg-[#0f0f17]">
          <h3 className="text-sm font-medium text-[#f8fafc] mb-3">
            {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
          </h3>
          <CategoryForm
            defaultName={editingCategory?.name}
            defaultParentId={editingCategory?.parentId ?? null}
            parentCategories={rootCategories}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingCategory(null) }}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-center text-[#94a3b8] py-8">No hay categorías</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
                <th className="py-3 px-4 font-medium">Nombre</th>
                <th className="py-3 px-4 font-medium">Slug</th>
                <th className="py-3 px-4 font-medium">Categoría padre</th>
                <th className="py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                  <td className="py-3 px-4 text-[#f8fafc] font-medium">{category.name}</td>
                  <td className="py-3 px-4 text-[#94a3b8]">{category.slug}</td>
                  <td className="py-3 px-4 text-[#94a3b8]">{parentName(category.parentId)}</td>
                  <td className="py-3 px-4">
                    {confirmId === category.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8]">¿Eliminar?</span>
                        <Button size="sm" variant="danger" loading={deletingId === category.id} onClick={() => handleDelete(category.id)}>
                          Sí
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          No
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => { setEditingCategory(category); setShowForm(false) }}>
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(category.id)}>
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
      )}
    </div>
  )
}

export { CategoriesTable }
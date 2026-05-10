'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'
import { BrandForm } from './BrandForm'
import type { Brand } from '@features/catalog/types/catalog.types'
import type { CreateBrandDTO, UpdateBrandDTO } from '@features/admin/types/admin.types'

interface BrandsTableProps {
  brands: Brand[]
  loading: boolean
  error: string | null
  onCreate: (data: CreateBrandDTO) => Promise<void>
  onUpdate: (id: string, data: UpdateBrandDTO) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function BrandsTable({ brands, loading, error, onCreate, onUpdate, onDelete }: BrandsTableProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
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

  const handleCreate = async (data: CreateBrandDTO) => {
    await onCreate(data)
    setShowForm(false)
  }

  const handleUpdate = async (data: UpdateBrandDTO) => {
    if (!editingBrand) return
    await onUpdate(editingBrand.id, data)
    setEditingBrand(null)
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error) {
    return <p className="text-[--color-danger] text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => { setShowForm(true); setEditingBrand(null) }}>
          + Nueva marca
        </Button>
      </div>

      {(showForm || editingBrand) && (
        <div className="mb-6 p-4 rounded-xl border border-[#1e1e2e] bg-[#0f0f17]">
          <h3 className="text-sm font-medium text-[#f8fafc] mb-3">
            {editingBrand ? 'Editar marca' : 'Nueva marca'}
          </h3>
          <BrandForm
            defaultName={editingBrand?.name}
            onSubmit={editingBrand ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditingBrand(null) }}
          />
        </div>
      )}

      {brands.length === 0 ? (
        <p className="text-center text-[#94a3b8] py-8">No hay marcas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
                <th className="py-3 px-4 font-medium">Nombre</th>
                <th className="py-3 px-4 font-medium">Slug</th>
                <th className="py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                  <td className="py-3 px-4 text-[#f8fafc] font-medium">{brand.name}</td>
                  <td className="py-3 px-4 text-[#94a3b8]">{brand.slug}</td>
                  <td className="py-3 px-4">
                    {confirmId === brand.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#94a3b8]">¿Eliminar?</span>
                        <Button size="sm" variant="danger" loading={deletingId === brand.id} onClick={() => handleDelete(brand.id)}>
                          Sí
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          No
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={() => { setEditingBrand(brand); setShowForm(false) }}>
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(brand.id)}>
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

export { BrandsTable }
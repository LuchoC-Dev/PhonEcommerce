'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import type { Category } from '@features/catalog/types/catalog.types'

interface CategoryFormProps {
  defaultName?: string
  defaultParentId?: string | null
  parentCategories: Category[]
  onSubmit: (data: { name: string; parentId?: string | null }) => Promise<void>
  onCancel: () => void
}

function CategoryForm({ defaultName, defaultParentId, parentCategories, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(defaultName ?? '')
  const [parentId, setParentId] = useState<string | null>(defaultParentId ?? null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim(), parentId: parentId || null })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nombre de la categoría"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(null) }}
        error={error ?? undefined}
      />
      <Select
        label="Categoría padre (opcional)"
        value={parentId ?? ''}
        onChange={(e) => setParentId(e.target.value || null)}
      >
        <option value="">Ninguna (categoría raíz)</option>
        {parentCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>
      <div className="flex gap-3">
        <Button type="submit" size="sm" loading={submitting}>
          {defaultName ? 'Guardar' : 'Crear'}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export { CategoryForm }
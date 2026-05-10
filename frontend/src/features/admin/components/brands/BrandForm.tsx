'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'

interface BrandFormProps {
  defaultName?: string
  onSubmit: (data: { name: string }) => Promise<void>
  onCancel: () => void
}

function BrandForm({ defaultName, onSubmit, onCancel }: BrandFormProps) {
  const [name, setName] = useState(defaultName ?? '')
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
      await onSubmit({ name: name.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          placeholder="Nombre de la marca"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(null) }}
          error={error ?? undefined}
        />
      </div>
      <Button type="submit" size="sm" loading={submitting}>
        {defaultName ? 'Guardar' : 'Crear'}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
        Cancelar
      </Button>
    </form>
  )
}

export { BrandForm }
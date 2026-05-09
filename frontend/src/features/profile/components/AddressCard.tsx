'use client'

import { useState } from 'react'
import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import type { Address } from '../types/profile.types'

interface AddressCardProps {
  address: Address
  onEdit: () => void
  onDelete: () => Promise<unknown>
}

export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete()
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="bg-[--color-surface] border border-[--color-border] rounded-[--radius-lg] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-[--color-text]">{address.street}</p>
            {address.isDefault && (
              <Badge variant="primary">Predeterminada</Badge>
            )}
          </div>
          <p className="text-sm text-[--color-text-muted]">
            {[address.city, address.state, address.country].filter(Boolean).join(', ')}
          </p>
          {address.zipCode && (
            <p className="text-xs text-[--color-text-subtle]">CP: {address.zipCode}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={showConfirm}
          >
            Eliminar
          </Button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-4 pt-4 border-t border-[--color-border] flex items-center gap-3">
          <span className="text-sm text-[--color-text-muted]">
            ¿Seguro que querés eliminar esta dirección?
          </span>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>
            Sí
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={deleting}
          >
            No
          </Button>
        </div>
      )}
    </div>
  )
}

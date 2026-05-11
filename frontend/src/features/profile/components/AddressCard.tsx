'use client'

import { useState } from 'react'
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
    <div className="bg-[#0d0d14]/50 border border-[#1e1e2e] rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-[#f8fafc]">{address.street}</p>
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#4f46e5]/40 bg-[#312e81]/40 px-2.5 py-0.5 text-xs font-medium text-[#818cf8]">
                Predeterminada
              </span>
            )}
          </div>
          <p className="text-sm text-[#94a3b8]">
            {[address.city, address.state, address.country].filter(Boolean).join(', ')}
          </p>
          {address.zipCode && (
            <p className="text-xs text-[#64748b]">CP: {address.zipCode}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="p-2 rounded-lg text-[#94a3b8] hover:bg-[#1e1e2e] hover:text-[#f8fafc] transition-colors duration-150 cursor-pointer"
            aria-label="Editar dirección"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            disabled={showConfirm}
            className="p-2 rounded-lg text-[#94a3b8] hover:bg-[#f87171]/10 hover:text-[#f87171] transition-colors duration-150 disabled:opacity-40 cursor-pointer"
            aria-label="Eliminar dirección"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-4 pt-4 border-t border-[#1e1e2e] flex items-center gap-3">
          <span className="text-sm text-[#94a3b8]">
            ¿Seguro que querés eliminar esta dirección?
          </span>
          <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete} className="!font-sans text-sm font-medium rounded-lg">
            Sí
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(false)}
            disabled={deleting}
            className="!font-sans text-sm font-medium text-[#94a3b8] hover:bg-[#1e1e2e] hover:text-[#f8fafc] rounded-lg"
          >
            No
          </Button>
        </div>
      )}
    </div>
  )
}
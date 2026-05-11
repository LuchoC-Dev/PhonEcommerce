'use client'

import { Button } from '@shared/components/Button'
import type { CheckoutPreview } from '../types/orders.types'

interface Props {
  preview: CheckoutPreview
  onConfirm: () => void
  onBack: () => void
  isLoading: boolean
  error: string | null
}

export function OrderPreviewStep({ preview, onConfirm, onBack, isLoading, error }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {preview.items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between gap-4 p-4 rounded-[--radius-lg] bg-card border border-border"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-sm font-medium text-text truncate font-[--font-display]">
                {item.productName}
              </p>
              <p className="text-xs text-text-muted">
                x{item.quantity} · ${item.unitPrice.toLocaleString('es-AR')} c/u
              </p>
            </div>
            <p className="text-sm font-semibold text-text font-[--font-display] flex-shrink-0">
              ${item.subtotal.toLocaleString('es-AR')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4 rounded-[--radius-lg] bg-surface border border-border">
        <div className="flex justify-between text-base font-semibold text-text font-[--font-display]">
          <span>Total</span>
          <span>${preview.totalAmount.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div className="p-4 rounded-[--radius-lg] bg-surface border border-border">
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Envío a</p>
        <p className="text-sm text-text">{preview.shipping.name}</p>
        <p className="text-sm text-text-muted">
          {preview.shipping.address}, {preview.shipping.city}
          {preview.shipping.state ? `, ${preview.shipping.state}` : ''} {preview.shipping.zipCode}
        </p>
        {preview.shipping.phone && (
          <p className="text-sm text-text-muted">{preview.shipping.phone}</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-danger" role="alert">{error}</p>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack} disabled={isLoading} className="flex-1">
          Volver
        </Button>
        <Button onClick={onConfirm} loading={isLoading} size="lg" className="flex-1">
          Confirmar pedido
        </Button>
      </div>
    </div>
  )
}

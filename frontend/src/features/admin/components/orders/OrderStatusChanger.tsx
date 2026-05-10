'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { Textarea } from '@shared/components/Textarea'
import { OrderStatusBadge } from '@features/orders/components/OrderStatusBadge'
import type { OrderStatus } from '@features/orders/types/orders.types'
import type { UpdateOrderStatusDTO } from '@features/admin/types/admin.types'

type TransitionMap = Record<OrderStatus, OrderStatus[]>

const VALID_TRANSITIONS: TransitionMap = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

interface OrderStatusChangerProps {
  currentStatus: OrderStatus
  onUpdate: (data: UpdateOrderStatusDTO) => Promise<void>
}

function OrderStatusChanger({ currentStatus, onUpdate }: OrderStatusChangerProps) {
  const availableTransitions = VALID_TRANSITIONS[currentStatus]

  if (availableTransitions.length === 0) {
    return (
      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <h2 className="text-lg font-semibold text-[#f8fafc] mb-3">Gestión de estado</h2>
        <p className="text-[#94a3b8] text-sm">Este pedido se encuentra en un estado terminal y no puede ser modificado.</p>
      </div>
    )
  }

  const transitionOptions = availableTransitions as UpdateOrderStatusDTO['status'][]
  const [selectedStatus, setSelectedStatus] = useState<UpdateOrderStatusDTO['status']>(transitionOptions[0])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const data: UpdateOrderStatusDTO = { status: selectedStatus }
      if (note.trim()) data.note = note.trim()
      await onUpdate(data)
      setSuccess(`Estado actualizado a "${STATUS_LABELS[selectedStatus]}"`)
      setNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
      <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Gestión de estado</h2>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-[#94a3b8]">Estado actual:</span>
        <OrderStatusBadge status={currentStatus} />
      </div>

      <div className="space-y-4">
        <Select
          label="Nuevo estado"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as UpdateOrderStatusDTO['status'])}
        >
          {transitionOptions.map((status) => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </Select>

        <Textarea
          label="Nota (opcional)"
          placeholder="Motivo del cambio de estado..."
          value={note}
          onChange={(e) => setNote((e.target as HTMLTextAreaElement).value)}
          rows={3}
        />

        {error && <p className="text-sm text-[--color-danger]">{error}</p>}
        {success && <p className="text-sm text-[--color-success]">{success}</p>}

        <Button onClick={handleSubmit} loading={loading}>
          Actualizar estado
        </Button>
      </div>
    </div>
  )
}

export { OrderStatusChanger }
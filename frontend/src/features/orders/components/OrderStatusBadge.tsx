import type { OrderStatus } from '../types/orders.types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; border: string; text: string }> = {
  PENDING:   { label: 'Pendiente',  bg: 'bg-warning-muted/50', border: 'border-warning/40', text: 'text-amber-400' },
  CONFIRMED: { label: 'Confirmado', bg: 'bg-primary-muted/40', border: 'border-primary/40', text: 'text-primary-light' },
  SHIPPED:   { label: 'Enviado',    bg: 'bg-info-muted/50', border: 'border-info/40', text: 'text-info' },
  DELIVERED: { label: 'Entregado',  bg: 'bg-success-muted/50', border: 'border-success/40', text: 'text-success' },
  CANCELLED: { label: 'Cancelado', bg: 'bg-danger-muted/50', border: 'border-danger/40', text: 'text-danger' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, bg, border, text } = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${border} ${text}`}>
      {label}
    </span>
  )
}
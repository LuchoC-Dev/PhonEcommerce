import type { OrderStatus } from '../types/orders.types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; border: string; text: string }> = {
  PENDING:   { label: 'Pendiente',  bg: 'bg-[#451a03]/50', border: 'border-[#f59e0b]/40', text: 'text-[#fbbf24]' },
  CONFIRMED: { label: 'Confirmado', bg: 'bg-primary-muted/40', border: 'border-primary/40', text: 'text-primary-light' },
  SHIPPED:   { label: 'Enviado',    bg: 'bg-[#083344]/50', border: 'border-[#06b6d4]/40', text: 'text-[#22d3ee]' },
  DELIVERED: { label: 'Entregado',  bg: 'bg-[#14532d]/50', border: 'border-[#22c55e]/40', text: 'text-[#4ade80]' },
  CANCELLED: { label: 'Cancelado', bg: 'bg-transparent', border: 'border-0', text: 'text-[#f87171]' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, bg, border, text } = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${bg} ${border} ${text}`}>
      {label}
    </span>
  )
}
import { Badge } from '@shared/components/Badge'
import type { OrderStatus } from '../types/orders.types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'warning' | 'primary' | 'info' | 'success' | 'danger' }> = {
  PENDING:   { label: 'Pendiente',  variant: 'warning' },
  CONFIRMED: { label: 'Confirmado', variant: 'primary' },
  SHIPPED:   { label: 'Enviado',    variant: 'info' },
  DELIVERED: { label: 'Entregado',  variant: 'success' },
  CANCELLED: { label: 'Cancelado',  variant: 'danger' },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, variant } = STATUS_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}

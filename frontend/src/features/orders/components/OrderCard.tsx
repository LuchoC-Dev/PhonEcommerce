import Link from 'next/link'
import { OrderStatusBadge } from './OrderStatusBadge'
import type { Order } from '../types/orders.types'

export function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card/50 border border-border hover:border-primary transition-colors duration-150"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs text-text-subtle font-mono truncate">#{order.id.slice(-8).toUpperCase()}</p>
        <p className="text-sm text-text truncate">{order.shippingName}</p>
        <p className="text-xs text-text-muted">{date}</p>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <OrderStatusBadge status={order.status} />
        <p className="text-sm font-semibold text-text">
          ${order.totalAmount.toLocaleString('es-AR')}
        </p>
      </div>
    </Link>
  )
}
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
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0d0d14]/50 border border-[#1e1e2e] hover:border-[#6366f1] transition-colors duration-150"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-xs text-[#64748b] font-mono truncate">#{order.id.slice(-8).toUpperCase()}</p>
        <p className="text-sm text-[#dde4ed] truncate">{order.shippingName}</p>
        <p className="text-xs text-[#94a3b8]">{date}</p>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <OrderStatusBadge status={order.status} />
        <p className="text-sm font-semibold text-[#f8fafc]">
          ${order.totalAmount.toLocaleString('es-AR')}
        </p>
      </div>
    </Link>
  )
}
'use client'

import Link from 'next/link'
import type { OrderWithDetails } from '../types/orders.types'

export function OrderSuccessStep({ order }: { order: OrderWithDetails }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="w-20 h-20 rounded-full bg-success-muted flex items-center justify-center">
        <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-text font-display">¡Pedido confirmado!</h2>
        <p className="text-text-muted text-sm">
          Tu pedido fue procesado exitosamente.
        </p>
        <p className="text-xs text-text-subtle mt-1 font-mono">
          ID: {order.id}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center justify-center h-12 px-6 text-base gap-2.5 rounded-lg bg-primary text-white hover:bg-primary-hover font-display font-medium transition-all duration-150"
        >
          Ver mi pedido
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-md bg-transparent text-text-muted hover:text-text hover:bg-surface font-display font-medium transition-all duration-150"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}

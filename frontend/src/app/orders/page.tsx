'use client'

import Link from 'next/link'
import { withAuth } from '@shared/components/withAuth'
import { Spinner } from '@shared/components/Spinner'

import { useOrders } from '@features/orders/hooks/useOrders'
import { OrderCard } from '@features/orders/components/OrderCard'

function OrdersPage() {
  const { orders, isLoading, error } = useOrders()

  return (
    <div className="min-h-screen bg-[--color-bg] py-12 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[--color-text] font-[--font-display]">Mis pedidos</h1>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-8 px-3 text-sm gap-1.5 rounded-[--radius-sm] bg-[--color-card] text-[--color-text] border border-[--color-border] hover:border-[--color-primary] hover:text-[--color-primary-light] font-[--font-display] font-medium transition-all duration-150"
          >
            Seguir comprando
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-[--radius-lg] bg-[--color-danger-muted] border border-[--color-danger] text-[--color-danger] text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[--color-surface] flex items-center justify-center">
              <svg className="w-8 h-8 text-[--color-text-subtle]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
              </svg>
            </div>
            <p className="text-[--color-text-muted] text-sm">Todavía no tenés pedidos.</p>
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-[--radius-md] bg-[--color-primary] text-white hover:bg-[--color-primary-hover] font-[--font-display] font-medium transition-all duration-150"
            >
              Ver productos
            </Link>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(OrdersPage)

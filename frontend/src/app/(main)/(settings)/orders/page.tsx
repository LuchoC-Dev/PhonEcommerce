'use client'

import Link from 'next/link'
import { withAuth } from '@shared/components/withAuth'
import { Spinner } from '@shared/components/Spinner'

import { useOrders } from '@features/orders/hooks/useOrders'
import { OrderCard } from '@features/orders/components/OrderCard'

function OrdersPage() {
  const { orders, isLoading, error } = useOrders()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[--color-text] font-[--font-display]">Mis pedidos</h1>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center h-8 px-3 text-sm gap-1.5 rounded-lg bg-transparent text-white hover:bg-[#1e1e2e] hover:text-[#f8fafc] !font-sans font-medium transition-all duration-150"
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
        <div className="p-4 rounded-xl bg-[#450a0a]/40 border border-[#f87171]/30 text-[#f87171] text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#0d0d14]/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
            </svg>
          </div>
          <p className="text-[#94a3b8] text-sm">Todavía no tenés pedidos.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-lg bg-[#1e1e2e] text-white hover:bg-[#312e81]/60 font-medium transition-all duration-150"
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
  )
}

export default withAuth(OrdersPage)
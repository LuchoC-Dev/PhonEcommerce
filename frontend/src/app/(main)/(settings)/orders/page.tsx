'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { withAuth } from '@shared/components/withAuth'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'

import { useOrders } from '@features/orders/hooks/useOrders'
import { OrderCard } from '@features/orders/components/OrderCard'

function OrdersPage() {
  const { orders, isLoading, error } = useOrders()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text font-display">Mis pedidos</h1>
        <Button variant="subtle" size="sm" onClick={() => router.push('/catalog')}>
          Seguir comprando
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-danger-muted/40 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-card/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7m16 0l-8 4-8-4" />
            </svg>
          </div>
          <p className="text-text-muted text-sm">Todavía no tenés pedidos.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-lg bg-border text-text hover:bg-primary-muted/60 font-medium transition-all duration-150"
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
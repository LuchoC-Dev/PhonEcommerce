'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { withAuth } from '@shared/components/withAuth'
import { Spinner } from '@shared/components/Spinner'
import { Button } from '@shared/components/Button'
import { useOrder } from '@features/orders/hooks/useOrder'
import { OrderStatusBadge } from '@features/orders/components/OrderStatusBadge'

interface Props {
  params: Promise<{ id: string }>
}

function OrderDetailPage({ params }: Props) {
  const { id } = use(params)
  const { order, isLoading, error, cancelOrder, isCancelling, cancelError } = useOrder(id)
  const [confirming, setConfirming] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-danger text-sm">{error ?? 'Orden no encontrada.'}</p>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-lg bg-transparent text-text-muted hover:bg-border hover:text-text font-medium transition-all duration-150"
        >
          Volver a mis pedidos
        </Link>
      </div>
    )
  }

  const date = new Date(order.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm text-text-muted hover:text-text -ml-2 mb-1 px-2 py-1 rounded-lg hover:bg-border transition-colors duration-150 w-fit"
          >
            ← Mis pedidos
          </Link>
          <h1 className="text-xl font-bold text-text font-display">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-text-muted">{date}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide">Productos</h2>
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card/50 border border-border"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-xs text-text-subtle font-mono truncate">{item.productId}</p>
              <p className="text-sm text-text-muted">
                x{item.quantity} · ${item.unitPrice.toLocaleString('es-AR')} c/u
              </p>
            </div>
            <p className="text-sm font-semibold text-text flex-shrink-0">
              ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4 rounded-xl bg-card/50 border border-border">
        <div className="flex justify-between text-base font-semibold text-text">
          <span>Total</span>
          <span>${order.totalAmount.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card/50 border border-border">
        <p className="text-xs font-medium text-text-muted mb-3 uppercase tracking-wide">Datos de envío</p>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-text font-medium">{order.shippingName}</p>
          {order.shippingPhone && (
            <p className="text-sm text-text-muted">{order.shippingPhone}</p>
          )}
          <p className="text-sm text-text-muted">
            {order.shippingAddress}, {order.shippingCity}
            {order.shippingState ? `, ${order.shippingState}` : ''} {order.shippingZipCode}
          </p>
          <p className="text-sm text-text-muted">{order.shippingCountry}</p>
        </div>
      </div>

      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
        <div className="flex flex-col gap-3 items-start">
          {!confirming ? (
            <Button variant="danger" size="sm" font="body" onClick={() => setConfirming(true)}>
              Cancelar pedido
            </Button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-muted">¿Estás seguro?</p>
              <div className="flex items-center gap-3">
                <Button variant="danger" size="sm" font="body" onClick={() => cancelOrder().then(() => setConfirming(false))} loading={isCancelling}>
                  Sí, cancelar
                </Button>
                <Button variant="subtle" size="sm" onClick={() => setConfirming(false)} disabled={isCancelling}>
                  No
                </Button>
              </div>
            </div>
          )}
          {cancelError && (
            <p className="text-xs text-danger">{cancelError}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default withAuth(OrderDetailPage)

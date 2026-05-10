'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { withAuth } from '@shared/components/withAuth'
import { Spinner } from '@shared/components/Spinner'
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
      <div className="min-h-screen bg-[--color-bg] py-12 px-4 flex flex-col items-center gap-4">
        <p className="text-[--color-danger] text-sm">{error ?? 'Orden no encontrada.'}</p>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center h-10 px-4 text-sm gap-2 rounded-[--radius-md] bg-[--color-card] text-[--color-text] border border-[--color-border] hover:border-[--color-primary] hover:text-[--color-primary-light] font-[--font-display] font-medium transition-all duration-150"
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
    <div className="min-h-screen bg-[--color-bg] py-12 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Link
              href="/orders"
              className="inline-flex items-center text-sm text-[--color-text-muted] hover:text-[--color-text] -ml-2 mb-1 px-2 py-1 rounded-[--radius-sm] hover:bg-[--color-surface] transition-colors duration-150 font-[--font-body] w-fit"
            >
              ← Mis pedidos
            </Link>
            <h1 className="text-xl font-bold text-[--color-text] font-[--font-display]">
              Pedido #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-[--color-text-muted]">{date}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-[--color-text-muted] uppercase tracking-wide">Productos</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-4 rounded-[--radius-lg] bg-[--color-card] border border-[--color-border]"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-xs text-[--color-text-subtle] font-mono truncate">{item.productId}</p>
                <p className="text-sm text-[--color-text-muted]">
                  x{item.quantity} · ${item.unitPrice.toLocaleString('es-AR')} c/u
                </p>
              </div>
              <p className="text-sm font-semibold text-[--color-text] font-[--font-display] flex-shrink-0">
                ${(item.unitPrice * item.quantity).toLocaleString('es-AR')}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 p-4 rounded-[--radius-lg] bg-[--color-surface] border border-[--color-border]">
          <div className="flex justify-between text-base font-semibold text-[--color-text] font-[--font-display]">
            <span>Total</span>
            <span>${order.totalAmount.toLocaleString('es-AR')}</span>
          </div>
        </div>

        <div className="p-4 rounded-[--radius-lg] bg-[--color-card] border border-[--color-border]">
          <p className="text-xs font-medium text-[--color-text-muted] mb-3 uppercase tracking-wide">Datos de envío</p>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-[--color-text] font-medium">{order.shippingName}</p>
            {order.shippingPhone && (
              <p className="text-sm text-[--color-text-muted]">{order.shippingPhone}</p>
            )}
            <p className="text-sm text-[--color-text-muted]">
              {order.shippingAddress}, {order.shippingCity}
              {order.shippingState ? `, ${order.shippingState}` : ''} {order.shippingZipCode}
            </p>
            <p className="text-sm text-[--color-text-muted]">{order.shippingCountry}</p>
          </div>
        </div>

        {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
          <div className="flex flex-col gap-3 items-start">
            {!confirming ? (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="border border-red-500 text-red-400 hover:bg-red-500/10 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Cancelar pedido
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-[--color-text-muted]">¿Estás seguro?</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => cancelOrder().then(() => setConfirming(false))}
                    disabled={isCancelling}
                    className="rounded-xl px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    {isCancelling && <Spinner size="sm" />}
                    Sí, cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    disabled={isCancelling}
                    className="rounded-xl px-4 py-2 text-sm font-medium border border-[--color-border] text-[--color-text-muted] hover:bg-[--color-surface] transition-colors disabled:opacity-60"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
            {cancelError && (
              <p className="text-xs text-red-400">{cancelError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default withAuth(OrderDetailPage)

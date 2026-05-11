'use client'

import { use, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { withAdmin } from '@shared/components/withAdmin'
import { Spinner } from '@shared/components/Spinner'
import { OrderStatusBadge } from '@features/orders/components/OrderStatusBadge'
import { OrderStatusChanger } from '@features/admin/components/orders/OrderStatusChanger'
import { adminService } from '@features/admin/services/admin.service'
import type { OrderWithDetails } from '@features/orders/types/orders.types'
import type { UpdateOrderStatusDTO } from '@features/admin/types/admin.types'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

function shortId(id: string) {
  return id.slice(-8).toUpperCase()
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}

function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getOrderById(id)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la orden')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleStatusUpdate = async (data: UpdateOrderStatusDTO) => {
    await adminService.updateOrderStatus(id, data)
    await fetchOrder()
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error && !order) {
    return (
      <div className="p-8">
        <p className="text-danger text-center py-8">{error}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-[#94a3b8] text-center py-8">No se encontró la orden</p>
      </div>
    )
  }

  const fullAddress = [
    order.shippingAddress,
    order.shippingCity,
    order.shippingState,
    order.shippingCountry,
    order.shippingZipCode,
  ].filter(Boolean).join(', ')

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-sm text-[#818cf8] hover:text-[#6366f1] transition-colors mb-2 inline-block"
        >
          ← Volver a órdenes
        </Link>
        <div className="flex items-center gap-4 mt-2">
          <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">
            Pedido #{shortId(order.id)}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-[#94a3b8] mt-1">Creado el {formatDate(order.createdAt)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
            <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Productos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
                    <th className="py-3 px-4 font-medium">Producto</th>
                    <th className="py-3 px-4 font-medium text-right">Cantidad</th>
                    <th className="py-3 px-4 font-medium text-right">Precio unit.</th>
                    <th className="py-3 px-4 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-[#1e1e2e]/50">
                      <td className="py-3 px-4 text-[#f8fafc] font-mono text-xs">{item.productId}</td>
                      <td className="py-3 px-4 text-[#f8fafc] text-right">{item.quantity}</td>
                      <td className="py-3 px-4 text-[#94a3b8] text-right">{formatPrice(item.unitPrice)}</td>
                      <td className="py-3 px-4 text-[#f8fafc] text-right font-medium">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#1e1e2e]">
                    <td colSpan={3} className="py-3 px-4 text-[#f8fafc] font-semibold text-right">Total</td>
                    <td className="py-3 px-4 text-[#818cf8] font-bold text-right">{formatPrice(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
            <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Datos de envío</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-[#94a3b8] w-24">Nombre:</span>
                <span className="text-[#f8fafc]">{order.shippingName}</span>
              </div>
              {order.shippingPhone && (
                <div className="flex gap-2">
                  <span className="text-[#94a3b8] w-24">Teléfono:</span>
                  <span className="text-[#f8fafc]">{order.shippingPhone}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="text-[#94a3b8] w-24">Dirección:</span>
                <span className="text-[#f8fafc]">{fullAddress}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <OrderStatusChanger currentStatus={order.status} onUpdate={handleStatusUpdate} />

          <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
            <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">Historial de estados</h2>
            {order.statusHistory.length === 0 ? (
              <p className="text-[#94a3b8] text-sm">Sin historial registrado</p>
            ) : (
              <div className="space-y-3">
                {order.statusHistory.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-1 pb-3 border-b border-[#1e1e2e]/50 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 text-sm">
                      {entry.fromStatus ? (
                        <>
                          <span className="text-[#94a3b8]">{STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus}</span>
                          <span className="text-[#94a3b8]">→</span>
                          <OrderStatusBadge status={entry.toStatus} />
                        </>
                      ) : (
                        <OrderStatusBadge status={entry.toStatus} />
                      )}
                    </div>
                    {entry.note && (
                      <p className="text-xs text-[#94a3b8] italic">{entry.note}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                      <span>{formatDate(entry.createdAt)}</span>
                      {entry.changedBy && <span>por {entry.changedBy}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAdmin(OrderDetailPage)
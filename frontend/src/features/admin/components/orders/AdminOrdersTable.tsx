'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'
import { Select } from '@shared/components/Select'
import { OrderStatusBadge } from '@features/orders/components/OrderStatusBadge'
import type { Order, OrderStatus } from '@features/orders/types/orders.types'

interface AdminOrdersTableProps {
  orders: Order[]
  loading: boolean
  error: string | null
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

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

function AdminOrdersTable({ orders, loading, error, page, totalPages, total, onPageChange }: AdminOrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === (statusFilter as OrderStatus))
    : orders

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (error) {
    return <p className="text-[--color-danger] text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
          className="w-48"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        <p className="text-sm text-[#94a3b8]">
          {filteredOrders.length} orden{filteredOrders.length !== 1 ? 'es' : ''} {statusFilter ? 'filtrada' + (filteredOrders.length !== 1 ? 's' : '') : 'en total'} de {total}
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#94a3b8]">No hay órdenes{statusFilter ? ' con ese estado' : ''}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
                <th className="py-3 px-4 font-medium">ID</th>
                <th className="py-3 px-4 font-medium">Cliente</th>
                <th className="py-3 px-4 font-medium">Total</th>
                <th className="py-3 px-4 font-medium">Estado</th>
                <th className="py-3 px-4 font-medium">Fecha</th>
                <th className="py-3 px-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                  <td className="py-3 px-4 text-[#f8fafc] font-mono font-medium">{shortId(order.id)}</td>
                  <td className="py-3 px-4 text-[#94a3b8]">{order.shippingName || order.accountId}</td>
                  <td className="py-3 px-4 text-[#f8fafc]">{formatPrice(order.totalAmount)}</td>
                  <td className="py-3 px-4"><OrderStatusBadge status={order.status} /></td>
                  <td className="py-3 px-4 text-[#94a3b8]">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button size="sm" variant="secondary">Ver detalle</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e1e2e]">
        <p className="text-sm text-[#94a3b8]">{total} orden{total !== 1 ? 'es' : ''}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </Button>
          <span className="flex items-center px-3 text-sm text-[#94a3b8]">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente →
          </Button>
        </div>
      </div>
    </div>
  )
}

export { AdminOrdersTable }
'use client'

import { withAdmin } from '@shared/components/withAdmin'
import { useAdminOrders } from '@features/admin/hooks/useAdminOrders'
import { AdminOrdersTable } from '@features/admin/components/orders/AdminOrdersTable'

function OrdersPage() {
  const { orders, totalPages, total, page, loading, error, fetchOrders, setPage } = useAdminOrders()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchOrders(newPage)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Órdenes</h1>
        <p className="text-[#94a3b8] mt-1">Gestioná los pedidos del e-commerce</p>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6">
        <AdminOrdersTable
          orders={orders}
          loading={loading}
          error={error}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default withAdmin(OrdersPage)
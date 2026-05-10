'use client'

import { withAdmin } from '@shared/components/withAdmin'
import { StatCard } from '@features/admin/components/StatCard'

const stats = [
  { icon: '📦', title: 'Productos', value: '—', href: '/admin/products' },
  { icon: '🏷️', title: 'Marcas', value: '—', href: '/admin/brands' },
  { icon: '🗂️', title: 'Categorías', value: '—', href: '/admin/categories' },
  { icon: '🛒', title: 'Órdenes', value: '—', href: '/admin/orders' },
]

function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">Dashboard</h1>
        <p className="text-[#94a3b8] mt-1">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            href={stat.href}
          />
        ))}
      </div>
    </div>
  )
}

export default withAdmin(DashboardPage)
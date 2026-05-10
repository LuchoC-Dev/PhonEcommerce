import Link from 'next/link'
import type { StatCardProps } from '../types/admin.types'

function StatCard({ icon, title, value, href }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#1e1e2e] bg-[#0f0f17] p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      <div className="flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-[#94a3b8]">{title}</h3>
        <p className="text-3xl font-bold text-[#f8fafc] font-[--font-display]">{value}</p>
      </div>
      <Link
        href={href}
        className="text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors mt-auto"
      >
        Ver todos →
      </Link>
    </div>
  )
}

export { StatCard }
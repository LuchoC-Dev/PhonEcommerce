'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/products', label: 'Productos', icon: '📦' },
  { href: '/admin/brands', label: 'Marcas', icon: '🏷️' },
  { href: '/admin/categories', label: 'Categorías', icon: '🗂️' },
  { href: '/admin/stock', label: 'Stock', icon: '📋' },
  { href: '/admin/orders', label: 'Órdenes', icon: '🛒' },
]

function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col border-r border-[#1e1e2e] bg-[#13131f] z-50">
      <div className="p-6 border-b border-[#1e1e2e]">
        <Link
          href="/admin"
          className="font-[--font-display] text-lg font-bold text-[#f8fafc] hover:text-[#818cf8] transition-colors"
        >
          📱 ImNotPhound Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link.href, link.exact)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[#312e81] text-white'
                  : 'text-[#94a3b8] hover:bg-[#1e1e2e] hover:text-[#f8fafc]',
              ].join(' ')}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[#1e1e2e]">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-[#94a3b8] hover:bg-[#1e1e2e] hover:text-[#f8fafc] transition-all duration-150"
        >
          <span>←</span>
          Volver al sitio
        </Link>
      </div>
    </aside>
  )
}

export { AdminSidebar }
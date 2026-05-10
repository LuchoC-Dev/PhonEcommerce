import { AdminSidebar } from '@features/admin/components/AdminSidebar'
import { AdminAuthGuard } from '@features/admin/components/AdminAuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 ml-60">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  )
}

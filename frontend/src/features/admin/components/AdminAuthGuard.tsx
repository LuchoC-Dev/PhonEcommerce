'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@features/auth/store/auth.store'

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace('/login')
    } else if (user?.role !== 'ADMIN') {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return null
  }

  return <>{children}</>
}

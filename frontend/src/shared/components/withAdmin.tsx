'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@features/auth/store/auth.store'
import { Spinner } from './Spinner'

export function withAdmin<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedAdminPage(props: P) {
    const router = useRouter()
    const { user, isAuthenticated, isLoading } = useAuthStore()

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.replace('/login')
        } else if (user?.role !== 'ADMIN') {
          router.replace('/unauthorized')
        }
      }
    }, [isAuthenticated, isLoading, user, router])

    const canRender = !isLoading && isAuthenticated && user?.role === 'ADMIN'

    if (!canRender) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      )
    }

    return <Component {...props} />
  }
}
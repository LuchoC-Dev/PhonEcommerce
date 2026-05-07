'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@features/auth/store/auth.store'
import { Spinner } from './Spinner'

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedPage(props: P) {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuthStore()

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace('/login')
      }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      )
    }

    if (!isAuthenticated) return null

    return <Component {...props} />
  }
}

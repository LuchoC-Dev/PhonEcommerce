import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from '@features/auth/components/ResetPasswordForm'
import { PageSpinner } from '@shared/components/Spinner'

export const metadata: Metadata = {
  title: 'Nueva contraseña — ImNotPhound',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold font-[--font-display] text-text mb-1">
            Nueva contraseña
          </h1>
          <p className="text-sm text-text-muted">
            Elegí una contraseña segura para tu cuenta
          </p>
        </div>

        <div className="bg-card border border-border rounded-[--radius-xl] p-8 shadow-[--shadow-md]">
          <Suspense fallback={<PageSpinner />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

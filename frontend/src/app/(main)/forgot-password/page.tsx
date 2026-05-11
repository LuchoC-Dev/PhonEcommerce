import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@features/auth/components/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Recuperar contraseña — ImNotPhound',
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold font-[--font-display] text-text mb-1">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-text-muted">
            Te enviamos un enlace para que puedas resetearla
          </p>
        </div>

        <div className="bg-card border border-border rounded-[--radius-xl] p-8 shadow-[--shadow-md]">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

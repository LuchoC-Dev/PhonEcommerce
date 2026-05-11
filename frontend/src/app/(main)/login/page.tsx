import type { Metadata } from 'next'
import { LoginForm } from '@features/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión — ImNotPhound',
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold font-[--font-display] text-text mb-1">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm text-text-muted">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        <div className="bg-card border border-border rounded-[--radius-xl] p-8 shadow-[--shadow-md]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

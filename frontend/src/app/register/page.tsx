import type { Metadata } from 'next'
import { RegisterForm } from '@features/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear cuenta — ImNotPhound',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold font-[--font-display] text-[--color-text] mb-1">
            Creá tu cuenta
          </h1>
          <p className="text-sm text-[--color-text-muted]">
            Empezá a explorar los mejores teléfonos
          </p>
        </div>

        <div className="bg-[--color-card] border border-[--color-border] rounded-[--radius-xl] p-8 shadow-[--shadow-md]">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

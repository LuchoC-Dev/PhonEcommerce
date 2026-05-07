'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { authService } from '../services/auth.service'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
    } catch {
      setError('No pudimos procesar tu solicitud. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="text-4xl">📬</div>
        <p className="text-[--color-text]">
          Si existe una cuenta con <span className="text-[--color-primary-light] font-medium">{email}</span>,
          recibirás un correo con las instrucciones.
        </p>
        <Link href="/login" className="text-sm text-[--color-primary-light] hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        hint="Te enviaremos un enlace para restablecer tu contraseña."
      />

      {error && (
        <p className="text-sm text-[--color-danger] bg-[--color-danger-muted] px-3 py-2 rounded-[--radius-md]">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Enviar instrucciones
      </Button>

      <p className="text-center text-sm text-[--color-text-muted]">
        <Link href="/login" className="text-[--color-primary-light] hover:underline">
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { authService } from '../services/auth.service'

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-danger">Enlace inválido o expirado.</p>
        <Link href="/forgot-password" className="text-sm text-primary-light hover:underline">
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  function validate(): boolean {
    const next: typeof errors = {}
    if (password.length < 8) next.password = 'Mínimo 8 caracteres'
    if (password !== confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setServerError('')
    setLoading(true)
    try {
      await authService.resetPassword({ token, password })
      router.push('/login?reset=success')
    } catch {
      setServerError('El enlace expiró o es inválido. Solicitá uno nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Nueva contraseña"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        hint="Mínimo 8 caracteres"
        error={errors.password}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      {serverError && (
        <p className="text-sm text-danger bg-danger-muted px-3 py-2 rounded-[--radius-md]">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Restablecer contraseña
      </Button>
    </form>
  )
}

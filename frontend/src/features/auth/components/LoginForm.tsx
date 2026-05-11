'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { useAuth } from '../hooks/useAuth'
import type { LoginPayload } from '../types/auth.types'

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [values, setValues] = useState<LoginPayload>({ emailOrUsername: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(values)
      router.push('/')
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Credenciales incorrectas. Intentá de nuevo.'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email o usuario"
        placeholder="tu@email.com o tuusuario"
        value={values.emailOrUsername}
        onChange={(e) => setValues((v) => ({ ...v, emailOrUsername: e.target.value }))}
        required
        autoComplete="username"
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        value={values.password}
        onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-danger bg-danger-muted px-3 py-2 rounded-[--radius-md]">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-text-muted">
        <Link href="/forgot-password" className="text-primary-light hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="text-center text-sm text-text-muted">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-primary-light hover:underline font-medium">
          Registrate
        </Link>
      </p>
    </form>
  )
}

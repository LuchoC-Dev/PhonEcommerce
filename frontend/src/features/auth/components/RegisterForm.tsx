'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { useAuth } from '../hooks/useAuth'
import type { RegisterPayload } from '../types/auth.types'

interface FormState extends RegisterPayload {
  confirmPassword: string
}

export function RegisterForm() {
  const { register } = useAuth()
  const [values, setValues] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!values.name.trim()) next.name = 'El nombre es requerido'
    if (!values.email.includes('@')) next.email = 'Email inválido'
    if (values.password.length < 8) next.password = 'Mínimo 8 caracteres'
    if (values.password !== values.confirmPassword) next.confirmPassword = 'Las contraseñas no coinciden'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setServerError('')
    setLoading(true)
    try {
      await register({ name: values.name, email: values.email, password: values.password })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse. Intentá de nuevo.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  function field(key: keyof FormState) {
    return {
      value: values[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value })),
      error: errors[key],
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input label="Nombre" placeholder="Juan García" autoComplete="name" required {...field('name')} />
      <Input label="Email" type="email" placeholder="tu@email.com" autoComplete="email" required {...field('email')} />
      <Input label="Contraseña" type="password" placeholder="••••••••" autoComplete="new-password" required hint="Mínimo 8 caracteres" {...field('password')} />
      <Input label="Confirmar contraseña" type="password" placeholder="••••••••" autoComplete="new-password" required {...field('confirmPassword')} />

      {serverError && (
        <p className="text-sm text-[--color-danger] bg-[--color-danger-muted] px-3 py-2 rounded-[--radius-md]">
          {serverError}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-[--color-text-muted]">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-[--color-primary-light] hover:underline font-medium">
          Iniciá sesión
        </Link>
      </p>
    </form>
  )
}

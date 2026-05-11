'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import type { Profile } from '../types/profile.types'

const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  avatar: z.string(),
  phone: z.string(),
  bio: z.string(),
})

interface ProfileFormValues {
  name: string
  avatar: string
  phone: string
  bio: string
}

interface ProfileFormProps {
  profile: Profile | null
  onSave: (payload: ProfileFormValues) => Promise<unknown>
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: profile?.name ?? '',
      avatar: profile?.avatar ?? '',
      phone: profile?.phone ?? '',
      bio: profile?.bio ?? '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setFeedback(null)
    try {
      await onSave(data)
      setFeedback({ type: 'success', message: 'Perfil actualizado correctamente' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar los cambios'
      setFeedback({ type: 'error', message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nombre"
        placeholder="Juan García"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Avatar URL"
        placeholder="https://..."
        error={errors.avatar?.message}
        {...register('avatar')}
      />
      <Input
        label="Teléfono"
        placeholder="+54 11 1234-5678"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Textarea
        label="Bio"
        placeholder="Contanos un poco sobre vos..."
        error={errors.bio?.message}
        {...register('bio')}
      />

      <div className="flex items-center justify-between">
        {feedback && (
          <span
            className={`text-sm px-3 py-2 rounded-md ml-2 ${
              feedback.type === 'success'
                ? 'text-[#6dd4c6] bg-[#1a1a2e]/60 border border-[#1e1e2e]'
                : 'text-[#f87171] bg-[#450a0a]/50 border border-[#f87171]/30'
            }`}
          >
            {feedback.message}
          </span>
        )}
        <Button type="submit" loading={isSubmitting} className="ml-auto !font-sans bg-transparent text-white rounded-lg text-sm font-medium hover:bg-[#1e1e2e] hover:text-[#f8fafc]">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

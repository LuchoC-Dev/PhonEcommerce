'use client'

import { useState } from 'react'
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

      {feedback && (
        <p
          className={`text-sm px-3 py-2 rounded-[--radius-md] ${
            feedback.type === 'success'
              ? 'text-[--color-success] bg-[--color-success-muted]'
              : 'text-[--color-danger] bg-[--color-danger-muted]'
          }`}
        >
          {feedback.message}
        </p>
      )}

      <Button type="submit" loading={isSubmitting} className="self-start">
        Guardar cambios
      </Button>
    </form>
  )
}

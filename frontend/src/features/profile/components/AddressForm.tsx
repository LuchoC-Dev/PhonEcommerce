'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import type { Address } from '../types/profile.types'

const addressSchema = z.object({
  street: z.string().min(1, 'La calle es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string(),
  country: z.string().min(1, 'El país es requerido'),
  zipCode: z.string().min(1, 'El código postal es requerido'),
  isDefault: z.boolean(),
})

export interface AddressFormValues {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
  isDefault: boolean
}

interface AddressFormProps {
  address?: Address
  onSubmit: (data: AddressFormValues) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  title: string
}

export function AddressForm({ address, onSubmit, onCancel, isLoading, title }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    values: address
      ? {
          street: address.street,
          city: address.city,
          state: address.state ?? '',
          country: address.country,
          zipCode: address.zipCode,
          isDefault: address.isDefault,
        }
      : {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          isDefault: false,
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h3 className="font-[--font-display] text-lg font-semibold text-text">
        {title}
      </h3>

      <Input
        label="Calle"
        placeholder="Av. Corrientes 1234"
        error={errors.street?.message}
        {...register('street')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          placeholder="Buenos Aires"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="Provincia / Estado"
          placeholder="CABA"
          error={errors.state?.message}
          {...register('state')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="País"
          placeholder="Argentina"
          error={errors.country?.message}
          {...register('country')}
        />
        <Input
          label="Código postal"
          placeholder="1043"
          error={errors.zipCode?.message}
          {...register('zipCode')}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none group">
        <div className="relative">
          <input
            type="checkbox"
            {...register('isDefault')}
            className="sr-only peer"
          />
          <div className="w-9 h-5 rounded-full bg-border peer-checked:bg-primary/70 transition-colors duration-200" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-text-muted peer-checked:bg-white peer-checked:translate-x-4 transition-all duration-200" />
        </div>
        <span className="text-sm text-text-muted">
          Usar como dirección predeterminada
        </span>
      </label>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="subtle" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" variant="secondary-alt" loading={isLoading}>
          Guardar
        </Button>
      </div>
    </form>
  )
}

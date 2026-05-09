'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { shippingSchema, type ShippingFormValues } from '../lib/shipping.schema'
import type { ShippingAddress } from '../types/orders.types'

interface Props {
  defaultValues?: Partial<ShippingAddress>
  onSubmit: (data: ShippingAddress) => void
  isLoading: boolean
  error: string | null
}

export function ShippingForm({ defaultValues, onSubmit, isLoading, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: defaultValues ?? {},
  })

  function handleValid(data: ShippingFormValues) {
    onSubmit({
      name: data.name,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state || undefined,
      country: data.country,
      zipCode: data.zipCode,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleValid)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre completo"
          placeholder="Juan Pérez"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Teléfono"
          placeholder="+54 11 1234-5678"
          autoComplete="tel"
          inputMode="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <Input
        label="Dirección"
        placeholder="Av. Corrientes 1234, Piso 3"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          placeholder="Buenos Aires"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="Provincia / Estado"
          placeholder="CABA"
          autoComplete="address-level1"
          error={errors.state?.message}
          {...register('state')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Input
            label="País (código ISO)"
            placeholder="AR"
            autoComplete="country"
            hint="2-3 letras en mayúsculas — AR, US, BR, MX…"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>
        <Input
          label="Código postal"
          placeholder="1043"
          autoComplete="postal-code"
          inputMode="numeric"
          error={errors.zipCode?.message}
          {...register('zipCode')}
        />
      </div>

      {error && (
        <p className="text-sm text-[--color-danger]" role="alert">{error}</p>
      )}

      <Button type="submit" loading={isLoading} size="lg" className="mt-2">
        Ver resumen del pedido
      </Button>
    </form>
  )
}

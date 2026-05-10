'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Textarea } from '@shared/components/Textarea'
import type { AdjustStockDTO } from '../../types/admin.types'

const adjustSchema = z.object({
  type: z.enum(['RESTOCK', 'ADJUSTMENT'], { message: 'Seleccioná un tipo' }),
  delta: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  reason: z.string().min(1, 'La razón es obligatoria'),
})

type AdjustFormData = z.infer<typeof adjustSchema>

interface StockAdjustFormProps {
  onSubmit: (data: AdjustStockDTO) => Promise<boolean>
}

function StockAdjustForm({ onSubmit }: StockAdjustFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      type: 'RESTOCK',
      delta: 1,
      reason: '',
    },
  })

  const selectedType = watch('type')

  const handleFormSubmit = async (data: AdjustFormData) => {
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    const payload: AdjustStockDTO = {
      type: data.type,
      delta: data.type === 'ADJUSTMENT' ? -Math.abs(data.delta) : data.delta,
      reason: data.reason,
    }

    const result = await onSubmit(payload)

    setSubmitting(false)
    if (result) {
      setSuccess(true)
      reset({ type: 'RESTOCK', delta: 1, reason: '' })
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError('Error al ajustar el stock. Intentalo de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
          Stock ajustado correctamente
        </div>
      )}

      <Select label="Tipo de ajuste" error={errors.type?.message} {...register('type')}>
        <option value="RESTOCK">RESTOCK (entrada)</option>
        <option value="ADJUSTMENT">ADJUSTMENT (corrección)</option>
      </Select>

      <Input
        label={selectedType === 'ADJUSTMENT' ? 'Cantidad (se registrará como negativo)' : 'Cantidad'}
        type="number"
        min={1}
        placeholder="1"
        error={errors.delta?.message}
        {...register('delta', { valueAsNumber: true })}
      />

      <Textarea
        label="Razón"
        placeholder="Ej: Compra a proveedor - Factura #1234"
        error={errors.reason?.message}
        {...register('reason')}
      />

      <div className="pt-2">
        <Button type="submit" loading={submitting}>
          Ajustar stock
        </Button>
      </div>
    </form>
  )
}

export { StockAdjustForm }
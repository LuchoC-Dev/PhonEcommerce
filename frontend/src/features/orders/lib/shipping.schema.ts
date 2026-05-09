import { z } from 'zod'

const onlyLetters = /^[\p{L}\s'\-\.]+$/u

export const shippingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(onlyLetters, 'Solo letras, espacios y guiones'),

  phone: z
    .string()
    .trim()
    .min(7, 'Mínimo 7 dígitos')
    .max(25, 'Máximo 25 caracteres')
    .regex(
      /^\+?[\d\s\-().]{7,25}$/,
      'Formato inválido — ej: +54 11 1234-5678'
    )
    .refine(
      (val) => val.replace(/\D/g, '').length >= 7,
      'Debe contener al menos 7 dígitos'
    ),

  address: z
    .string()
    .trim()
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .refine(
      (val) => /\d/.test(val),
      'Incluí el número de puerta (ej: Av. Corrientes 1234)'
    ),

  city: z
    .string()
    .trim()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(onlyLetters, 'Solo letras y espacios'),

  state: z
    .string()
    .trim()
    .max(100, 'Máximo 100 caracteres')
    .optional()
    .or(z.literal('')),

  country: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z]{2,3}$/,
      'Código ISO de 2-3 letras mayúsculas — ej: AR, US, BR'
    ),

  zipCode: z
    .string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(10, 'Máximo 10 caracteres')
    .regex(
      /^[A-Za-z0-9\s\-]{3,10}$/,
      'Código postal inválido — solo letras, números y guiones'
    ),
})

export type ShippingFormValues = z.infer<typeof shippingSchema>

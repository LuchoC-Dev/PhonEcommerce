'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import { Select } from '@shared/components/Select'
import { Spinner } from '@shared/components/Spinner'
import { adminService } from '@features/admin/services/admin.service'
import type { Brand, Category } from '@features/catalog/types/catalog.types'

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  brandId: z.string().min(1, 'Seleccioná una marca'),
  categoryId: z.string().min(1, 'Seleccioná una categoría'),
  status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  productId?: string
}

function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const isEditing = productId !== undefined && productId !== 'new'

  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      brandId: '',
      categoryId: '',
      status: 'DRAFT',
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [brandsData, categoriesData] = await Promise.all([
          adminService.getBrands(),
          adminService.getCategories(),
        ])
        setBrands(brandsData)

        const flatCategories: Category[] = []
        const flatten = (cats: Category[]) => {
          for (const cat of cats) {
            flatCategories.push(cat)
            if (cat.children?.length) flatten(cat.children)
          }
        }
        flatten(categoriesData)
        setCategories(flatCategories)

        if (isEditing && productId) {
          const product = await adminService.getProductBySlug(productId)
          reset({
            name: product.name,
            description: product.description ?? '',
            price: product.price,
            brandId: product.brand?.id ?? '',
            categoryId: product.category?.id ?? '',
            status: product.status,
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos')
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [productId, isEditing, reset])

  const onSubmit = async (data: ProductFormData) => {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...data,
        description: data.description || undefined,
      }
      if (isEditing && productId) {
        await adminService.updateProduct(productId, payload)
      } else {
        await adminService.createProduct(payload)
      }
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingData) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Nombre"
        placeholder="iPhone 15 Pro"
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Descripción"
        placeholder="Descripción del producto..."
        error={errors.description?.message}
        {...register('description')}
      />

      <Input
        label="Precio"
        type="number"
        step="0.01"
        placeholder="0"
        error={errors.price?.message}
        {...register('price', { valueAsNumber: true })}
      />

      <Select
        label="Marca"
        error={errors.brandId?.message}
        {...register('brandId')}
      >
        <option value="">Seleccioná una marca</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>{brand.name}</option>
        ))}
      </Select>

      <Select
        label="Categoría"
        error={errors.categoryId?.message}
        {...register('categoryId')}
      >
        <option value="">Seleccioná una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>

      <Select
        label="Estado"
        error={errors.status?.message}
        {...register('status')}
      >
        <option value="DRAFT">Borrador</option>
        <option value="PUBLISHED">Publicado</option>
        <option value="ARCHIVED">Archivado</option>
      </Select>

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={submitting}>
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/products')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export { ProductForm }
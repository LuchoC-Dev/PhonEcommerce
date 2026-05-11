import type { Product } from '@features/catalog/types/catalog.types'

interface ProductSpecsProps {
  product: Product
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    { label: 'Marca', value: product.brand.name },
    { label: 'Categoría', value: product.category.name },
    { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
    { label: 'Estado', value: product.status === 'PUBLISHED' ? 'Disponible' : 'No disponible' },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          Especificaciones
        </h3>
      </div>
      <div className="divide-y divide-border">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex items-center px-5 py-3 gap-4">
            <span className="w-28 text-sm text-text-subtle flex-shrink-0">{label}</span>
            <span className="text-sm text-text font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

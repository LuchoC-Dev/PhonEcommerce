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
    <div className="rounded-2xl border border-[#2a2a35] bg-[#1a1a1f] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#2a2a35]">
        <h3 className="text-sm font-semibold text-[#9090a0] uppercase tracking-wider">
          Especificaciones
        </h3>
      </div>
      <div className="divide-y divide-[#2a2a35]">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex items-center px-5 py-3 gap-4">
            <span className="w-28 text-sm text-[#6b6b7a] flex-shrink-0">{label}</span>
            <span className="text-sm text-[#e0e0e8] font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

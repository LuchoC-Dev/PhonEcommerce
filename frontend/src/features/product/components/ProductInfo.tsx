import type { Product } from '@features/catalog/types/catalog.types'
import { Badge } from '@shared/components/Badge'
import { AddToCartButton } from './AddToCartButton'

interface ProductInfoProps {
  product: Product
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb brand / category */}
      <div className="flex items-center gap-2">
        <Badge variant="default">{product.brand.name}</Badge>
        <span className="text-[#3a3a48]">·</span>
        <Badge variant="default">{product.category.name}</Badge>
      </div>

      {/* Nombre */}
      <h1 className="text-3xl font-bold text-[#e0e0e8] leading-tight font-[--font-display]">
        {product.name}
      </h1>

      {/* Precio */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-white font-[--font-display]">
          {formatPrice(product.price)}
        </span>
        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-sm text-amber-400 font-medium">
            ¡Últimas {product.stock} unidades!
          </span>
        )}
      </div>

      {/* Descripción */}
      {product.description && (
        <p className="text-[#9090a0] text-sm leading-relaxed">
          {product.description}
        </p>
      )}

      <div className="border-t border-[#2a2a35]" />

      {/* Carrito */}
      <AddToCartButton productId={product.id} stock={product.stock} />
    </div>
  )
}

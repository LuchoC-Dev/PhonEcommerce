import Link from 'next/link'
import Image from 'next/image'
import { catalogService } from '@features/catalog/services/catalog.service'
import type { Product } from '@features/catalog/types/catalog.types'
import { formatPrice } from '@shared/utils'

function resolveImageUrl(url: string): string {
  if (url.startsWith('http')) return url
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001'
  return `${apiBase}${url}`
}

function ProductCardMinimal({ product }: { product: Product }) {
  const primaryImage = product.images.sort((a, b) => a.position - b.position)[0]

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[--radius-xl] border border-[--color-border] bg-[--color-card] shadow-[--shadow-sm] transition-all duration-200 hover:border-[--color-primary] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    >
      <div className="relative aspect-[4/3] bg-[#1a1a2e] overflow-hidden">
        {primaryImage ? (
          <Image
            src={resolveImageUrl(primaryImage.url)}
            alt={primaryImage.altText ?? product.name}
            fill
            unoptimized
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-4xl opacity-20">📱</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-[--radius-full] bg-[#1e1e2e] border border-[--color-border-subtle] px-2.5 py-0.5 text-xs font-medium text-[--color-text-muted]">
            {product.brand.name}
          </span>
        </div>

        <h3 className="font-[--font-display] text-base font-semibold text-[--color-text] truncate">
          {product.name}
        </h3>

        <div className="mt-auto pt-4">
          <span className="font-[--font-display] text-xl font-bold text-[--color-text]">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export async function FeaturedProducts() {
  let products: Product[] = []

  try {
    const response = await catalogService.getProducts({ pageSize: 8 })
    products = response.data.filter((p) => p.status === 'PUBLISHED').slice(0, 8)
  } catch {
    return null
  }

  if (products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10">
        <h2 className="font-[--font-display] text-3xl font-bold text-[--color-text]">
          Destacados
        </h2>
        <p className="mt-2 text-[--color-text-muted]">
          Los mejores smartphones, seleccionados para vos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCardMinimal key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
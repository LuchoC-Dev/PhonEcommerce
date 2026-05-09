import Link from 'next/link'
import { catalogService } from '@features/catalog/services/catalog.service'
import type { Category } from '@features/catalog/types/catalog.types'

const CATEGORY_ICONS: Record<string, string> = {
  smartphones: '📱',
  tablets: '💻',
  accesorios: '🎧',
  wearables: '⌚',
  audio: '🔊',
  cargadores: '🔌',
}

function getCategoryIcon(name: string, slug: string): string {
  const slugKey = slug.toLowerCase()
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (slugKey.includes(key)) return icon
  }
  if (name.toLowerCase().includes('smartphone') || name.toLowerCase().includes('celular') || name.toLowerCase().includes('móvil') || name.toLowerCase().includes('movil')) return '📱'
  if (name.toLowerCase().includes('tablet')) return '💻'
  if (name.toLowerCase().includes('accesorio') || name.toLowerCase().includes('funda') || name.toLowerCase().includes('case')) return '🎧'
  return '📦'
}

function CategoryCard({ category }: { category: Category }) {
  const icon = getCategoryIcon(category.name, category.slug)

  return (
    <Link
      href="/catalog"
      className="group flex flex-col items-center justify-center gap-3 rounded-[--radius-xl] border border-[--color-border] bg-[--color-card] p-8 transition-all duration-200 hover:border-[--color-primary] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    >
      <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
        {icon}
      </span>
      <span className="font-[--font-display] text-sm font-semibold text-[--color-text] text-center">
        {category.name}
      </span>
    </Link>
  )
}

export async function CategoryHighlights() {
  let categories: Category[] = []

  try {
    const response = await catalogService.getCategories()
    categories = response.data.slice(0, 6)
  } catch {
    return null
  }

  if (categories.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-10">
        <h2 className="font-[--font-display] text-3xl font-bold text-[--color-text]">
          Categorías
        </h2>
        <p className="mt-2 text-[--color-text-muted]">
          Explorá nuestro catálogo por categoría.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
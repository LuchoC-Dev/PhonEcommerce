export { ProductCard } from './components/ProductCard'
export { ProductGrid } from './components/ProductGrid'
export { FilterSidebar } from './components/FilterSidebar'
export { SearchBar } from './components/SearchBar'
export { Pagination } from './components/Pagination'

export { useProducts } from './hooks/useProducts'
export { useBrands } from './hooks/useBrands'
export { useCategories } from './hooks/useCategories'

export { catalogService } from './services/catalog.service'

export type {
  Product,
  Brand,
  Category,
  ProductFilters,
  PaginationMeta,
  ProductsResponse,
} from './types/catalog.types'

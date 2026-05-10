export { AdminSidebar } from './components/AdminSidebar'
export { AdminAuthGuard } from './components/AdminAuthGuard'
export { StatCard } from './components/StatCard'
export { ProductsTable } from './components/products/ProductsTable'
export { ProductForm } from './components/products/ProductForm'
export { BrandsTable } from './components/brands/BrandsTable'
export { BrandForm } from './components/brands/BrandForm'
export { CategoriesTable } from './components/categories/CategoriesTable'
export { CategoryForm } from './components/categories/CategoryForm'
export { useAdminProducts } from './hooks/useAdminProducts'
export { useAdminBrands } from './hooks/useAdminBrands'
export { useAdminCategories } from './hooks/useAdminCategories'
export { adminService } from './services/admin.service'
export type {
  StatCardProps,
  AdminStats,
  CreateProductDTO,
  UpdateProductDTO,
  CreateBrandDTO,
  UpdateBrandDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from './types/admin.types'
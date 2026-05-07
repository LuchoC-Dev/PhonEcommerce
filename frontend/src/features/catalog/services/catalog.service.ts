import api from '@shared/lib/api'
import type {
  ProductsResponse,
  BrandsResponse,
  CategoriesResponse,
  ProductFilters,
} from '../types/catalog.types'

export const catalogService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    )
    const response = await api.get<ProductsResponse>('/products', { params })
    return response.data
  },

  async getBrands(): Promise<BrandsResponse> {
    const response = await api.get<BrandsResponse>('/brands')
    return response.data
  },

  async getCategories(): Promise<CategoriesResponse> {
    const response = await api.get<CategoriesResponse>('/categories')
    return response.data
  },
}

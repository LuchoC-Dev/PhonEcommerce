import api from '@shared/lib/api'
import type {
  CreateProductDTO,
  UpdateProductDTO,
  CreateBrandDTO,
  UpdateBrandDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  StockInfo,
  StockMovementsResponse,
  AdjustStockDTO,
  UpdateOrderStatusDTO,
} from '../types/admin.types'
import type { Order, OrderWithDetails, OrderPage } from '@features/orders/types/orders.types'
import type {
  Product,
  Brand,
  Category,
} from '@features/catalog/types/catalog.types'

interface PaginatedProducts {
  data: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const adminService = {
  // Products
  async getProducts(page: number = 1, pageSize: number = 20): Promise<PaginatedProducts> {
    const response = await api.get<PaginatedProducts>('/products', {
      params: { page, pageSize },
    })
    return response.data
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${slug}`)
    return response.data
  },

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  async updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, data)
    return response.data
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  // Brands — API returns raw array
  async getBrands(): Promise<Brand[]> {
    const response = await api.get<Brand[]>('/brands')
    return response.data
  },

  async createBrand(data: CreateBrandDTO): Promise<Brand> {
    const response = await api.post<Brand>('/brands', data)
    return response.data
  },

  async updateBrand(id: string, data: UpdateBrandDTO): Promise<Brand> {
    const response = await api.put<Brand>(`/brands/${id}`, data)
    return response.data
  },

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`)
  },

  // Categories — API returns raw array (tree with children)
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const response = await api.post<Category>('/categories', data)
    return response.data
  },

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, data)
    return response.data
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },

  // Stock
  async getProductStock(productId: string): Promise<StockInfo> {
    const response = await api.get<StockInfo>(`/stock/${productId}`)
    return response.data
  },

  async adjustStock(productId: string, data: AdjustStockDTO): Promise<void> {
    await api.post(`/stock/${productId}/adjust`, data)
  },

  async getStockMovements(productId: string, page: number = 1, pageSize: number = 20): Promise<StockMovementsResponse> {
    const response = await api.get<StockMovementsResponse>(`/stock/${productId}/movements`, {
      params: { page, pageSize },
    })
    return response.data
  },

  // Orders
  async getOrders(page: number = 1, pageSize: number = 20): Promise<OrderPage> {
    const response = await api.get<OrderPage>('/orders', {
      params: { page, pageSize },
    })
    return response.data
  },

  async getOrderById(id: string): Promise<OrderWithDetails> {
    const response = await api.get<OrderWithDetails>(`/orders/${id}`)
    return response.data
  },

  async updateOrderStatus(id: string, data: UpdateOrderStatusDTO): Promise<OrderWithDetails> {
    const response = await api.patch<OrderWithDetails>(`/orders/${id}/status`, data)
    return response.data
  },
}
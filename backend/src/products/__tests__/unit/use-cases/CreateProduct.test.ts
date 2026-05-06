import { describe, it, expect, vi } from 'vitest'
import { CreateProduct } from '../../../application/use-cases/CreateProduct'
import { IProductRepository, CreateProductData } from '../../../domain/repositories/product.repository'
import { ConflictError } from '@shared/errors/AppError'
import { ProductWithRelations } from '../../../domain/entities/product.entity'

const baseData: CreateProductData = {
  name: 'Galaxy S24',
  slug: 'galaxy-s24',
  price: 999,
  brandId: 'brand-1',
  categoryId: 'cat-1',
}

const mockCreated: ProductWithRelations = {
  id: 'prod-1',
  ...baseData,
  description: null,
  stock: 0,
  status: 'DRAFT',
  createdAt: new Date(),
  updatedAt: new Date(),
  images: [],
  brand: { id: 'brand-1', name: 'Samsung', slug: 'samsung' },
  category: { id: 'cat-1', name: 'Smartphones', slug: 'smartphones' },
}

function makeRepo(overrides?: Partial<IProductRepository>): IProductRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(null),
    findById: vi.fn(),
    create: vi.fn().mockResolvedValue(mockCreated),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('CreateProduct', () => {
  it('creates and returns product when slug is unique', async () => {
    const repo = makeRepo()
    const useCase = new CreateProduct(repo)

    const result = await useCase.execute(baseData)

    expect(result).toEqual(mockCreated)
    expect(repo.create).toHaveBeenCalledWith(baseData)
  })

  it('throws ConflictError when slug already exists', async () => {
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(mockCreated) })
    const useCase = new CreateProduct(repo)

    await expect(useCase.execute(baseData)).rejects.toThrow(ConflictError)
    expect(repo.create).not.toHaveBeenCalled()
  })
})

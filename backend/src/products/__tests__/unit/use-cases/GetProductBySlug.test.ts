import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetProductBySlug } from '../../../application/use-cases/GetProductBySlug'
import { IProductRepository } from '../../../domain/repositories/product.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { ProductWithRelations } from '../../../domain/entities/product.entity'

const mockProduct: ProductWithRelations = {
  id: 'prod-1',
  name: 'Galaxy S24',
  slug: 'galaxy-s24',
  description: null,
  price: 999,
  stock: 10,
  status: 'PUBLISHED',
  brandId: 'brand-1',
  categoryId: 'cat-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  images: [],
  brand: { id: 'brand-1', name: 'Samsung', slug: 'samsung' },
  category: { id: 'cat-1', name: 'Smartphones', slug: 'smartphones' },
}

function makeRepo(overrides?: Partial<IProductRepository>): IProductRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('GetProductBySlug', () => {
  it('returns product when slug exists', async () => {
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(mockProduct) })
    const useCase = new GetProductBySlug(repo)

    const result = await useCase.execute('galaxy-s24')

    expect(result).toEqual(mockProduct)
    expect(repo.findBySlug).toHaveBeenCalledWith('galaxy-s24')
  })

  it('throws NotFoundError when slug does not exist', async () => {
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(null) })
    const useCase = new GetProductBySlug(repo)

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
  })
})

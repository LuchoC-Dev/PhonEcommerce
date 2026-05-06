import { describe, it, expect, vi } from 'vitest'
import { UpdateProduct } from '../../../application/use-cases/UpdateProduct'
import { IProductRepository } from '../../../domain/repositories/product.repository'
import { NotFoundError, ConflictError } from '@shared/errors/AppError'
import { Product, ProductWithRelations } from '../../../domain/entities/product.entity'

const existing: Product = {
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
}

const updated: ProductWithRelations = {
  ...existing,
  name: 'Galaxy S24 Ultra',
  images: [],
  brand: { id: 'brand-1', name: 'Samsung', slug: 'samsung' },
  category: { id: 'cat-1', name: 'Smartphones', slug: 'smartphones' },
}

function makeRepo(overrides?: Partial<IProductRepository>): IProductRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(existing),
    create: vi.fn(),
    update: vi.fn().mockResolvedValue(updated),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('UpdateProduct', () => {
  it('updates product when it exists', async () => {
    const repo = makeRepo()
    const useCase = new UpdateProduct(repo)

    const result = await useCase.execute('prod-1', { name: 'Galaxy S24 Ultra' })

    expect(result).toEqual(updated)
    expect(repo.update).toHaveBeenCalledWith('prod-1', { name: 'Galaxy S24 Ultra' })
  })

  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCase = new UpdateProduct(repo)

    await expect(useCase.execute('nonexistent', { name: 'New Name' })).rejects.toThrow(NotFoundError)
    expect(repo.update).not.toHaveBeenCalled()
  })

  it('throws ConflictError when new slug belongs to another product', async () => {
    const otherProduct: ProductWithRelations = { ...updated, id: 'prod-2', slug: 'other-slug', images: [], brand: updated.brand, category: updated.category }
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(otherProduct) })
    const useCase = new UpdateProduct(repo)

    await expect(useCase.execute('prod-1', { slug: 'other-slug' })).rejects.toThrow(ConflictError)
  })

  it('allows updating with the same slug (no conflict)', async () => {
    const repo = makeRepo()
    const useCase = new UpdateProduct(repo)

    // Same slug as existing — findBySlug returns null → no conflict
    await expect(useCase.execute('prod-1', { slug: 'galaxy-s24' })).resolves.toBeDefined()
  })
})

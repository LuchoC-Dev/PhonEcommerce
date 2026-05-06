import { describe, it, expect, vi } from 'vitest'
import { DeleteProduct } from '../../../application/use-cases/DeleteProduct'
import { IProductRepository } from '../../../domain/repositories/product.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { Product } from '../../../domain/entities/product.entity'

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

function makeRepo(overrides?: Partial<IProductRepository>): IProductRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    findById: vi.fn().mockResolvedValue(existing),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe('DeleteProduct', () => {
  it('deletes product when it exists', async () => {
    const repo = makeRepo()
    const useCase = new DeleteProduct(repo)

    await useCase.execute('prod-1')

    expect(repo.delete).toHaveBeenCalledWith('prod-1')
  })

  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCase = new DeleteProduct(repo)

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundError)
    expect(repo.delete).not.toHaveBeenCalled()
  })
})

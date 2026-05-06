import { describe, it, expect, vi } from 'vitest'
import { CreateCategory } from '../../../application/use-cases/CreateCategory'
import { ICategoryRepository } from '../../../domain/repositories/category.repository'
import { ConflictError } from '@shared/errors/AppError'
import { Category } from '../../../domain/entities/category.entity'

const mockCategory: Category = {
  id: 'cat-1',
  name: 'Smartphones',
  slug: 'smartphones',
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function makeRepo(overrides?: Partial<ICategoryRepository>): ICategoryRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(mockCategory),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('CreateCategory', () => {
  it('creates category when slug is unique', async () => {
    const repo = makeRepo()
    const useCase = new CreateCategory(repo)

    const result = await useCase.execute({ name: 'Smartphones', slug: 'smartphones' })

    expect(result).toEqual(mockCategory)
  })

  it('throws ConflictError when slug already exists', async () => {
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(mockCategory) })
    const useCase = new CreateCategory(repo)

    await expect(useCase.execute({ name: 'Smartphones', slug: 'smartphones' })).rejects.toThrow(ConflictError)
  })

  it('creates subcategory with parentId', async () => {
    const sub: Category = { ...mockCategory, id: 'cat-2', name: 'Android', slug: 'android', parentId: 'cat-1' }
    const repo = makeRepo({ create: vi.fn().mockResolvedValue(sub) })
    const useCase = new CreateCategory(repo)

    const result = await useCase.execute({ name: 'Android', slug: 'android', parentId: 'cat-1' })

    expect(result.parentId).toBe('cat-1')
  })
})

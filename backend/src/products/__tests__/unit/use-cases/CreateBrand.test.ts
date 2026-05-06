import { describe, it, expect, vi } from 'vitest'
import { CreateBrand } from '../../../application/use-cases/CreateBrand'
import { IBrandRepository } from '../../../domain/repositories/brand.repository'
import { ConflictError } from '@shared/errors/AppError'
import { Brand } from '../../../domain/entities/brand.entity'

const mockBrand: Brand = {
  id: 'brand-1',
  name: 'Samsung',
  slug: 'samsung',
  logo: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function makeRepo(overrides?: Partial<IBrandRepository>): IBrandRepository {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue(mockBrand),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('CreateBrand', () => {
  it('creates brand when slug is unique', async () => {
    const repo = makeRepo()
    const useCase = new CreateBrand(repo)

    const result = await useCase.execute({ name: 'Samsung', slug: 'samsung' })

    expect(result).toEqual(mockBrand)
    expect(repo.create).toHaveBeenCalled()
  })

  it('throws ConflictError when slug already exists', async () => {
    const repo = makeRepo({ findBySlug: vi.fn().mockResolvedValue(mockBrand) })
    const useCase = new CreateBrand(repo)

    await expect(useCase.execute({ name: 'Samsung', slug: 'samsung' })).rejects.toThrow(ConflictError)
    expect(repo.create).not.toHaveBeenCalled()
  })
})

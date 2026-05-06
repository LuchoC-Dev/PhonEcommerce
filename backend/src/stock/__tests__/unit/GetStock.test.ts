import { describe, it, expect, vi } from 'vitest'
import { GetStock } from '../../application/use-cases/GetStock'
import type { IStockRepository } from '../../domain/repositories/stock.repository'
import { NotFoundError } from '@shared/errors/AppError'

function makeRepo(overrides?: Partial<IStockRepository>): IStockRepository {
  return {
    findByProductId: vi.fn().mockResolvedValue({ productId: 'prod-1', quantity: 10 }),
    applyMovement: vi.fn(),
    findMovements: vi.fn(),
    ...overrides,
  }
}

describe('GetStock', () => {
  it('returns stock level for existing product', async () => {
    const repo = makeRepo()
    const result = await new GetStock(repo).execute('prod-1')
    expect(result).toEqual({ productId: 'prod-1', quantity: 10 })
  })

  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo({ findByProductId: vi.fn().mockResolvedValue(null) })
    await expect(new GetStock(repo).execute('unknown')).rejects.toThrow(NotFoundError)
  })
})

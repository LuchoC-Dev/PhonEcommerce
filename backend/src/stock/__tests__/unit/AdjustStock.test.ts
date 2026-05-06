import { describe, it, expect, vi } from 'vitest'
import { AdjustStock } from '../../application/use-cases/AdjustStock'
import type { IStockRepository } from '../../domain/repositories/stock.repository'
import { AppError, NotFoundError } from '@shared/errors/AppError'
import type { StockMovement } from '../../domain/entities/stock.entity'

const now = new Date()

const mockMovement: StockMovement = {
  id: 'mov-1',
  productId: 'prod-1',
  type: 'RESTOCK',
  quantity: 10,
  stockBefore: 5,
  stockAfter: 15,
  reason: null,
  createdBy: 'admin-1',
  createdAt: now,
}

function makeRepo(currentStock = 5, overrides?: Partial<IStockRepository>): IStockRepository {
  return {
    findByProductId: vi.fn().mockResolvedValue({ productId: 'prod-1', quantity: currentStock }),
    applyMovement: vi.fn().mockResolvedValue(mockMovement),
    findMovements: vi.fn(),
    ...overrides,
  }
}

describe('AdjustStock', () => {
  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo(0, { findByProductId: vi.fn().mockResolvedValue(null) })
    await expect(
      new AdjustStock(repo).execute({ productId: 'x', delta: 5, type: 'RESTOCK', createdBy: 'admin-1' }),
    ).rejects.toThrow(NotFoundError)
  })

  it('throws AppError when delta is 0', async () => {
    const repo = makeRepo()
    await expect(
      new AdjustStock(repo).execute({ productId: 'prod-1', delta: 0, type: 'RESTOCK', createdBy: 'admin-1' }),
    ).rejects.toThrow(AppError)
  })

  it('throws AppError when deduction exceeds available stock', async () => {
    const repo = makeRepo(3)
    await expect(
      new AdjustStock(repo).execute({ productId: 'prod-1', delta: -10, type: 'ADJUSTMENT', createdBy: 'admin-1' }),
    ).rejects.toThrow(AppError)
  })

  it('calls applyMovement with correct params on RESTOCK', async () => {
    const repo = makeRepo(5)
    await new AdjustStock(repo).execute({ productId: 'prod-1', delta: 10, type: 'RESTOCK', createdBy: 'admin-1', reason: 'test' })
    expect(repo.applyMovement).toHaveBeenCalledWith({
      productId: 'prod-1',
      type: 'RESTOCK',
      quantity: 10,
      stockBefore: 5,
      stockAfter: 15,
      reason: 'test',
      createdBy: 'admin-1',
    })
  })

  it('allows deduction down to 0', async () => {
    const repo = makeRepo(5)
    await new AdjustStock(repo).execute({ productId: 'prod-1', delta: -5, type: 'ADJUSTMENT', createdBy: 'admin-1' })
    expect(repo.applyMovement).toHaveBeenCalledWith(expect.objectContaining({ stockAfter: 0 }))
  })
})

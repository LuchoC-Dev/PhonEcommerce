import { describe, it, expect, vi } from 'vitest'
import { DeductStock } from '../../application/use-cases/DeductStock'
import type { IStockRepository } from '../../domain/repositories/stock.repository'
import { AppError, NotFoundError } from '@shared/errors/AppError'
import type { StockMovement } from '../../domain/entities/stock.entity'

const now = new Date()

const mockMovement: StockMovement = {
  id: 'mov-1',
  productId: 'prod-1',
  type: 'SALE',
  quantity: -2,
  stockBefore: 10,
  stockAfter: 8,
  reason: null,
  createdBy: null,
  createdAt: now,
}

function makeRepo(currentStock = 10, overrides?: Partial<IStockRepository>): IStockRepository {
  return {
    findByProductId: vi.fn().mockResolvedValue({ productId: 'prod-1', quantity: currentStock }),
    applyMovement: vi.fn().mockResolvedValue(mockMovement),
    findMovements: vi.fn(),
    ...overrides,
  }
}

describe('DeductStock', () => {
  it('throws NotFoundError when product does not exist', async () => {
    const repo = makeRepo(0, { findByProductId: vi.fn().mockResolvedValue(null) })
    await expect(new DeductStock(repo).execute({ productId: 'x', quantity: 1 })).rejects.toThrow(NotFoundError)
  })

  it('throws AppError when quantity <= 0', async () => {
    const repo = makeRepo()
    await expect(new DeductStock(repo).execute({ productId: 'prod-1', quantity: 0 })).rejects.toThrow(AppError)
  })

  it('throws AppError when stock is insufficient', async () => {
    const repo = makeRepo(1)
    await expect(new DeductStock(repo).execute({ productId: 'prod-1', quantity: 5 })).rejects.toThrow(AppError)
  })

  it('throws AppError when stock is 0', async () => {
    const repo = makeRepo(0)
    await expect(new DeductStock(repo).execute({ productId: 'prod-1', quantity: 1 })).rejects.toThrow(AppError)
  })

  it('calls applyMovement with negative quantity as SALE', async () => {
    const repo = makeRepo(10)
    await new DeductStock(repo).execute({ productId: 'prod-1', quantity: 2, reason: 'order-123' })
    expect(repo.applyMovement).toHaveBeenCalledWith({
      productId: 'prod-1',
      type: 'SALE',
      quantity: -2,
      stockBefore: 10,
      stockAfter: 8,
      reason: 'order-123',
      createdBy: undefined,
    })
  })
})

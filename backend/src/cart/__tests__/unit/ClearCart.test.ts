import { describe, it, expect, vi } from 'vitest'
import { ClearCart } from '../../application/use-cases/ClearCart'
import { ICartRepository } from '../../domain/repositories/cart.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { Cart, CartWithItems } from '../../domain/entities/cart.entity'

const now = new Date()
const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const mockCart: Cart = { id: 'cart-1', accountId: 'a-1', expiresAt: future, createdAt: now, updatedAt: now }
const mockCartWithItems: CartWithItems = { ...mockCart, items: [] }

function makeRepo(overrides?: Partial<ICartRepository>): ICartRepository {
  return {
    findByAccountId: vi.fn().mockResolvedValue(mockCart),
    findWithItems: vi.fn().mockResolvedValue(mockCartWithItems),
    create: vi.fn(),
    resetExpiry: vi.fn(),
    clearItems: vi.fn(),
    findItem: vi.fn(),
    upsertItem: vi.fn(),
    updateItemQuantity: vi.fn(),
    removeItem: vi.fn(),
    ...overrides,
  }
}

describe('ClearCart', () => {
  it('throws NotFoundError when cart does not exist', async () => {
    const useCase = new ClearCart(makeRepo({ findByAccountId: vi.fn().mockResolvedValue(null) }))
    await expect(useCase.execute('a-1')).rejects.toThrow(NotFoundError)
  })

  it('clears all items', async () => {
    const repo = makeRepo()
    const useCase = new ClearCart(repo)

    await useCase.execute('a-1')

    expect(repo.clearItems).toHaveBeenCalledWith('cart-1')
  })

  it('returns cart with empty items', async () => {
    const useCase = new ClearCart(makeRepo())
    const result = await useCase.execute('a-1')
    expect(result.items).toEqual([])
  })
})

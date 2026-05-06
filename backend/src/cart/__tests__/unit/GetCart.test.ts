import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetCart } from '../../application/use-cases/GetCart'
import { ICartRepository } from '../../domain/repositories/cart.repository'
import { Cart, CartWithItems } from '../../domain/entities/cart.entity'

const now = new Date()
const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
const past = new Date(now.getTime() - 1000)

const emptyCartWith: (overrides?: Partial<Cart>) => Cart = (overrides = {}) => ({
  id: 'cart-1',
  accountId: 'account-1',
  expiresAt: future,
  createdAt: now,
  updatedAt: now,
  ...overrides,
})

const emptyCartWithItems: CartWithItems = {
  ...emptyCartWith(),
  items: [],
}

function makeRepo(overrides?: Partial<ICartRepository>): ICartRepository {
  return {
    findByAccountId: vi.fn(),
    findWithItems: vi.fn(),
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

describe('GetCart', () => {
  it('creates a new cart when none exists', async () => {
    const repo = makeRepo({
      findByAccountId: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue(emptyCartWith()),
      findWithItems: vi.fn().mockResolvedValue(emptyCartWithItems),
    })
    const useCase = new GetCart(repo)

    const result = await useCase.execute('account-1')

    expect(repo.create).toHaveBeenCalledOnce()
    expect(result.items).toEqual([])
  })

  it('returns existing active cart', async () => {
    const repo = makeRepo({
      findByAccountId: vi.fn().mockResolvedValue(emptyCartWith()),
      findWithItems: vi.fn().mockResolvedValue(emptyCartWithItems),
    })
    const useCase = new GetCart(repo)

    await useCase.execute('account-1')

    expect(repo.create).not.toHaveBeenCalled()
    expect(repo.clearItems).not.toHaveBeenCalled()
  })

  it('clears items and resets expiry when cart is expired', async () => {
    const expiredCart = emptyCartWith({ expiresAt: past })
    const repo = makeRepo({
      findByAccountId: vi.fn().mockResolvedValue(expiredCart),
      clearItems: vi.fn().mockResolvedValue(undefined),
      resetExpiry: vi.fn().mockResolvedValue(undefined),
      findWithItems: vi.fn().mockResolvedValue(emptyCartWithItems),
    })
    const useCase = new GetCart(repo)

    await useCase.execute('account-1')

    expect(repo.clearItems).toHaveBeenCalledWith('cart-1')
    expect(repo.resetExpiry).toHaveBeenCalledOnce()
  })
})

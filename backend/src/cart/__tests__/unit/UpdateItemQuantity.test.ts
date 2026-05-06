import { describe, it, expect, vi } from 'vitest'
import { UpdateItemQuantity } from '../../application/use-cases/UpdateItemQuantity'
import { ICartRepository } from '../../domain/repositories/cart.repository'
import { NotFoundError, AppError } from '@shared/errors/AppError'
import { Cart, CartItem, CartWithItems } from '../../domain/entities/cart.entity'

const now = new Date()
const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const mockCart: Cart = { id: 'cart-1', accountId: 'a-1', expiresAt: future, createdAt: now, updatedAt: now }
const mockItem: CartItem = { id: 'item-1', cartId: 'cart-1', productId: 'prod-1', quantity: 2, priceAtAdd: 100, createdAt: now, updatedAt: now }
const mockCartWithItems: CartWithItems = { ...mockCart, items: [] }

function makeRepo(overrides?: Partial<ICartRepository>): ICartRepository {
  return {
    findByAccountId: vi.fn().mockResolvedValue(mockCart),
    findWithItems: vi.fn().mockResolvedValue(mockCartWithItems),
    create: vi.fn(),
    resetExpiry: vi.fn(),
    clearItems: vi.fn(),
    findItem: vi.fn().mockResolvedValue(mockItem),
    upsertItem: vi.fn(),
    updateItemQuantity: vi.fn().mockResolvedValue(mockItem),
    removeItem: vi.fn(),
    ...overrides,
  }
}

describe('UpdateItemQuantity', () => {
  it('throws AppError when quantity is 0', async () => {
    const useCase = new UpdateItemQuantity(makeRepo())
    await expect(useCase.execute({ accountId: 'a-1', productId: 'prod-1', quantity: 0 }))
      .rejects.toThrow(AppError)
  })

  it('throws NotFoundError when cart does not exist', async () => {
    const useCase = new UpdateItemQuantity(makeRepo({ findByAccountId: vi.fn().mockResolvedValue(null) }))
    await expect(useCase.execute({ accountId: 'a-1', productId: 'prod-1', quantity: 3 }))
      .rejects.toThrow(NotFoundError)
  })

  it('throws NotFoundError when item does not exist', async () => {
    const useCase = new UpdateItemQuantity(makeRepo({ findItem: vi.fn().mockResolvedValue(null) }))
    await expect(useCase.execute({ accountId: 'a-1', productId: 'prod-x', quantity: 3 }))
      .rejects.toThrow(NotFoundError)
  })

  it('updates quantity successfully', async () => {
    const repo = makeRepo()
    const useCase = new UpdateItemQuantity(repo)

    await useCase.execute({ accountId: 'a-1', productId: 'prod-1', quantity: 5 })

    expect(repo.updateItemQuantity).toHaveBeenCalledWith('cart-1', 'prod-1', 5)
  })
})

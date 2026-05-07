import { describe, it, expect, vi } from 'vitest'
import { PreviewOrderFromCart } from '../../application/use-cases/PreviewOrderFromCart'
import type { ICartRepository } from '@cart/domain/repositories/cart.repository'
import type { CartWithItems } from '@cart/domain/entities/cart.entity'

const shipping = {
  name: 'John Doe',
  address: '123 Main St',
  city: 'Buenos Aires',
  country: 'AR',
  zipCode: '1000',
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

const mockCart: CartWithItems = {
  id: 'cart-1',
  accountId: 'acc-1',
  expiresAt: new Date(Date.now() + 86400000),
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [
    {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'prod-1',
      quantity: 2,
      priceAtAdd: 500,
      currentPrice: 600,
      createdAt: new Date(),
      updatedAt: new Date(),
      product: { id: 'prod-1', name: 'iPhone 15', slug: 'iphone-15', images: [] },
    },
  ],
}

describe('PreviewOrderFromCart', () => {
  it('returns preview with current prices', async () => {
    const repo = makeRepo({ findWithItems: vi.fn().mockResolvedValue(mockCart) })
    const useCase = new PreviewOrderFromCart(repo)

    const result = await useCase.execute({ accountId: 'acc-1', shipping })

    expect(result.items).toHaveLength(1)
    expect(result.items[0].unitPrice).toBe(600) // currentPrice, not priceAtAdd
    expect(result.items[0].subtotal).toBe(1200)
    expect(result.totalAmount).toBe(1200)
  })

  it('throws NotFoundError when cart does not exist', async () => {
    const repo = makeRepo({ findWithItems: vi.fn().mockResolvedValue(null) })
    const useCase = new PreviewOrderFromCart(repo)

    await expect(useCase.execute({ accountId: 'acc-1', shipping })).rejects.toMatchObject({
      code: 'NOT_FOUND',
    })
  })

  it('throws AppError when cart is empty', async () => {
    const emptyCart: CartWithItems = { ...mockCart, items: [] }
    const repo = makeRepo({ findWithItems: vi.fn().mockResolvedValue(emptyCart) })
    const useCase = new PreviewOrderFromCart(repo)

    await expect(useCase.execute({ accountId: 'acc-1', shipping })).rejects.toMatchObject({
      code: 'CART_EMPTY',
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { AddItem } from '../../application/use-cases/AddItem'
import { ICartRepository } from '../../domain/repositories/cart.repository'
import { IProductRepository } from '@products/domain/repositories/product.repository'
import { NotFoundError } from '@shared/errors/AppError'
import { Cart, CartWithItems } from '../../domain/entities/cart.entity'
import { Product } from '@products/domain/entities/product.entity'

const now = new Date()
const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const mockCart: Cart = {
  id: 'cart-1',
  accountId: 'account-1',
  expiresAt: future,
  createdAt: now,
  updatedAt: now,
}

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Galaxy S24',
  slug: 'galaxy-s24',
  description: null,
  price: 999,
  stock: 10,
  status: 'PUBLISHED',
  brandId: 'brand-1',
  categoryId: 'cat-1',
  createdAt: now,
  updatedAt: now,
}

const mockCartWithItems: CartWithItems = { ...mockCart, items: [] }

function makeCartRepo(overrides?: Partial<ICartRepository>): ICartRepository {
  return {
    findByAccountId: vi.fn().mockResolvedValue(mockCart),
    findWithItems: vi.fn().mockResolvedValue(mockCartWithItems),
    create: vi.fn().mockResolvedValue(mockCart),
    resetExpiry: vi.fn(),
    clearItems: vi.fn(),
    findItem: vi.fn(),
    upsertItem: vi.fn().mockResolvedValue({}),
    updateItemQuantity: vi.fn(),
    removeItem: vi.fn(),
    ...overrides,
  }
}

function makeProductRepo(overrides?: Partial<IProductRepository>): IProductRepository {
  return {
    findAll: vi.fn(),
    findBySlug: vi.fn(),
    findById: vi.fn().mockResolvedValue(mockProduct),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    ...overrides,
  }
}

describe('AddItem', () => {
  it('throws NotFoundError when product does not exist', async () => {
    const cartRepo = makeCartRepo()
    const productRepo = makeProductRepo({ findById: vi.fn().mockResolvedValue(null) })
    const useCase = new AddItem(cartRepo, productRepo)

    await expect(useCase.execute({ accountId: 'account-1', productId: 'prod-x', quantity: 1 }))
      .rejects.toThrow(NotFoundError)
  })

  it('creates cart and upserts item when no cart exists', async () => {
    const cartRepo = makeCartRepo({ findByAccountId: vi.fn().mockResolvedValue(null) })
    const productRepo = makeProductRepo()
    const useCase = new AddItem(cartRepo, productRepo)

    await useCase.execute({ accountId: 'account-1', productId: 'prod-1', quantity: 2 })

    expect(cartRepo.create).toHaveBeenCalledOnce()
    expect(cartRepo.upsertItem).toHaveBeenCalledWith('cart-1', 'prod-1', 2, 999)
  })

  it('upserts item using current product price', async () => {
    const cartRepo = makeCartRepo()
    const productRepo = makeProductRepo()
    const useCase = new AddItem(cartRepo, productRepo)

    await useCase.execute({ accountId: 'account-1', productId: 'prod-1', quantity: 1 })

    expect(cartRepo.upsertItem).toHaveBeenCalledWith('cart-1', 'prod-1', 1, 999)
  })
})

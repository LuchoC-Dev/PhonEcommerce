import { describe, it, expect, vi } from 'vitest'
import { CancelOrder } from '../../application/use-cases/CancelOrder'
import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { OrderWithDetails } from '../../domain/entities/order.entity'

function makeRepo(overrides?: Partial<IOrderRepository>): IOrderRepository {
  return {
    createOrder: vi.fn(),
    findById: vi.fn(),
    findOrders: vi.fn(),
    updateStatus: vi.fn(),
    ...overrides,
  }
}

function makeOrder(overrides: Partial<OrderWithDetails> = {}): OrderWithDetails {
  return {
    id: 'order-1',
    accountId: 'acc-1',
    status: 'PENDING',
    totalAmount: 1200,
    shippingName: 'John',
    shippingPhone: null,
    shippingAddress: '123 Main St',
    shippingCity: 'BA',
    shippingState: null,
    shippingCountry: 'AR',
    shippingZipCode: '1000',
    createdAt: new Date(),
    updatedAt: new Date(),
    items: [],
    statusHistory: [],
    ...overrides,
  }
}

describe('CancelOrder', () => {
  it('cancels PENDING order for its owner', async () => {
    const order = makeOrder({ status: 'PENDING' })
    const repo = makeRepo({
      findById: vi.fn().mockResolvedValue(order),
      updateStatus: vi.fn().mockResolvedValue({ ...order, status: 'CANCELLED' }),
    })
    const useCase = new CancelOrder(repo)

    await useCase.execute({ orderId: 'order-1', requesterId: 'acc-1', isAdmin: false })

    expect(repo.updateStatus).toHaveBeenCalledWith('order-1', 'PENDING', 'CANCELLED', 'acc-1')
  })

  it('cancels CONFIRMED order for its owner', async () => {
    const order = makeOrder({ status: 'CONFIRMED' })
    const repo = makeRepo({
      findById: vi.fn().mockResolvedValue(order),
      updateStatus: vi.fn().mockResolvedValue({ ...order, status: 'CANCELLED' }),
    })
    const useCase = new CancelOrder(repo)

    await useCase.execute({ orderId: 'order-1', requesterId: 'acc-1', isAdmin: false })

    expect(repo.updateStatus).toHaveBeenCalled()
  })

  it('throws when user tries to cancel SHIPPED order', async () => {
    const order = makeOrder({ status: 'SHIPPED' })
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(order) })
    const useCase = new CancelOrder(repo)

    await expect(
      useCase.execute({ orderId: 'order-1', requesterId: 'acc-1', isAdmin: false }),
    ).rejects.toMatchObject({ code: 'ORDER_NOT_CANCELLABLE' })
  })

  it('allows admin to cancel SHIPPED order', async () => {
    const order = makeOrder({ status: 'SHIPPED' })
    const repo = makeRepo({
      findById: vi.fn().mockResolvedValue(order),
      updateStatus: vi.fn().mockResolvedValue({ ...order, status: 'CANCELLED' }),
    })
    const useCase = new CancelOrder(repo)

    await useCase.execute({ orderId: 'order-1', requesterId: 'admin-1', isAdmin: true })

    expect(repo.updateStatus).toHaveBeenCalled()
  })

  it('throws ForbiddenError when user does not own order', async () => {
    const order = makeOrder({ accountId: 'other-acc' })
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(order) })
    const useCase = new CancelOrder(repo)

    await expect(
      useCase.execute({ orderId: 'order-1', requesterId: 'acc-1', isAdmin: false }),
    ).rejects.toMatchObject({ statusCode: 403 })
  })

  it('throws when order is already cancelled', async () => {
    const order = makeOrder({ status: 'CANCELLED' })
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(order) })
    const useCase = new CancelOrder(repo)

    await expect(
      useCase.execute({ orderId: 'order-1', requesterId: 'acc-1', isAdmin: false }),
    ).rejects.toMatchObject({ code: 'ORDER_ALREADY_CANCELLED' })
  })
})

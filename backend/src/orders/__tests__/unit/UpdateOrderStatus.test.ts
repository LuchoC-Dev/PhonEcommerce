import { describe, it, expect, vi } from 'vitest'
import { UpdateOrderStatus } from '../../application/use-cases/UpdateOrderStatus'
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

function makeOrder(status: OrderWithDetails['status']): OrderWithDetails {
  return {
    id: 'order-1',
    accountId: 'acc-1',
    status,
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
  }
}

describe('UpdateOrderStatus', () => {
  it('transitions PENDING → CONFIRMED', async () => {
    const order = makeOrder('PENDING')
    const repo = makeRepo({
      findById: vi.fn().mockResolvedValue(order),
      updateStatus: vi.fn().mockResolvedValue({ ...order, status: 'CONFIRMED' }),
    })
    const useCase = new UpdateOrderStatus(repo)

    await useCase.execute({ orderId: 'order-1', newStatus: 'CONFIRMED', adminId: 'admin-1' })

    expect(repo.updateStatus).toHaveBeenCalledWith('order-1', 'PENDING', 'CONFIRMED', 'admin-1', undefined)
  })

  it('throws on invalid transition PENDING → DELIVERED', async () => {
    const order = makeOrder('PENDING')
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(order) })
    const useCase = new UpdateOrderStatus(repo)

    await expect(
      useCase.execute({ orderId: 'order-1', newStatus: 'DELIVERED', adminId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'INVALID_STATUS_TRANSITION' })
  })

  it('throws on transition from DELIVERED (terminal state)', async () => {
    const order = makeOrder('DELIVERED')
    const repo = makeRepo({ findById: vi.fn().mockResolvedValue(order) })
    const useCase = new UpdateOrderStatus(repo)

    await expect(
      useCase.execute({ orderId: 'order-1', newStatus: 'CANCELLED', adminId: 'admin-1' }),
    ).rejects.toMatchObject({ code: 'INVALID_STATUS_TRANSITION' })
  })
})

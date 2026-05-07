import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { Order, OrderStatus } from '../../domain/entities/order.entity'
import { AppError, NotFoundError } from '@shared/errors/AppError'

export interface UpdateOrderStatusInput {
  orderId: string
  newStatus: OrderStatus
  adminId: string
  note?: string
}

/** Allowed forward transitions for an admin. */
const VALID_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
}

/**
 * Allows an admin to transition an order to a new status.
 * Enforces the allowed state machine transitions.
 *
 * @throws {NotFoundError} if the order does not exist.
 * @throws {AppError} if the requested transition is not valid.
 */
export class UpdateOrderStatus {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: UpdateOrderStatusInput): Promise<Order> {
    const { orderId, newStatus, adminId, note } = input

    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new NotFoundError('Order')

    const allowed = VALID_TRANSITIONS[order.status] ?? []
    if (!allowed.includes(newStatus)) {
      throw new AppError(
        `Cannot transition order from ${order.status} to ${newStatus}`,
        409,
        'INVALID_STATUS_TRANSITION',
      )
    }

    return this.orderRepository.updateStatus(orderId, order.status, newStatus, adminId, note)
  }
}

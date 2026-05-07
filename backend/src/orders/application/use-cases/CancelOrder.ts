import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { Order, OrderStatus } from '../../domain/entities/order.entity'
import { AppError, ForbiddenError, NotFoundError } from '@shared/errors/AppError'

export interface CancelOrderInput {
  orderId: string
  requesterId: string
  isAdmin: boolean
}

/** Statuses from which a non-admin user may still cancel their order. */
const USER_CANCELLABLE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED']

/**
 * Cancels an order.
 * - Users can only cancel orders in PENDING or CONFIRMED status.
 * - Admins can cancel orders in any status except DELIVERED and already CANCELLED.
 *
 * @throws {NotFoundError} if the order does not exist.
 * @throws {ForbiddenError} if the requester does not own the order (non-admin).
 * @throws {AppError} if the order cannot be cancelled in its current status.
 */
export class CancelOrder {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: CancelOrderInput): Promise<Order> {
    const { orderId, requesterId, isAdmin } = input

    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new NotFoundError('Order')

    if (!isAdmin && order.accountId !== requesterId) {
      throw new ForbiddenError('You do not have access to this order')
    }

    if (order.status === 'CANCELLED') {
      throw new AppError('Order is already cancelled', 409, 'ORDER_ALREADY_CANCELLED')
    }
    if (order.status === 'DELIVERED') {
      throw new AppError('Delivered orders cannot be cancelled', 409, 'ORDER_NOT_CANCELLABLE')
    }
    if (!isAdmin && !USER_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new AppError(
        `Order cannot be cancelled once it is ${order.status}`,
        409,
        'ORDER_NOT_CANCELLABLE',
      )
    }

    return this.orderRepository.updateStatus(orderId, order.status, 'CANCELLED', requesterId)
  }
}

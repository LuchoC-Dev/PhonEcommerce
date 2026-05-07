import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { OrderWithDetails } from '../../domain/entities/order.entity'
import { ForbiddenError, NotFoundError } from '@shared/errors/AppError'

export interface GetOrderByIdInput {
  orderId: string
  /** The account requesting the order. */
  requesterId: string
  /** When true, any order can be fetched regardless of owner. */
  isAdmin: boolean
}

/**
 * Returns the full detail of an order including items and status history.
 *
 * @throws {NotFoundError} if the order does not exist.
 * @throws {ForbiddenError} if a non-admin requests an order they don't own.
 */
export class GetOrderById {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: GetOrderByIdInput): Promise<OrderWithDetails> {
    const { orderId, requesterId, isAdmin } = input

    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new NotFoundError('Order')

    if (!isAdmin && order.accountId !== requesterId) {
      throw new ForbiddenError('You do not have access to this order')
    }

    return order
  }
}

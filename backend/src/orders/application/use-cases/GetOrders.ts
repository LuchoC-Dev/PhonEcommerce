import type { IOrderRepository } from '../../domain/repositories/order.repository'
import type { OrderPage } from '../../domain/entities/order.entity'

export interface GetOrdersInput {
  /** Filter to orders owned by this account. Omit for admin listing all. */
  accountId?: string
  page: number
  pageSize: number
}

/**
 * Returns a paginated list of orders.
 * When accountId is provided, only that account's orders are returned.
 */
export class GetOrders {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: GetOrdersInput): Promise<OrderPage> {
    return this.orderRepository.findOrders({
      accountId: input.accountId,
      page: input.page,
      pageSize: input.pageSize,
    })
  }
}

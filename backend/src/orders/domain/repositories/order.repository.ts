import type {
  Order,
  OrderPage,
  OrderStatus,
  OrderWithDetails,
  ShippingInfo,
} from '../entities/order.entity'

export interface CreateOrderItemInput {
  productId: string
  quantity: number
  unitPrice: number
}

export interface CreateOrderInput {
  accountId: string
  items: CreateOrderItemInput[]
  shipping: ShippingInfo
  /**
   * When provided, cart items are deleted atomically within the same transaction.
   * Pass the cart ID (not account ID).
   */
  cartId?: string
}

export interface FindOrdersOptions {
  page: number
  pageSize: number
  /** When set, filters to orders belonging to this account. */
  accountId?: string
}

/**
 * Persistence contract for the orders domain.
 * Use-cases depend only on this interface, never on Prisma directly.
 */
export interface IOrderRepository {
  /**
   * Atomically creates an order, deducts stock for each item,
   * records a SALE StockMovement, and optionally clears the cart.
   * Throws AppError(409) if any item has insufficient stock.
   */
  createOrder(input: CreateOrderInput): Promise<OrderWithDetails>

  /** Returns an order with items and status history, or null if not found. */
  findById(id: string): Promise<OrderWithDetails | null>

  /** Returns paginated orders (optionally filtered by account). */
  findOrders(options: FindOrdersOptions): Promise<OrderPage>

  /**
   * Transitions the order to a new status and appends a status history entry.
   * @param changedBy - accountId of who triggered the change.
   */
  updateStatus(
    orderId: string,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
    changedBy: string,
    note?: string,
  ): Promise<Order>
}

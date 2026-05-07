import { FastifyRequest, FastifyReply } from 'fastify'
import type { PreviewOrderFromCart } from '../../application/use-cases/PreviewOrderFromCart'
import type { PreviewOrderQuickBuy } from '../../application/use-cases/PreviewOrderQuickBuy'
import type { CreateOrderFromCart } from '../../application/use-cases/CreateOrderFromCart'
import type { CreateOrderQuickBuy } from '../../application/use-cases/CreateOrderQuickBuy'
import type { GetOrders } from '../../application/use-cases/GetOrders'
import type { GetOrderById } from '../../application/use-cases/GetOrderById'
import type { CancelOrder } from '../../application/use-cases/CancelOrder'
import type { UpdateOrderStatus } from '../../application/use-cases/UpdateOrderStatus'
import type { ShippingInfo, OrderStatus } from '../../domain/entities/order.entity'
import { AppError } from '@shared/errors/AppError'

interface ShippingBody {
  name: string
  phone?: string
  address: string
  city: string
  state?: string
  country: string
  zipCode: string
}

function toShippingInfo(body: ShippingBody): ShippingInfo {
  return {
    name: body.name,
    phone: body.phone ?? null,
    address: body.address,
    city: body.city,
    state: body.state ?? null,
    country: body.country,
    zipCode: body.zipCode,
  }
}

export class OrderController {
  constructor(
    private readonly previewOrderFromCart: PreviewOrderFromCart,
    private readonly previewOrderQuickBuy: PreviewOrderQuickBuy,
    private readonly createOrderFromCart: CreateOrderFromCart,
    private readonly createOrderQuickBuy: CreateOrderQuickBuy,
    private readonly getOrders: GetOrders,
    private readonly getOrderById: GetOrderById,
    private readonly cancelOrder: CancelOrder,
    private readonly updateOrderStatus: UpdateOrderStatus,
  ) {}

  async previewFromCartHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as { shipping: ShippingBody }
    const result = await this.previewOrderFromCart.execute({
      accountId: request.user!.sub,
      shipping: toShippingInfo(body.shipping),
    })
    reply.status(200).send(result)
  }

  async previewQuickBuyHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as { productId: string; quantity: number; shipping: ShippingBody }
    const result = await this.previewOrderQuickBuy.execute({
      productId: body.productId,
      quantity: body.quantity,
      shipping: toShippingInfo(body.shipping),
    })
    reply.status(200).send(result)
  }

  async confirmFromCartHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as { shipping: ShippingBody }
    const result = await this.createOrderFromCart.execute({
      accountId: request.user!.sub,
      shipping: toShippingInfo(body.shipping),
    })
    reply.status(201).send(result)
  }

  async confirmQuickBuyHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const body = request.body as { productId: string; quantity: number; shipping: ShippingBody }
    const result = await this.createOrderQuickBuy.execute({
      accountId: request.user!.sub,
      productId: body.productId,
      quantity: body.quantity,
      shipping: toShippingInfo(body.shipping),
    })
    reply.status(201).send(result)
  }

  async listOrdersHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const query = request.query as { page?: string; pageSize?: string }
    const user = request.user!
    const isAdmin = user.role === 'ADMIN'

    const result = await this.getOrders.execute({
      accountId: isAdmin ? undefined : user.sub,
      page: Number(query.page ?? 1),
      pageSize: Number(query.pageSize ?? 10),
    })
    reply.status(200).send(result)
  }

  async getOrderHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string }
    const user = request.user!
    const isAdmin = user.role === 'ADMIN'

    const result = await this.getOrderById.execute({
      orderId: id,
      requesterId: user.sub,
      isAdmin,
    })
    reply.status(200).send(result)
  }

  async cancelOrderHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string }
    const user = request.user!
    const isAdmin = user.role === 'ADMIN'

    const result = await this.cancelOrder.execute({
      orderId: id,
      requesterId: user.sub,
      isAdmin,
    })
    reply.status(200).send(result)
  }

  async updateStatusHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string }
    const body = request.body as { status: OrderStatus; note?: string }

    const result = await this.updateOrderStatus.execute({
      orderId: id,
      newStatus: body.status,
      adminId: request.user!.sub,
      note: body.note,
    })
    reply.status(200).send(result)
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { GetCart } from '../../application/use-cases/GetCart'
import { AddItem } from '../../application/use-cases/AddItem'
import { UpdateItemQuantity } from '../../application/use-cases/UpdateItemQuantity'
import { RemoveItem } from '../../application/use-cases/RemoveItem'
import { ClearCart } from '../../application/use-cases/ClearCart'
import { AppError } from '@shared/errors/AppError'

export class CartController {
  constructor(
    private readonly getCart: GetCart,
    private readonly addItem: AddItem,
    private readonly updateItemQuantity: UpdateItemQuantity,
    private readonly removeItem: RemoveItem,
    private readonly clearCart: ClearCart,
  ) {}

  async getHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.getCart.execute(request.user!.sub)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async addItemHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId, quantity } = request.body as { productId: string; quantity: number }
      const result = await this.addItem.execute({
        accountId: request.user!.sub,
        productId,
        quantity,
      })
      reply.status(201).send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async updateItemHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId } = request.params as { productId: string }
      const { quantity } = request.body as { quantity: number }
      const result = await this.updateItemQuantity.execute({
        accountId: request.user!.sub,
        productId,
        quantity,
      })
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async removeItemHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId } = request.params as { productId: string }
      const result = await this.removeItem.execute({
        accountId: request.user!.sub,
        productId,
      })
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async clearHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.clearCart.execute(request.user!.sub)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  private handleError(err: unknown, reply: FastifyReply): void {
    if (err instanceof AppError) {
      reply.status(err.statusCode).send({ error: err.code ?? 'ERROR', message: err.message })
      return
    }
    reply.status(500).send({ error: 'INTERNAL_ERROR', message: 'Internal server error' })
  }
}

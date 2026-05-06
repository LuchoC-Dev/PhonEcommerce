import type { FastifyRequest, FastifyReply } from 'fastify'
import type { GetStock } from '../../application/use-cases/GetStock'
import type { AdjustStock } from '../../application/use-cases/AdjustStock'
import type { GetMovements } from '../../application/use-cases/GetMovements'
import { AppError } from '@shared/errors/AppError'

export class StockController {
  constructor(
    private readonly getStock: GetStock,
    private readonly adjustStock: AdjustStock,
    private readonly getMovements: GetMovements,
  ) {}

  async getStockHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId } = request.params as { productId: string }
      const result = await this.getStock.execute(productId)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async adjustStockHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId } = request.params as { productId: string }
      const { delta, type, reason } = request.body as {
        delta: number
        type: 'RESTOCK' | 'ADJUSTMENT'
        reason?: string
      }
      const result = await this.adjustStock.execute({
        productId,
        delta,
        type,
        reason,
        createdBy: request.user!.sub,
      })
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async getMovementsHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { productId } = request.params as { productId: string }
      const { page = 1, pageSize = 20 } = request.query as { page?: number; pageSize?: number }
      const result = await this.getMovements.execute({ productId, page, pageSize })
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

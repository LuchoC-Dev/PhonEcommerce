import { FastifyRequest, FastifyReply } from 'fastify'
import { GetBrands } from '../../application/use-cases/GetBrands'
import { CreateBrand } from '../../application/use-cases/CreateBrand'
import { UpdateBrand } from '../../application/use-cases/UpdateBrand'
import { DeleteBrand } from '../../application/use-cases/DeleteBrand'
import { AppError } from '@shared/errors/AppError'

export class BrandController {
  constructor(
    private readonly getBrands: GetBrands,
    private readonly createBrand: CreateBrand,
    private readonly updateBrand: UpdateBrand,
    private readonly deleteBrand: DeleteBrand,
  ) {}

  async listHandler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.getBrands.execute()
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async createHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { name: string; slug: string; logo?: string }
      const result = await this.createBrand.execute(body)
      reply.status(201).send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async updateHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as { name?: string; slug?: string; logo?: string }
      const result = await this.updateBrand.execute(id, body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async deleteHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { id } = request.params as { id: string }
      await this.deleteBrand.execute(id)
      reply.status(204).send()
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

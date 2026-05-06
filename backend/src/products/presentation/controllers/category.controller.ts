import { FastifyRequest, FastifyReply } from 'fastify'
import { GetCategories } from '../../application/use-cases/GetCategories'
import { CreateCategory } from '../../application/use-cases/CreateCategory'
import { UpdateCategory } from '../../application/use-cases/UpdateCategory'
import { DeleteCategory } from '../../application/use-cases/DeleteCategory'
import { AppError } from '@shared/errors/AppError'

export class CategoryController {
  constructor(
    private readonly getCategories: GetCategories,
    private readonly createCategory: CreateCategory,
    private readonly updateCategory: UpdateCategory,
    private readonly deleteCategory: DeleteCategory,
  ) {}

  async listHandler(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.getCategories.execute()
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async createHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { name: string; slug: string; parentId?: string }
      const result = await this.createCategory.execute(body)
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
      const body = request.body as { name?: string; slug?: string; parentId?: string | null }
      const result = await this.updateCategory.execute(id, body)
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
      await this.deleteCategory.execute(id)
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

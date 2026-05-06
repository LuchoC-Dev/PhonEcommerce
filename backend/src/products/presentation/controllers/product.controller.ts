import { FastifyRequest, FastifyReply } from 'fastify'
import { GetProducts } from '../../application/use-cases/GetProducts'
import { GetProductBySlug } from '../../application/use-cases/GetProductBySlug'
import { CreateProduct } from '../../application/use-cases/CreateProduct'
import { UpdateProduct } from '../../application/use-cases/UpdateProduct'
import { DeleteProduct } from '../../application/use-cases/DeleteProduct'
import { AppError } from '@shared/errors/AppError'
import { ProductStatus } from '../../domain/entities/product.entity'

export class ProductController {
  constructor(
    private readonly getProducts: GetProducts,
    private readonly getProductBySlug: GetProductBySlug,
    private readonly createProduct: CreateProduct,
    private readonly updateProduct: UpdateProduct,
    private readonly deleteProduct: DeleteProduct,
  ) {}

  async listHandler(
    request: FastifyRequest<{
      Querystring: {
        categoryId?: string
        brandId?: string
        minPrice?: string
        maxPrice?: string
        status?: string
        search?: string
        page?: string
        pageSize?: string
      }
    }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const q = request.query
      const result = await this.getProducts.execute({
        categoryId: q.categoryId,
        brandId: q.brandId,
        minPrice: q.minPrice != null ? Number(q.minPrice) : undefined,
        maxPrice: q.maxPrice != null ? Number(q.maxPrice) : undefined,
        status: q.status as ProductStatus | undefined,
        search: q.search,
        page: q.page != null ? Number(q.page) : undefined,
        pageSize: q.pageSize != null ? Number(q.pageSize) : undefined,
      })
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async getBySlugHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const { slug } = request.params as { slug: string }
      const result = await this.getProductBySlug.execute(slug)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async createHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as {
        name: string
        slug: string
        description?: string
        price: number
        stock?: number
        status?: ProductStatus
        brandId: string
        categoryId: string
        images?: { url: string; altText?: string; position?: number }[]
      }
      const result = await this.createProduct.execute(body)
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
      const body = request.body as {
        name?: string
        slug?: string
        description?: string
        price?: number
        stock?: number
        status?: ProductStatus
        brandId?: string
        categoryId?: string
        images?: { url: string; altText?: string; position?: number }[]
      }
      const result = await this.updateProduct.execute(id, body)
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
      await this.deleteProduct.execute(id)
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

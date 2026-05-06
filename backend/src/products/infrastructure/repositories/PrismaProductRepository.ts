import { PrismaClient, Prisma } from '@prisma/client'
import {
  IProductRepository,
  GetProductsFilters,
  CreateProductData,
  UpdateProductData,
} from '../../domain/repositories/product.repository'
import { Product, ProductWithRelations, PaginatedProducts } from '../../domain/entities/product.entity'

const productWithRelations = {
  images: { orderBy: { position: 'asc' as const } },
  brand: { select: { id: true, name: true, slug: true } },
  category: { select: { id: true, name: true, slug: true } },
}

function toNumber(value: Prisma.Decimal | null | undefined): number {
  if (value == null) return 0
  return Number(value)
}

function mapProduct(raw: {
  id: string
  name: string
  slug: string
  description: string | null
  price: Prisma.Decimal
  stock: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  brandId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date
}): Product {
  return { ...raw, price: toNumber(raw.price) }
}

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters: GetProductsFilters): Promise<PaginatedProducts> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 20
    const skip = (page - 1) * pageSize

    const where: Prisma.ProductWhereInput = {}
    if (filters.categoryId) where.categoryId = filters.categoryId
    if (filters.brandId) where.brandId = filters.brandId
    if (filters.status) where.status = filters.status
    if (filters.minPrice != null || filters.maxPrice != null) {
      where.price = {}
      if (filters.minPrice != null) where.price.gte = filters.minPrice
      if (filters.maxPrice != null) where.price.lte = filters.maxPrice
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const [total, rows] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: productWithRelations,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const data = rows.map((r) => ({ ...mapProduct(r), images: r.images, brand: r.brand, category: r.category }))

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    const raw = await this.prisma.product.findUnique({
      where: { slug },
      include: productWithRelations,
    })
    if (!raw) return null
    return { ...mapProduct(raw), images: raw.images, brand: raw.brand, category: raw.category }
  }

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({ where: { id } })
    if (!raw) return null
    return mapProduct(raw)
  }

  async create(data: CreateProductData): Promise<ProductWithRelations> {
    const { images, ...rest } = data
    const raw = await this.prisma.product.create({
      data: {
        ...rest,
        stock: data.stock ?? 0,
        status: data.status ?? 'DRAFT',
        images: images
          ? { create: images.map((img, i) => ({ ...img, position: img.position ?? i })) }
          : undefined,
      },
      include: productWithRelations,
    })
    return { ...mapProduct(raw), images: raw.images, brand: raw.brand, category: raw.category }
  }

  async update(id: string, data: UpdateProductData): Promise<ProductWithRelations> {
    const { images, ...rest } = data
    const raw = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(images !== undefined && {
          images: {
            deleteMany: {},
            create: images.map((img, i) => ({ ...img, position: img.position ?? i })),
          },
        }),
      },
      include: productWithRelations,
    })
    return { ...mapProduct(raw), images: raw.images, brand: raw.brand, category: raw.category }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } })
  }
}

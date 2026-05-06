import type { PrismaClient } from '@prisma/client'
import type { IStockRepository, CreateMovementInput, FindMovementsOptions } from '../../domain/repositories/stock.repository'
import type { StockLevel, StockMovement, StockMovementPage } from '../../domain/entities/stock.entity'

function toMovement(raw: {
  id: string
  productId: string
  type: string
  quantity: number
  stockBefore: number
  stockAfter: number
  reason: string | null
  createdBy: string | null
  createdAt: Date
}): StockMovement {
  return {
    id: raw.id,
    productId: raw.productId,
    type: raw.type as StockMovement['type'],
    quantity: raw.quantity,
    stockBefore: raw.stockBefore,
    stockAfter: raw.stockAfter,
    reason: raw.reason,
    createdBy: raw.createdBy,
    createdAt: raw.createdAt,
  }
}

export class PrismaStockRepository implements IStockRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByProductId(productId: string): Promise<StockLevel | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true },
    })
    if (!product) return null
    return { productId: product.id, quantity: product.stock }
  }

  async applyMovement(input: CreateMovementInput): Promise<StockMovement> {
    const { productId, type, quantity, stockBefore, stockAfter, reason, createdBy } = input

    const [, movement] = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: productId },
        data: { stock: stockAfter },
      }),
      this.prisma.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          stockBefore,
          stockAfter,
          reason: reason ?? null,
          createdBy: createdBy ?? null,
        },
      }),
    ])

    return toMovement(movement)
  }

  async findMovements(productId: string, options: FindMovementsOptions): Promise<StockMovementPage> {
    const { page, pageSize } = options
    const skip = (page - 1) * pageSize

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.stockMovement.count({ where: { productId } }),
      this.prisma.stockMovement.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
    ])

    return {
      data: rows.map(toMovement),
      total,
      page,
      pageSize,
    }
  }
}

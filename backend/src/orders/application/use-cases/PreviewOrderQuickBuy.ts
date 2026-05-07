import type { OrderPreview, ShippingInfo } from '../../domain/entities/order.entity'
import { NotFoundError } from '@shared/errors/AppError'
import { PrismaClient } from '@prisma/client'

export interface PreviewOrderQuickBuyInput {
  productId: string
  quantity: number
  shipping: ShippingInfo
}

/**
 * Builds a checkout preview for a single-product quick buy using the current product price.
 * Does NOT write to the database — use CreateOrderQuickBuy to confirm.
 *
 * @throws {NotFoundError} if the product does not exist or is not published.
 */
export class PreviewOrderQuickBuy {
  constructor(private readonly prisma: PrismaClient) {}

  async execute(input: PreviewOrderQuickBuyInput): Promise<OrderPreview> {
    const { productId, quantity, shipping } = input

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, status: true },
    })

    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundError('Product')
    }

    const unitPrice = Number(product.price)
    const subtotal = unitPrice * quantity
    const totalAmount = subtotal

    return {
      items: [
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice,
          subtotal,
        },
      ],
      totalAmount,
      shipping,
    }
  }
}

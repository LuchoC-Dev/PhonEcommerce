import { PrismaClient, Prisma } from '@prisma/client'
import { ICartRepository } from '../../domain/repositories/cart.repository'
import { Cart, CartItem, CartWithItems, CartItemWithProduct } from '../../domain/entities/cart.entity'

function toNumber(value: Prisma.Decimal): number {
  return Number(value)
}

export class PrismaCartRepository implements ICartRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByAccountId(accountId: string): Promise<Cart | null> {
    return this.prisma.cart.findUnique({ where: { accountId } })
  }

  async findWithItems(accountId: string): Promise<CartWithItems | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { accountId },
      include: {
        items: { orderBy: { createdAt: 'asc' as const } },
      },
    })

    if (!cart) return null

    if (cart.items.length === 0) {
      return { ...cart, items: [] }
    }

    const productIds = cart.items.map((i) => i.productId)
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          select: { url: true, altText: true },
          orderBy: { position: 'asc' as const },
          take: 1,
        },
      },
    })
    const productMap = new Map(products.map((p) => [p.id, p]))

    const items: CartItemWithProduct[] = cart.items.map((item) => {
      const product = productMap.get(item.productId)
      return {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtAdd: toNumber(item.priceAtAdd),
        currentPrice: product ? toNumber(product.price) : toNumber(item.priceAtAdd),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: product
          ? { id: product.id, name: product.name, slug: product.slug, images: product.images }
          : { id: item.productId, name: '', slug: '', images: [] },
      }
    })

    return {
      id: cart.id,
      accountId: cart.accountId,
      expiresAt: cart.expiresAt,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items,
    }
  }

  async create(accountId: string, expiresAt: Date): Promise<Cart> {
    return this.prisma.cart.create({ data: { accountId, expiresAt } })
  }

  async resetExpiry(cartId: string, expiresAt: Date): Promise<void> {
    await this.prisma.cart.update({ where: { id: cartId }, data: { expiresAt } })
  }

  async clearItems(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } })
  }

  async findItem(cartId: string, productId: string): Promise<CartItem | null> {
    const raw = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    })
    if (!raw) return null
    return { ...raw, priceAtAdd: toNumber(raw.priceAtAdd) }
  }

  async upsertItem(
    cartId: string,
    productId: string,
    quantity: number,
    priceAtAdd: number,
  ): Promise<CartItem> {
    const existing = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    })

    if (existing) {
      const raw = await this.prisma.cartItem.update({
        where: { cartId_productId: { cartId, productId } },
        data: { quantity: existing.quantity + quantity },
      })
      return { ...raw, priceAtAdd: toNumber(raw.priceAtAdd) }
    }

    const raw = await this.prisma.cartItem.create({
      data: { cartId, productId, quantity, priceAtAdd },
    })
    return { ...raw, priceAtAdd: toNumber(raw.priceAtAdd) }
  }

  async updateItemQuantity(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    const raw = await this.prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    })
    return { ...raw, priceAtAdd: toNumber(raw.priceAtAdd) }
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    })
  }
}

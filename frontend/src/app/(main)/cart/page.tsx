'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCartStore, selectItemCount, selectTotal } from '@features/cart/store/cart.store'
import { useAuthStore } from '@features/auth/store/auth.store'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount)
}

export default function CartPage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const items = useCartStore((s) => s.items)
  const isLoading = useCartStore((s) => s.isLoading)
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const itemCount = useCartStore(selectItemCount)
  const total = useCartStore(selectTotal)

  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <svg className="w-16 h-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9Z" />
        </svg>
        <h1 className="font-[--font-display] text-2xl font-bold text-text">Iniciá sesión para ver tu carrito</h1>
        <p className="text-text-muted max-w-sm">Necesitás una cuenta para guardar productos en tu carrito.</p>
        <Link
          href="/login"
          className="mt-2 inline-flex items-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <svg className="w-16 h-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <h1 className="font-[--font-display] text-2xl font-bold text-text">Tu carrito está vacío</h1>
        <p className="text-text-muted">Explorá nuestro catálogo y encontrá tu próximo teléfono.</p>
        <Link
          href="/catalog"
          className="mt-2 inline-flex items-center px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
        >
          Explorar catálogo
        </Link>
      </div>
    )
  }

  async function handleClearCart() {
    setIsClearing(true)
    await clearCart()
    setIsClearing(false)
    setShowConfirmClear(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[--font-display] text-3xl font-bold text-text">
          Carrito
          <span className="ml-3 text-lg font-normal text-text-muted">
            ({itemCount} {itemCount === 1 ? 'ítem' : 'ítems'})
          </span>
        </h1>
        <button
          onClick={() => setShowConfirmClear(true)}
          className="text-sm text-text-muted hover:text-danger transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de ítems */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const hasPriceChange = item.currentPrice !== item.priceAtAdd
            return (
              <div
                key={item.productId}
                className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
              >
                {/* Imagen */}
                <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    ) : (
                      <svg className="w-10 h-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
                      </svg>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-medium text-text hover:text-primary-light transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>

                  {hasPriceChange && (
                    <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      El precio cambió desde que lo agregaste
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    {/* Cantidad */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) removeItem(item.productId)
                          else updateItem(item.productId, item.quantity - 1)
                        }}
                        disabled={isLoading}
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors disabled:opacity-40"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-text select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.productId, item.quantity + 1)}
                        disabled={isLoading}
                        className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      {hasPriceChange && (
                        <p className="text-xs text-text-subtle line-through">
                          {formatPrice(item.priceAtAdd * item.quantity)}
                        </p>
                      )}
                      <p className="font-semibold text-text">
                        {formatPrice(item.currentPrice * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-text-muted">
                          {formatPrice(item.currentPrice)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Eliminar */}
                <button
                  onClick={() => removeItem(item.productId)}
                  disabled={isLoading}
                  className="self-start p-2 text-text-subtle hover:text-danger transition-colors disabled:opacity-40 rounded-lg hover:bg-border"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-card border border-border p-6">
            <h2 className="font-[--font-display] text-lg font-semibold text-text mb-4">
              Resumen del pedido
            </h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal ({itemCount} {itemCount === 1 ? 'ítem' : 'ítems'})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Envío</span>
                <span className="text-success">Gratis</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold text-text">
                <span>Total</span>
                <span className="text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/checkout')}
            >
              Proceder al checkout
            </Button>

            <Link
              href="/catalog"
              className="mt-3 block text-center text-sm text-text-muted hover:text-text transition-colors"
            >
              ← Continuar comprando
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para vaciar */}
      <Modal
        open={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        title="Vaciar carrito"
        description="¿Estás seguro? Se eliminarán todos los productos de tu carrito."
        size="sm"
      >
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={() => setShowConfirmClear(false)}
            disabled={isClearing}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleClearCart}
            loading={isClearing}
          >
            Sí, vaciar
          </Button>
        </div>
      </Modal>
    </div>
  )
}

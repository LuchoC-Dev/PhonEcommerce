'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore, selectItemCount, selectTotal } from '../store/cart.store'
import { formatPrice } from '@shared/utils'

export function CartSlideOver() {
  const isOpen = useCartStore((s) => s.isOpen)
  const close = useCartStore((s) => s.close)
  const items = useCartStore((s) => s.items)
  const isLoading = useCartStore((s) => s.isLoading)
  const updateItem = useCartStore((s) => s.updateItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const itemCount = useCartStore(selectItemCount)
  const total = useCartStore(selectTotal)
  const panelRef = useRef<HTMLDivElement>(null)

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Carrito de compras">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative flex flex-col w-full max-w-md bg-bg border-l border-border shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-display text-lg font-semibold text-text">
              Carrito
            </h2>
            <p className="text-sm text-text-muted">
              {itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}
            </p>
          </div>
          <button
            onClick={close}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text hover:bg-border transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
              <svg className="w-12 h-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              <p className="text-text-muted text-sm">Tu carrito está vacío</p>
              <Link
                href="/catalog"
                onClick={close}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Explorar catálogo →
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const hasPriceChange = item.currentPrice !== item.priceAtAdd
                return (
                  <li key={item.productId} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                    {/* Imagen */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-surface flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3m-3 3.75h3" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={close}
                        className="text-sm font-medium text-text hover:text-primary-light transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {hasPriceChange && (
                        <p className="text-xs text-amber-400 mt-0.5">
                          Precio actualizado
                        </p>
                      )}

                      {/* Controles de cantidad */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeItem(item.productId)
                              } else {
                                updateItem(item.productId, item.quantity - 1)
                              }
                            }}
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors disabled:opacity-40 cursor-pointer text-sm"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-text select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.productId, item.quantity + 1)}
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text hover:bg-border transition-colors disabled:opacity-40 cursor-pointer text-sm"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-semibold text-text">
                          {formatPrice(item.currentPrice * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      disabled={isLoading}
                      className="flex-shrink-0 self-center p-1 text-text-subtle hover:text-danger transition-colors disabled:opacity-40 cursor-pointer"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer con total y acciones */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{itemCount} {itemCount === 1 ? 'ítem' : 'ítems'}</span>
              <span className="font-semibold text-lg text-text">{formatPrice(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={close}
              className="block w-full text-center py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
            >
              Ir al checkout
            </Link>

            <Link
              href="/cart"
              onClick={close}
              className="block w-full text-center py-2 px-4 text-sm text-text-muted hover:text-text transition-colors"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

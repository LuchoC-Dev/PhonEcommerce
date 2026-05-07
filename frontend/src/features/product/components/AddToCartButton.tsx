'use client'

import { useState } from 'react'
import { Button } from '@shared/components/Button'
import { useAddToCart } from '../hooks/useAddToCart'

interface AddToCartButtonProps {
  productId: string
  stock: number
}

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { status, add } = useAddToCart()

  const outOfStock = stock === 0
  const isLoading = status === 'loading'
  const isSuccess = status === 'success'
  const isError = status === 'error'

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1))
  }

  function increment() {
    setQuantity((q) => Math.min(stock, q + 1))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Selector de cantidad */}
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#9090a0]">Cantidad</span>
          <div className="flex items-center border border-[#2a2a35] rounded-xl overflow-hidden">
            <button
              onClick={decrement}
              disabled={quantity <= 1 || isLoading}
              className="w-9 h-9 flex items-center justify-center text-[#9090a0] hover:text-white hover:bg-[#2a2a35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium text-white select-none">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= stock || isLoading}
              className="w-9 h-9 flex items-center justify-center text-[#9090a0] hover:text-white hover:bg-[#2a2a35] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <span className="text-xs text-[#6b6b7a]">{stock} disponibles</span>
        </div>
      )}

      {/* Botón */}
      <Button
        size="lg"
        variant={outOfStock ? 'secondary' : isSuccess ? 'secondary' : isError ? 'danger' : 'primary'}
        disabled={outOfStock || isLoading || isSuccess}
        loading={isLoading}
        className="w-full"
        onClick={() => add(productId, quantity)}
      >
        {outOfStock
          ? 'Sin stock'
          : isSuccess
          ? '✓ Agregado al carrito'
          : isError
          ? 'Error — intentá de nuevo'
          : 'Agregar al carrito'}
      </Button>
    </div>
  )
}

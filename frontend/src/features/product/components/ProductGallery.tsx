'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ProductImage } from '@features/catalog/types/catalog.types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

function resolveImageUrl(url: string): string {
  if (url.startsWith('http')) return url
  const base = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1').replace('/api/v1', '')
  return `${base}${url}`
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.position - b.position)
  const [activeIndex, setActiveIndex] = useState(0)

  const active = sorted[activeIndex]

  function prev() {
    setActiveIndex((i) => (i === 0 ? sorted.length - 1 : i - 1))
  }

  function next() {
    setActiveIndex((i) => (i === sorted.length - 1 ? 0 : i + 1))
  }

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-[#1e1e22] rounded-2xl flex items-center justify-center text-[#6b6b7a]">
        Sin imagen
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-[#1e1e22] rounded-2xl overflow-hidden group">
        <Image
          src={resolveImageUrl(active.url)}
          alt={active.altText ?? productName}
          fill
          unoptimized
          className="object-contain p-6 transition-opacity duration-200"
        />

        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0a]/70 border border-[#2a2a35] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#6366f1]"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0a]/70 border border-[#2a2a35] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-[#6366f1]"
            >
              ›
            </button>
          </>
        )}

        {sorted.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Imagen ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-[#6366f1]' : 'bg-[#4a4a58]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? 'border-[#6366f1]'
                  : 'border-[#2a2a35] hover:border-[#4a4a58]'
              }`}
            >
              <Image
                src={resolveImageUrl(img.url)}
                alt={img.altText ?? `${productName} ${i + 1}`}
                fill
                unoptimized
                className="object-contain p-1 bg-[#1e1e22]"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

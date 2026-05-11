'use client'

import { Button } from '@shared/components'
import type { PaginationMeta } from '../types/catalog.types'

interface PaginationProps {
  meta: PaginationMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, pageSize } = meta

  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-text-subtle">
        {from}–{to} de {total} productos
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ← Anterior
        </Button>
        <span className="text-sm text-text-muted min-w-[5rem] text-center">
          {page} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  )
}

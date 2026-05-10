'use client'

import { Badge } from '@shared/components/Badge'
import { Button } from '@shared/components/Button'
import { Spinner } from '@shared/components/Spinner'
import type { StockMovement } from '../../types/admin.types'

interface StockMovementListProps {
  movements: StockMovement[]
  loading: boolean
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

const movementTypeConfig: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' }> = {
  RESTOCK: { label: 'Entrada', variant: 'success' },
  SALE: { label: 'Venta', variant: 'danger' },
  ADJUSTMENT: { label: 'Corrección', variant: 'warning' },
  RETURN: { label: 'Devolución', variant: 'info' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StockMovementList({
  movements,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
}: StockMovementListProps) {
  if (loading) {
    return <div className="flex justify-center py-8"><Spinner size="lg" /></div>
  }

  if (movements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#94a3b8]">No hay movimientos registrados</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e1e2e] text-[#94a3b8] text-left">
              <th className="py-3 px-4 font-medium">Tipo</th>
              <th className="py-3 px-4 font-medium">Delta</th>
              <th className="py-3 px-4 font-medium">Razón</th>
              <th className="py-3 px-4 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => {
              const config = movementTypeConfig[movement.type] ?? { label: movement.type, variant: 'default' as const }
              return (
                <tr key={movement.id} className="border-b border-[#1e1e2e] hover:bg-[#1e1e2e]/50 transition-colors">
                  <td className="py-3 px-4">
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </td>
                  <td className={`py-3 px-4 font-medium ${movement.delta > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {movement.delta > 0 ? `+${movement.delta}` : movement.delta}
                  </td>
                  <td className="py-3 px-4 text-[#94a3b8]">{movement.reason}</td>
                  <td className="py-3 px-4 text-[#94a3b8]">{formatDate(movement.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#1e1e2e]">
        <p className="text-sm text-[#94a3b8]">{total} movimiento{total !== 1 ? 's' : ''}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </Button>
          <span className="flex items-center px-3 text-sm text-[#94a3b8]">
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
    </div>
  )
}

export { StockMovementList }
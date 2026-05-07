'use client'

import { useState } from 'react'
import { Input } from '@shared/components'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, setLocal] = useState(value)

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onChange(local)
  }

  function handleBlur() {
    onChange(local)
  }

  return (
    <Input
      placeholder="Buscar productos..."
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  )
}

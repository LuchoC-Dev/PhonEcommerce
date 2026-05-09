'use client'

import { useState, useCallback } from 'react'
import { profileService } from '../services/profile.service'
import type { Address, AddressPayload } from '../types/profile.types'

export function useAddresses(
  addresses: Address[],
  setAddresses: (addresses: Address[]) => void
) {
  const [isLoading, setIsLoading] = useState(false)

  const addAddress = useCallback(
    async (payload: AddressPayload) => {
      setIsLoading(true)
      try {
        const created = await profileService.addAddress(payload)
        if (created.isDefault) {
          setAddresses([created, ...addresses.map((a) => ({ ...a, isDefault: false }))])
        } else {
          setAddresses([created, ...addresses])
        }
        return created
      } finally {
        setIsLoading(false)
      }
    },
    [addresses, setAddresses]
  )

  const updateAddress = useCallback(
    async (id: string, payload: Partial<AddressPayload>) => {
      setIsLoading(true)
      try {
        const updated = await profileService.updateAddress(id, payload)
        setAddresses(
          addresses.map((a) => {
            if (a.id === id) return updated
            if (updated.isDefault) return { ...a, isDefault: false }
            return a
          })
        )
        return updated
      } finally {
        setIsLoading(false)
      }
    },
    [addresses, setAddresses]
  )

  const deleteAddress = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        await profileService.deleteAddress(id)
        setAddresses(addresses.filter((a) => a.id !== id))
      } finally {
        setIsLoading(false)
      }
    },
    [addresses, setAddresses]
  )

  return { addAddress, updateAddress, deleteAddress, isLoading }
}

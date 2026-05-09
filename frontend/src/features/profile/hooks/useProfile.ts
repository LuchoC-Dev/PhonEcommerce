'use client'

import { useState, useEffect, useCallback } from 'react'
import { profileService } from '../services/profile.service'
import type { Profile, Address, UpdateProfilePayload } from '../types/profile.types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => {
        setProfile(data)
        setAddresses(data.addresses)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Error al cargar el perfil'
        setError(message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const updateProfile = useCallback(async (payload: UpdateProfilePayload) => {
    const filtered = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== '' && v !== undefined)
    ) as UpdateProfilePayload
    const updated = await profileService.updateProfile(filtered)
    setProfile((prev) => (prev ? { ...prev, ...updated } : null))
    return updated
  }, [])

  return { profile, addresses, setAddresses, isLoading, error, updateProfile }
}

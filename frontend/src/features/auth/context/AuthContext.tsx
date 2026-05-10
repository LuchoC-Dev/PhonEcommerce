'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import type { AxiosError } from 'axios'
import api from '@shared/lib/api'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

interface AuthContextValue {
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const interceptorRef = useRef<number | null>(null)
  const initialized = useRef(false)
  const logout = () => useAuthStore.getState().logout()

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const store = useAuthStore.getState()

    async function loadUser() {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        store.setLoading(false)
        return
      }
      try {
        const user = await authService.me()
        store.setUser(user)
      } catch {
        store.logout()
      } finally {
        store.setLoading(false)
      }
    }

    interceptorRef.current = api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as typeof error.config & { _retry?: boolean }
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true
          const storedRefresh = localStorage.getItem('refreshToken')
          if (storedRefresh) {
            try {
              const { accessToken, refreshToken } = await authService.refresh(storedRefresh)
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('refreshToken', refreshToken)
              if (original.headers) {
                original.headers.Authorization = `Bearer ${accessToken}`
              }
              return api(original)
            } catch {
              useAuthStore.getState().logout()
            }
          } else {
            useAuthStore.getState().logout()
          }
        }
        return Promise.reject(error)
      }
    )

    loadUser()

    return () => {
      if (interceptorRef.current !== null) {
        api.interceptors.response.eject(interceptorRef.current)
      }
    }
  }, [])

  return <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

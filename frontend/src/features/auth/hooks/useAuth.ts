'use client'

import { useRouter } from 'next/navigation'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'
import type { LoginPayload, RegisterPayload } from '../types/auth.types'

export function useAuth() {
  const router = useRouter()
  const { setUser, logout: storeLogout } = useAuthStore()

  async function login(payload: LoginPayload) {
    const { account, accessToken, refreshToken } = await authService.login(payload)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(account)
  }

  async function register(payload: RegisterPayload) {
    const { account, accessToken, refreshToken } = await authService.register(payload)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setUser(account)
  }

  function logout() {
    storeLogout()
    router.push('/login')
  }

  return { login, register, logout }
}

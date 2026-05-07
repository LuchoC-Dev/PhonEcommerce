import api from '@shared/lib/api'
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '../types/auth.types'

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    return data
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>('/auth/refresh', { refreshToken })
    return data
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/auth/forgot-password', payload)
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload)
  },
}

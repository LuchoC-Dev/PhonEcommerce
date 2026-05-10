export interface User {
  id: string
  email: string
  username: string
  role: 'USER' | 'ADMIN'
  permissions: string[]
  isActive: boolean
  createdAt: string
}

export interface LoginPayload {
  emailOrUsername: string
  password: string
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  account: User
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

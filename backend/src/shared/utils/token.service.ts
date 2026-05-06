import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Role } from '@prisma/client'

export interface JwtPayload {
  sub: string       // accountId
  email: string
  username: string
  role: Role
  permissions: string[]
}

export interface ITokenService {
  generateAccessToken(payload: JwtPayload): string
  generateRefreshToken(): string
  verifyAccessToken(token: string): JwtPayload
}

export class JwtTokenService implements ITokenService {
  private readonly secret: string
  private readonly accessTokenTtl = '15m'

  constructor() {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET env variable is required')
    this.secret = secret
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenTtl,
      issuer: 'imnotphound',
    })
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
  }

  verifyAccessToken(token: string): JwtPayload {
    const decoded = jwt.verify(token, this.secret, {
      issuer: 'imnotphound',
    }) as JwtPayload
    return decoded
  }
}

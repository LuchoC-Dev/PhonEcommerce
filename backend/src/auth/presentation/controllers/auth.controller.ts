import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUser } from '../../application/use-cases/RegisterUser'
import { LoginUser } from '../../application/use-cases/LoginUser'
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshToken'
import { GetMe } from '../../application/use-cases/GetMe'
import { ForgotPassword } from '../../application/use-cases/ForgotPassword'
import { ResetPassword } from '../../application/use-cases/ResetPassword'
import { AppError } from '@shared/errors/AppError'

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getMe: GetMe,
    private readonly forgotPassword: ForgotPassword,
    private readonly resetPassword: ResetPassword,
  ) {}

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as {
        email: string
        username: string
        password: string
        name: string
      }
      const result = await this.registerUser.execute(body)
      reply.status(201).send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { emailOrUsername: string; password: string }
      const result = await this.loginUser.execute(body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { refreshToken: string }
      const result = await this.refreshTokenUseCase.execute(body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const accountId = request.user!.sub
      const result = await this.getMe.execute(accountId)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async forgotPasswordHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { email: string }
      const result = await this.forgotPassword.execute(body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async resetPasswordHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const body = request.body as { token: string; newPassword: string }
      await this.resetPassword.execute(body)
      reply.send({ message: 'Password updated successfully' })
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  private handleError(err: unknown, reply: FastifyReply): void {
    if (err instanceof AppError) {
      reply.status(err.statusCode).send({ error: err.code ?? 'ERROR', message: err.message })
      return
    }
    console.error('[AuthController]', err)
    const message = process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : 'Internal server error'
    reply.status(500).send({ error: 'INTERNAL_ERROR', message })
  }
}

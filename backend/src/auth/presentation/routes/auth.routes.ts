import { FastifyInstance } from 'fastify'
import { AuthController } from '../controllers/auth.controller'
import { authenticate } from '@shared/middlewares/auth.middleware'
import { RegisterUser } from '../../application/use-cases/RegisterUser'
import { LoginUser } from '../../application/use-cases/LoginUser'
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshToken'
import { GetMe } from '../../application/use-cases/GetMe'
import { ForgotPassword } from '../../application/use-cases/ForgotPassword'
import { ResetPassword } from '../../application/use-cases/ResetPassword'
import { PrismaAuthRepository } from '../../infrastructure/repositories/PrismaAuthRepository'
import { PrismaUserRepository } from '../../../users/infrastructure/repositories/PrismaUserRepository'
import { BcryptHashService } from '@shared/utils/hash.service'
import { JwtTokenService } from '@shared/utils/token.service'
import { prisma } from '@shared/database/prisma'

export async function authRoutes(app: FastifyInstance): Promise<void> {
  // Compose dependencies
  const repository = new PrismaAuthRepository(prisma)
  const userRepository = new PrismaUserRepository(prisma)
  const hashService = new BcryptHashService()
  const tokenService = new JwtTokenService()

  const controller = new AuthController(
    new RegisterUser(repository, userRepository, hashService, tokenService),
    new LoginUser(repository, hashService, tokenService),
    new RefreshTokenUseCase(repository, tokenService),
    new GetMe(repository),
    new ForgotPassword(repository, tokenService),
    new ResetPassword(repository, hashService),
  )

  // POST /api/v1/auth/register
  app.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'username', 'password', 'name'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3, maxLength: 30 },
          password: { type: 'string', minLength: 8 },
          name: { type: 'string', minLength: 1 },
        },
      },
    },
    handler: controller.register.bind(controller),
  })

  // POST /api/v1/auth/login
  app.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['emailOrUsername', 'password'],
        properties: {
          emailOrUsername: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
    handler: controller.login.bind(controller),
  })

  // POST /api/v1/auth/refresh
  app.post('/refresh', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
    handler: controller.refresh.bind(controller),
  })

  // GET /api/v1/auth/me
  app.get('/me', {
    preHandler: authenticate,
    handler: controller.me.bind(controller),
  })

  // POST /api/v1/auth/forgot-password
  app.post('/forgot-password', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
    handler: controller.forgotPasswordHandler.bind(controller),
  })

  // POST /api/v1/auth/reset-password
  app.post('/reset-password', {
    schema: {
      body: {
        type: 'object',
        required: ['token', 'newPassword'],
        properties: {
          token: { type: 'string' },
          newPassword: { type: 'string', minLength: 8 },
        },
      },
    },
    handler: controller.resetPasswordHandler.bind(controller),
  })
}

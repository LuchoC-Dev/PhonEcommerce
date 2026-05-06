import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/user.controller'
import { authenticate } from '@shared/middlewares/auth.middleware'
import { GetProfile } from '../../application/use-cases/GetProfile'
import { UpdateProfile } from '../../application/use-cases/UpdateProfile'
import { AddAddress } from '../../application/use-cases/AddAddress'
import { UpdateAddress } from '../../application/use-cases/UpdateAddress'
import { DeleteAddress } from '../../application/use-cases/DeleteAddress'
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository'
import { prisma } from '@shared/database/prisma'

export async function userRoutes(app: FastifyInstance): Promise<void> {
  const repository = new PrismaUserRepository(prisma)

  const controller = new UserController(
    new GetProfile(repository),
    new UpdateProfile(repository),
    new AddAddress(repository),
    new UpdateAddress(repository),
    new DeleteAddress(repository),
  )

  // All user routes require authentication
  app.addHook('preHandler', authenticate)

  // GET /api/v1/users/profile
  app.get('/profile', controller.getProfileHandler.bind(controller))

  // PUT /api/v1/users/profile
  app.put('/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          avatar: { type: 'string' },
          phone: { type: 'string' },
          bio: { type: 'string' },
        },
      },
    },
    handler: controller.updateProfileHandler.bind(controller),
  })

  // POST /api/v1/users/addresses
  app.post('/addresses', {
    schema: {
      body: {
        type: 'object',
        required: ['street', 'city', 'country', 'zipCode'],
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          zipCode: { type: 'string' },
          isDefault: { type: 'boolean' },
        },
      },
    },
    handler: controller.addAddressHandler.bind(controller),
  })

  // PUT /api/v1/users/addresses/:id
  app.put('/addresses/:id', {
    schema: {
      body: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          zipCode: { type: 'string' },
          isDefault: { type: 'boolean' },
        },
      },
    },
    handler: controller.updateAddressHandler.bind(controller),
  })

  // DELETE /api/v1/users/addresses/:id
  app.delete('/addresses/:id', controller.deleteAddressHandler.bind(controller))
}

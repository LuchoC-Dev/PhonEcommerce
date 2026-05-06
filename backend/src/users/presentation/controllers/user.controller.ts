import { FastifyRequest, FastifyReply } from 'fastify'
import { GetProfile } from '../../application/use-cases/GetProfile'
import { UpdateProfile } from '../../application/use-cases/UpdateProfile'
import { AddAddress } from '../../application/use-cases/AddAddress'
import { UpdateAddress } from '../../application/use-cases/UpdateAddress'
import { DeleteAddress } from '../../application/use-cases/DeleteAddress'
import { AppError } from '@shared/errors/AppError'

export class UserController {
  constructor(
    private readonly getProfile: GetProfile,
    private readonly updateProfile: UpdateProfile,
    private readonly addAddress: AddAddress,
    private readonly updateAddress: UpdateAddress,
    private readonly deleteAddress: DeleteAddress,
  ) {}

  async getProfileHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const accountId = request.user!.sub
      const result = await this.getProfile.execute(accountId)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async updateProfileHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const accountId = request.user!.sub
      const body = request.body as { name?: string; avatar?: string; phone?: string; bio?: string }
      const result = await this.updateProfile.execute(accountId, body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async addAddressHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const accountId = request.user!.sub
      const body = request.body as {
        street: string
        city: string
        state?: string
        country: string
        zipCode: string
        isDefault?: boolean
      }
      const result = await this.addAddress.execute(accountId, body)
      reply.status(201).send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async updateAddressHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const accountId = request.user!.sub
      const { id } = request.params
      const body = request.body as Partial<{
        street: string
        city: string
        state: string
        country: string
        zipCode: string
        isDefault: boolean
      }>
      const result = await this.updateAddress.execute(accountId, id, body)
      reply.send(result)
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  async deleteAddressHandler(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<void> {
    try {
      const accountId = request.user!.sub
      const { id } = request.params
      await this.deleteAddress.execute(accountId, id)
      reply.status(204).send()
    } catch (err) {
      this.handleError(err, reply)
    }
  }

  private handleError(err: unknown, reply: FastifyReply): void {
    if (err instanceof AppError) {
      reply.status(err.statusCode).send({ error: err.code ?? 'ERROR', message: err.message })
      return
    }
    reply.status(500).send({ error: 'INTERNAL_ERROR', message: 'Internal server error' })
  }
}

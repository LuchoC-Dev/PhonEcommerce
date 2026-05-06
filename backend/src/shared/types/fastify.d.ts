import { JwtPayload } from '@shared/utils/token.service'

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}

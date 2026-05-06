import { FastifyRequest, FastifyReply } from 'fastify'
import { JwtTokenService } from '@shared/utils/token.service'
import { UnauthorizedError } from '@shared/errors/AppError'

const tokenService = new JwtTokenService()

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Unauthorized', message: 'Missing token' })
    return
  }

  const token = authHeader.slice(7)
  try {
    const payload = tokenService.verifyAccessToken(token)
    request.user = payload
  } catch {
    reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' })
  }
}

export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user
    if (!user) {
      reply.status(401).send({ error: 'Unauthorized' })
      return
    }

    const hasPermission = user.permissions.includes(permission)
    if (!hasPermission) {
      reply.status(403).send({ error: 'Forbidden', message: `Missing permission: ${permission}` })
    }
  }
}

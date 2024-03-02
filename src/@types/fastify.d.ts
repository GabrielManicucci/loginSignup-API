import { FastifyRequest, FastifyReply } from 'fastify'

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      response: FastifyReply,
    ) => Promise<void>
  }
}

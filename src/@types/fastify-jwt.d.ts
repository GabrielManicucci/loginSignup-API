import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      iat: number
      sub: string
    } // user type is return type of `request.user` object
  }
}

import Fastify from 'fastify'

export const app = Fastify()

app.get('/', async (request, response) => {
  return { hello: 'world' }
})

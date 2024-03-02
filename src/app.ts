import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import {
  GetAllUsers,
  GetUser,
  Login,
  RegisterUser,
} from './controllers/user.controller'

export const app = Fastify()

app.decorate(
  'authenticate',
  async (request: FastifyRequest, response: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      response.send(err)
    }
  },
)

app.register(fjwt, { secret: 'LoginSignupAPI' })

app.get('/getUsers', GetAllUsers)

app.get('/getUser/:email', { onRequest: [app.authenticate] }, GetUser)

app.post('/signup', RegisterUser)

app.post('/login', Login)

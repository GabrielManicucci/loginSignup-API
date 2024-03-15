import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fjwt from '@fastify/jwt'
import cors from '@fastify/cors'
import {
  DeleteUserAccount,
  GetAllUsers,
  GetUser,
  Login,
  RegisterUser,
  UpdateEmail,
  UpdatePassword,
  updateUser,
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

app.register(cors, { origin: 'http://localhost:3000' })

app.register(fjwt, { secret: 'LoginSignupAPI' })

app.get('/getUsers', GetAllUsers)

app.get('/getUser', { onRequest: [app.authenticate] }, GetUser)

app.post('/signup', RegisterUser)

app.post('/login', Login)

app.patch('/updateUser', { onRequest: [app.authenticate] }, updateUser)

app.delete('/delete', { onRequest: [app.authenticate] }, DeleteUserAccount)

app.patch('/updateEmail', { onRequest: [app.authenticate] }, UpdateEmail)

app.patch('/updatePassword', { onRequest: [app.authenticate] }, UpdatePassword)

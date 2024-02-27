import Fastify from 'fastify'

import {
  GetAllUsers,
  GetUSer,
  RegisterUser,
} from './controllers/user.controlerr'

export const app = Fastify()

app.get('/getUsers', GetAllUsers)

app.get('/getUser/:email', GetUSer)

app.post('/signup', RegisterUser)

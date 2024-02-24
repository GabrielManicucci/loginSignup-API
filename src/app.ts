import Fastify from 'fastify'

import { GetAllUsers, GetUSer, Register } from './controllers/user.controlerr'

export const app = Fastify()

app.get('/getUsers', GetAllUsers)

app.get('/getUser/:email', GetUSer)

app.post('/signup', Register)

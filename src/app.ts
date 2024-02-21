import Fastify, { FastifyRequest, FastifyReply } from 'fastify'
import prisma from './utils/prisma'
import { z } from 'zod'
import { hash } from 'bcrypt'

export const app = Fastify()

app.get(
  '/getUsers',
  async (request: FastifyRequest, response: FastifyReply) => {
    try {
      const allUsers = await prisma.user.findMany()
      return response.code(201).send(allUsers)
    } catch (err) {
      if (err) {
        console.log(err)
        return response.code(404).send({ error: `${err}` })
      }
    }
  },
)

app.get(
  '/getUser/:email',
  async (request: FastifyRequest, response: FastifyReply) => {
    const userId = request.params.email

    try {
      const allUsers = await prisma.user.findUnique({
        where: { email: userId },
      })
      return response.code(201).send(allUsers)
    } catch (err) {
      if (err) {
        console.log(err)
        return response.code(404).send({ error: `${err}` })
      }
    }
  },
)

app.post('/signup', async (request: FastifyRequest, response: FastifyReply) => {
  const bodySchema = z.object({
    fullName: z.string(),
    userName: z.string(),
    cpf: z.string(),
    email: z.string().email(),
    password: z.string(),
  })

  const userData = bodySchema.parse(request.body)

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        fullName: userData.fullName,
      },
    })
    if (existingUser)
      return response.code(400).send({ error: 'Esse nome completo já existe' })

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    })
    if (existingEmail)
      return response.code(400).send({ error: 'Esse email já existe' })

    const hashedPassword = await hash(userData.password, 8)
    const hashedCPF = await hash(userData.cpf, 14)

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        cpf: hashedCPF,
        password: hashedPassword,
      },
    })
    return response.code(201).send(newUser)
  } catch (err) {
    if (err) {
      console.log(err)
      return response.code(404).send({ error: `${err}` })
    }
  }
})

import { prisma } from '@/lib/prisma'
import { RegisterbodySchema } from '@/types/user'
import { hash } from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function Register(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userData = RegisterbodySchema.parse(request.body)

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        fullName: userData.fullName,
      },
    })
    if (existingUser)
      return response.code(409).send({ error: 'Esse nome completo já existe' })

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    })
    if (existingEmail)
      return response.code(409).send({ error: 'Esse email já existe' })

    const hashedPassword = await hash(userData.password, 6)
    const hashedCPF = await hash(userData.cpf, 6)

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
}

export async function GetAllUsers(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    const allUsers = await prisma.user.findMany()
    return response.code(201).send(allUsers)
  } catch (err) {
    if (err) {
      console.log(err)
      return response.code(404).send({ error: `${err}` })
    }
  }
}

export async function GetUSer(request: FastifyRequest, response: FastifyReply) {
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
}

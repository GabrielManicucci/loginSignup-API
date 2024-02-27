import { prisma } from '@/lib/prisma'
import { registerbodySchema } from '@/types/user'
import { hash } from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function RegisterUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const requestUserData = registerbodySchema.parse(request.body)

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        fullName: requestUserData.fullName,
      },
    })
    if (existingUser)
      return response.code(409).send({ error: 'Esse nome completo já existe' })

    const existingEmail = await prisma.user.findUnique({
      where: {
        email: requestUserData.email,
      },
    })
    if (existingEmail)
      return response.code(409).send({ error: 'Esse email já existe' })

    const hashedPassword = await hash(requestUserData.password, 6)
    const hashedCPF = await hash(requestUserData.cpf, 6)

    const newUser = await prisma.user.create({
      data: {
        ...requestUserData,
        cpf: hashedCPF,
        password: hashedPassword,
      },
    })
    return response.code(201).send(newUser)
  } catch (err) {
    console.log(err)
    return response.code(404).send({ error: `${err}` })
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
  const userEmail = request.params.email

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    })
    return response.code(201).send(user)
  } catch (err) {
    if (err) {
      console.log(err)
      return response.code(404).send({ error: `${err}` })
    }
  }
}

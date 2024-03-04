import { prisma } from '@/lib/prisma'
import { loginBodySchema, registerbodySchema } from '../schemas/user.schema'
import { hash, compare } from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function RegisterUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const requestUserData = registerbodySchema.parse(request.body)

  try {
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

export async function GetUser(request: FastifyRequest, response: FastifyReply) {
  console.log(request.user)
  const { sub } = request.user

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: sub },
    })

    return response.code(201).send(existingUser)
  } catch (err) {
    console.log(err)
    return response.code(404).send({ error: `${err}` })
  }
}

export async function Login(request: FastifyRequest, response: FastifyReply) {
  const { email, password } = loginBodySchema.parse(request.body)

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (!existingUser)
      return response.code(404).send({ error: 'Usuário inexistente' })

    const comparePassword = await compare(password, existingUser.password)

    if (!comparePassword)
      return response.code(404).send({ error: 'Senha não compatível' })

    const token = await response.jwtSign({}, { sign: { sub: existingUser.id } })

    return response.code(201).send({ token })
  } catch (err) {
    console.log(err)
    return response.code(404).send({ error: err })
  }
}

export async function updateUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { id } = request.params
  const { name, email, cpf, password } = registerbodySchema.parse(request.body)

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, cpf, password },
    })

    return response.code(200).send(updatedUser)
  } catch (err) {
    return response.code(404).send({ error: err })
  }
}

export async function DeleteUserAccount(
  request: FastifyRequest,
  response: FastifyReply,
) {
  try {
    const { sub } = await request.jwtDecode()
    const deletedUser = await prisma.user.delete({ where: { id: sub } })
    return response.code(200).send(deletedUser)
  } catch (err) {
    return response.code(404).send({ error: err })
  }
}

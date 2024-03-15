import { prisma } from '@/lib/prisma'
import {
  loginBodySchema,
  registerbodySchema,
  updateEmailSchema,
  updatePaswordSchema,
} from '../schemas/user.schema'
import { hash, compare } from 'bcrypt'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function RegisterUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const requestUserData = registerbodySchema.parse(request.body)
  console.log(registerbodySchema)

  try {
    const existingEmail = await prisma.user.findUnique({
      where: {
        email: requestUserData.email,
      },
    })
    if (existingEmail)
      return response.code(409).send({ error: 'Esse email já existe' })

    const existingCpf = await prisma.user.findUnique({
      where: {
        cpf: requestUserData.cpf,
      },
    })
    if (existingCpf)
      return response.code(409).send({ error: 'Esse cpf já existe' })

    const hashedPassword = await hash(requestUserData.password, 6)

    const newUser = await prisma.user.create({
      data: {
        ...requestUserData,
        password: hashedPassword,
      },
    })
    return response.code(201).send(newUser)
  } catch (err) {
    // console.log(err)
    return response.code(409).send(err)
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
      return response.code(404).send({ error: 'Senha incorreta' })

    const token = await response.jwtSign({}, { sign: { sub: existingUser.id } })

    return response.code(201).send({ token })
  } catch (err) {
    console.log(err)
    return response.code(404).send(err)
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
  const { sub } = request.user

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: sub },
    })

    const returnUser = {
      name: existingUser?.name,
      email: existingUser?.email,
      cpf: existingUser?.cpf,
      password: existingUser?.password,
    }

    return response.code(201).send(returnUser)
  } catch (err) {
    console.log(err)
    return response.code(404).send({ error: `${err}` })
  }
}

export async function updateUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { sub } = request.user
  const { name, email, cpf, password } = registerbodySchema.parse(request.body)

  try {
    const updatedUser = await prisma.user.update({
      where: { id: sub },
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
    const { sub } = request.user
    const deletedUser = await prisma.user.delete({ where: { id: sub } })
    return response.code(200).send(deletedUser)
  } catch (err) {
    return response.code(404).send({ error: err })
  }
}

export async function UpdateEmail(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { sub } = request.user
  const { email, password } = updateEmailSchema.parse(request.body)

  try {
    const user = await prisma.user.findUnique({ where: { id: sub } })

    if (!user) return response.code(404).send({ error: 'Usuário inexistente' })

    const comparePassword = await compare(password, user.password)

    if (!comparePassword)
      return response.code(404).send({ error: 'Senha incorreta' })

    const existinEmail = await prisma.user.findUnique({ where: { email } })

    if (existinEmail)
      return response.code(404).send({ error: 'Este email já existe' })

    const newUser = await prisma.user.update({
      where: { id: sub },
      data: { email },
    })

    const returnUser = {
      name: newUser.name,
      email: newUser.email,
      cpf: newUser.cpf,
      password: newUser.password,
    }

    return response.code(200).send(returnUser)
  } catch (error) {
    return response.code(409).send(error)
  }
}

export async function UpdatePassword(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { sub } = request.user
  const { password, newPassword } = updatePaswordSchema.parse(request.body)

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: sub } })
    if (!existingUser)
      return response.code(404).send({ error: 'Usuário inexistente' })

    const comparePassword = await compare(password, existingUser.password)
    if (!comparePassword)
      return response.code(404).send({ error: 'Senha incorreta' })

    const compareNewPassword = await compare(newPassword, existingUser.password)
    if (compareNewPassword)
      return response.code(404).send({ error: 'Sua senha nova já existe' })

    const hashedPassword = await hash(newPassword, 6)

    const newPasswordUser = await prisma.user.update({
      where: { id: sub },
      data: { password: hashedPassword },
    })

    return response.code(200).send(newPasswordUser)
  } catch (error) {
    return response.code(409).send(error)
  }
}

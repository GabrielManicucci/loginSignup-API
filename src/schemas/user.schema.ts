import { z } from 'zod'

export const registerbodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const loginBodySchema = z.object({
  password: z.string(),
  email: z.string().email(),
})

export const updateEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const updatePaswordSchema = z.object({
  newPassword: z.string().min(8),
  password: z.string().min(8),
})

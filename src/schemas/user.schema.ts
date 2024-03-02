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

export type User = {
  sub: string
  iat: string
}

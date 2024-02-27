import { z } from 'zod'

export const registerbodySchema = z.object({
  fullName: z.string(),
  userName: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string(),
})

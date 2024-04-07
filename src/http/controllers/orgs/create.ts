import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createOrgBodySchema = z.object({
    name: z.string(),
    owner: z.string(),
    email: z.string().email(),
    password: z.string(),
    phone: z.string().min(6),
    cep: z.string(),
    state: z.string(),
    city: z.string(),
    address: z.string(),
    neighborhood: z.string(),
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {
    name,
    owner,
    email,
    password,
    phone,
    cep,
    state,
    city,
    address,
    neighborhood,
    latitude,
    longitude,
  } = createOrgBodySchema.parse(request.body)

  const createOrgUseCase = makeCreateOrgUseCase()

  await createOrgUseCase.execute({
    name,
    owner,
    email,
    password,
    phone,
    cep,
    state,
    city,
    address,
    neighborhood,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}

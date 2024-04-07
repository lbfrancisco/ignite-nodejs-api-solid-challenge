import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error'
import { hash } from 'bcryptjs'

interface CreateOrgUseCaseRequest {
  name: string
  owner: string
  email: string
  password: string
  phone: string
  cep: string
  state: string
  city: string
  address: string
  neighborhood: string
  latitude: number
  longitude: number
}

interface CreateOrgUseCaseResponse {
  org: Org
}

export class CreateOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
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
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgEmailAlreadyExists = await this.orgsRepository.findByEmail(email)

    if (orgEmailAlreadyExists) {
      throw new EmailAlreadyInUseError()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      name,
      owner,
      email,
      password: passwordHash,
      phone,
      cep,
      city,
      state,
      address,
      neighborhood,
      latitude,
      longitude,
    })

    return {
      org,
    }
  }
}

import { Pet, Prisma } from '@prisma/client'

export interface FindAllParams {
  city: string
  age?: string
  size?: string
  energyLevel?: string
  environment?: string
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findByParams(params: FindAllParams): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}

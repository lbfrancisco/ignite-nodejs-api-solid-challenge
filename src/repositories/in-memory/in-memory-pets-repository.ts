import { Pet, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { FindAllParams, PetsRepository } from '../pets-repository'
import { OrgsRepository } from '../orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: OrgsRepository) {}

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      age: data.age,
      size: data.size,
      energyLevel: data.energyLevel,
      environment: data.environment,
      orgId: data.orgId,
    }

    this.items.push(pet)

    return pet
  }

  async findByParams({
    city,
    age,
    size,
    energyLevel,
    environment,
  }: FindAllParams) {
    const filterOrgsByCity = this.orgsRepository.items.filter(
      (org) => org.city === city,
    )

    const pets = this.items
      .filter((pet) => filterOrgsByCity.some((org) => org.id === pet.orgId))
      .filter((pet) => (age ? pet.age === age : true))
      .filter((pet) => (size ? pet.size === size : true))
      .filter((pet) => (energyLevel ? pet.energyLevel === energyLevel : true))
      .filter((pet) => (environment ? pet.environment === environment : true))

    return pets
  }

  async findById(id: string) {
    const pet = this.items.find((pet) => pet.id === id)

    if (!pet) return null

    return pet
  }
}

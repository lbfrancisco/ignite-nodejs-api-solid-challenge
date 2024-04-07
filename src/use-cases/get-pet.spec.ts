import { beforeEach, describe, expect, it } from 'vitest'
import { PetsRepository } from '@/repositories/pets-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { GetPetUseCase } from './get-pet'
import { makePet } from '@tests/factories/makePet'
import { PetNotFoundError } from './errors/pet-not-found-error'
import { OrgsRepository } from '@/repositories/orgs-repository'

let orgsRepository: OrgsRepository
let petsRepository: PetsRepository
let sut: GetPetUseCase

describe('Get Pet Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new GetPetUseCase(petsRepository)
  })

  it('should be able to get a pet', async () => {
    const pet = await petsRepository.create(makePet())
    const result = await sut.execute({ id: pet.id })

    expect(result.pet).toEqual(pet)
  })

  it('should not be able to get a non-existing pet', async () => {
    await expect(sut.execute({ id: 'invalid-id' })).rejects.toBeInstanceOf(
      PetNotFoundError,
    )
  })
})

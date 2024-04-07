import { beforeEach, describe, expect, it } from 'vitest'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { CreatePetUseCase } from './create-pet'
import { OrgNotFoundError } from './errors/org-not-found-error'
import { makeOrg } from '@tests/factories/makeOrg'
import { makePet } from '@tests/factories/makePet'

let orgsRepository: OrgsRepository
let petsRepository: PetsRepository
let sut: CreatePetUseCase

describe('Create Pet Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new CreatePetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to create a pet', async () => {
    const org = await orgsRepository.create(makeOrg())

    const { pet } = await sut.execute({
      name: 'Pão de Queijo',
      description:
        'Um cachorrinho branco com muita energia, amoroso e brincalhão.',
      age: '6',
      size: 'médio',
      energyLevel: '6',
      environment: 'casa',
      orgId: org.id,
    })

    expect(pet.id).toEqual(expect.any(String))
  })

  it('should not be possible to create a pet with an invalid org', async () => {
    const pet = makePet()

    await petsRepository.create(pet)

    await expect(sut.execute(pet)).rejects.toBeInstanceOf(OrgNotFoundError)
  })
})

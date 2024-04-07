import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'
import { makePet } from '@tests/factories/makePet'
import { SearchPetsUseCase } from './search-pets'
import { makeOrg } from '@tests/factories/makeOrg'

let orgsRepository: OrgsRepository
let petsRepository: PetsRepository
let sut: SearchPetsUseCase

describe('Search Pets Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    sut = new SearchPetsUseCase(petsRepository)
  })

  it('should be able to search a pet by city', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ orgId: org.id }))
    await petsRepository.create(makePet({ orgId: org.id }))

    const otherOrg = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ orgId: otherOrg.id }))

    const { pets } = await sut.execute({ city: org.city })

    expect(pets).toHaveLength(2)

    const { pets: otherOrgPets } = await sut.execute({ city: otherOrg.city })

    expect(otherOrgPets).toHaveLength(1)
  })

  it('should be able to search a pet by city and age', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ orgId: org.id, age: '3' }))
    await petsRepository.create(makePet({ orgId: org.id, age: '5' }))

    const { pets } = await sut.execute({ city: org.city, age: '3' })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search a pet by city and size', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ orgId: org.id, size: 'small' }))
    await petsRepository.create(makePet({ orgId: org.id, size: 'medium' }))

    const { pets } = await sut.execute({ city: org.city, size: 'small' })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search a pet by city and energy level', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(makePet({ orgId: org.id, energyLevel: 'low' }))
    await petsRepository.create(makePet({ orgId: org.id, energyLevel: 'high' }))

    const { pets } = await sut.execute({ city: org.city, energyLevel: 'high' })

    expect(pets).toHaveLength(1)
  })

  it('should be able to search a pet by city and environment', async () => {
    const org = await orgsRepository.create(makeOrg())

    await petsRepository.create(
      makePet({ orgId: org.id, environment: 'indoor' }),
    )
    await petsRepository.create(
      makePet({ orgId: org.id, environment: 'outdoor' }),
    )

    const { pets } = await sut.execute({
      city: org.city,
      environment: 'indoor',
    })

    expect(pets).toHaveLength(1)
  })
})

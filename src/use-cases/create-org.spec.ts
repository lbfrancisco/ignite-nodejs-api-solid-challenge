import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { EmailAlreadyInUseError } from './errors/email-already-in-use-error'
import { CreateOrgUseCase } from './create-org'
import { makeOrg } from '@tests/factories/makeOrg'

let orgsRepository: InMemoryOrgsRepository
let sut: CreateOrgUseCase

describe('Create Org Use Case', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new CreateOrgUseCase(orgsRepository)
  })

  it('should be able to create an org', async () => {
    const { org } = await sut.execute(makeOrg())

    expect(org.id).toEqual(expect.any(String))
  })

  it('should not be able to create an org with twice e-mail', async () => {
    const email = 'org@example.com'

    await sut.execute({
      name: 'Org Test',
      owner: 'Lucas',
      email,
      password: '123456',
      address: 'R. Find A Friend 123',
      cep: '37557066',
      city: 'Pouso Alegre',
      neighborhood: 'Comunidade',
      phone: '0 0000-0000',
      state: 'MG',
      latitude: -21.8338547,
      longitude: -45.9342111,
    })

    await expect(() =>
      sut.execute({
        name: 'Org Test',
        owner: 'Lucas',
        email,
        password: '123456',
        address: 'R. Find A Friend 123',
        cep: '37557066',
        city: 'Pouso Alegre',
        neighborhood: 'Comunidade',
        phone: '0 0000-0000',
        state: 'MG',
        latitude: -21.8338547,
        longitude: -45.9342111,
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { makeOrg } from '@tests/factories/makeOrg'
import { hash } from 'bcryptjs'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(async () => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate with valid credentials', async () => {
    const org = await orgsRepository.create(
      makeOrg({ password: await hash('123456', 6) }),
    )

    const { org: authenticatedOrg } = await sut.execute({
      email: org.email,
      password: '123456',
    })

    expect(authenticatedOrg.email).toEqual(org.email)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const org = await orgsRepository.create(
      makeOrg({ password: await hash('123456', 6) }),
    )

    await expect(() =>
      sut.execute({
        email: org.email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})

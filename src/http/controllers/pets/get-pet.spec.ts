import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { makePet } from '@tests/factories/makePet'
import { makeOrg } from '@tests/factories/makeOrg'

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a pet', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const authResponse = await request(app.server).post('/sessions').send({
      email: org.email,
      password: org.password,
    })

    const createPetResponse = await request(app.server)
      .post('/orgs/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(makePet())

    const response = await request(app.server).get(
      `/orgs/pets/${createPetResponse.body.id}`,
    )

    expect(response.status).toBe(200)
  })
})

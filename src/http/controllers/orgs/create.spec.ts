import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { makeOrg } from '@tests/factories/makeOrg'

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an org', async () => {
    const response = await request(app.server)
      .post('/orgs')
      // .set('Authorization', `Bearer ${token}`)
      .send(makeOrg())

    expect(response.statusCode).toEqual(201)
  })
})

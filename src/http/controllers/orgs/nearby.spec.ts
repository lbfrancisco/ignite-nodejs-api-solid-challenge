import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { makeOrg } from '@tests/factories/makeOrg'

describe('Nearby Orgs (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby orgs', async () => {
    const org = makeOrg()

    await request(app.server).post('/orgs').send(org)

    const response = await request(app.server).get('/orgs/nearby').query({
      latitude: org.latitude,
      longitude: org.longitude,
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.orgs).toHaveLength(1)
  })
})

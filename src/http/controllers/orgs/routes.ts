import { FastifyInstance } from 'fastify'
import { create } from './create'
import { nearby } from './nearby'
import { authenticate } from './authenticate'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', create)
  app.post('/sessions', authenticate)
  app.get('/orgs/nearby', nearby)
}

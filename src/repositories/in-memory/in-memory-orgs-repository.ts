import { Org, Prisma } from '@prisma/client'
import { randomUUID } from 'crypto'
import { FindNearbyParams, OrgsRepository } from '../orgs-repository'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async create(data: Prisma.OrgUncheckedCreateInput) {
    const org = {
      id: randomUUID(),
      ...data,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.items.push(org)

    return org
  }

  async findManyNearby(params: FindNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(params, {
        latitude: item.latitude.toNumber(),
        longitude: item.longitude.toNumber(),
      })

      const MAX_DISTANCE_IN_KILOMETERS = 10

      return distance < MAX_DISTANCE_IN_KILOMETERS
    })
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) return null

    return org
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)

    if (!org) return null

    return org
  }
}

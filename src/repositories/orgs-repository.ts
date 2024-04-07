import { Org, Prisma } from '@prisma/client'

export interface FindNearbyParams {
  latitude: number
  longitude: number
}

export interface OrgsRepository {
  create(data: Prisma.OrgCreateInput): Promise<Org>
  findManyNearby(params: FindNearbyParams): Promise<Org[]>
  findByEmail(email: string): Promise<Org | null>
  findById(id: string): Promise<Org | null>
  items?: Org[]
}

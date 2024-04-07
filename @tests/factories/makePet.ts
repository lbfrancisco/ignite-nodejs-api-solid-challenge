import { faker } from '@faker-js/faker'

interface Overwrite {
  orgId?: string
  age?: string
  size?: string
  energyLevel?: string
  environment?: string
}

export function makePet(overwrite?: Overwrite) {
  return {
    id: crypto.randomUUID(),
    orgId: overwrite?.orgId ?? crypto.randomUUID(),
    name: faker.animal.dog(),
    description: faker.lorem.paragraph(),
    age: overwrite?.age ?? faker.number.int().toString(),
    size:
      overwrite?.size ??
      faker.helpers.arrayElement(['small', 'medium', 'large']),
    energyLevel:
      overwrite?.energyLevel ??
      faker.helpers.arrayElement(['low', 'medium', 'high']),
    environment:
      overwrite?.environment ??
      faker.helpers.arrayElement(['indoor', 'outdoor']),
  }
}

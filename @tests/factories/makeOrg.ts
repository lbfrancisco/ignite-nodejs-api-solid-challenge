import { faker } from '@faker-js/faker'

interface Overwrite {
  password?: string
}

export function makeOrg(overwrite?: Overwrite) {
  return {
    id: crypto.randomUUID(),
    name: faker.company.name(),
    owner: faker.person.fullName(),
    email: faker.internet.email(),
    password: overwrite?.password ?? faker.internet.password(),
    phone: faker.phone.number(),
    cep: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    address: faker.location.street(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    neighborhood: faker.location.streetAddress(),
  }
}

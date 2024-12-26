import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'The best gym for JavaScript developers',
      phone: '555-5555',
      latitude: -31.3328149,
      longitude: -54.0836531,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: 'The best gym for TypeScript developers',
      phone: '555-5555',
      latitude: -31.407531,
      longitude: -53.8670025,
    })

    const { gyms } = await sut.execute({
      userLatitude: -31.3328149,
      userLongitude: -54.0836531,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})

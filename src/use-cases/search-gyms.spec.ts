import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      description: 'The best gym for JavaScript developers',
      phone: '555-5555',
      latitude: -31.3328149,
      longitude: -54.0836531
    })
    await gymsRepository.create({
      title: 'TypeScript Gym',
      description: 'The best gym for TypeScript developers',
      phone: '555-5555',
      latitude: -31.3328149,
      longitude: -54.0836531
    })
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ])
  })
  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: 'The best gym for JavaScript developers',
        phone: '555-5555',
        latitude: -31.3328149,
        longitude: -54.0836531
      })
    }
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
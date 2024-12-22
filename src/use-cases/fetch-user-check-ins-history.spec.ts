import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInHistoryUseCase

const locationsMock = {
  gym1: {
    latitude: -31.3328149,
    longitude: -54.0836531
  },
}

describe('Fetch User Check-in History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInHistoryUseCase(checkInsRepository)
  })


  it('should be able to fetch check in history', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })
  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${i}`,
      })
    }
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2
    })
    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
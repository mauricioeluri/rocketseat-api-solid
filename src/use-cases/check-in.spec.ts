import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const locationsMock = {
  gym1: {
    latitude: -31.3328149,
    longitude: -54.0836531
  },
  gym2: {
    latitude: -31.3358385,
    longitude: -54.0969804
  }
}

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: 'Academia muito legal',
      phone: '51999999999',
      latitude: locationsMock.gym1.latitude,
      longitude: locationsMock.gym1.longitude,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym1.latitude,
      userLongitude: locationsMock.gym1.longitude
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2022-01-01 10:00:00'))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym1.latitude,
      userLongitude: locationsMock.gym1.longitude
    })
    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym1.latitude,
      userLongitude: locationsMock.gym1.longitude
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2022-01-01 10:00:00'))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym1.latitude,
      userLongitude: locationsMock.gym1.longitude
    })
    vi.setSystemTime(new Date('2022-01-02 10:00:00'))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym1.latitude,
      userLongitude: locationsMock.gym1.longitude
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    // I think it doesn't have to be another gym
    await expect(() => sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: locationsMock.gym2.latitude,
      userLongitude: locationsMock.gym2.longitude
    })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

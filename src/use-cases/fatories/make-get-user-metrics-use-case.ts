import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new GetUserMetricsUseCase(checkInsRepository)
}

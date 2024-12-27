import { makeGetUserProfileUseCase } from '@/use-cases/fatories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify()
  const getUserProfile = makeGetUserProfileUseCase()
  const { user } = await getUserProfile.execute({ userId: request.user.sub })
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
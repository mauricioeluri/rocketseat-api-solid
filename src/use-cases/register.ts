import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// S: Single Responsibility Principle
// O: Open/Closed Principle
// L: Liskov Substitution Principle
// I: Interface Segregation Principle
// D: Dependency Inversion Principle

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)
  const userWithSomeEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSomeEmail) throw new Error('Email already exists')

  const prismaUsersRepository = new PrismaUsersRepository()

  prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}

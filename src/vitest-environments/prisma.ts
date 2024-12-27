import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest/environments'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (
    !process.env.MYSQL_USER ||
    !process.env.MYSQL_PASSWORD ||
    !process.env.MYSQL_HOST ||
    !process.env.MYSQL_PORT
  )
    throw new Error('Please provide a DATABASE_URL environment variable.')

  return `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${schema}`
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseUrl(schema)
    process.env.DATABASE_URL = databaseURL
    execSync('pnpm prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS \`${schema}\`;`)
        await prisma.$disconnect()
      },
    }
  },
}

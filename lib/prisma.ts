import { PrismaClient } from '@prisma/client'

const SUPABASE_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres"

process.env.DATABASE_URL = SUPABASE_URL

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
import { PrismaClient } from '@prisma/client'

const SUPABASE_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres"

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
  process.env.DATABASE_URL = SUPABASE_URL
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 
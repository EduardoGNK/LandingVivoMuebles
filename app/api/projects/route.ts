import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SUPABASE_DIRECT_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres?sslmode=require"
const SUPABASE_POOLER_URL = "postgres://postgres.qccdfmcbntyzzwstnvqu:Escalona1798.@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

export async function GET() {
  const connectionUrls = [
    process.env.DATABASE_URL,
    SUPABASE_POOLER_URL,
    SUPABASE_DIRECT_URL,
  ].filter(Boolean) as string[]

  let lastError: any = null

  for (const url of connectionUrls) {
    const db = new PrismaClient({
      datasources: {
        db: { url },
      },
    })

    try {
      const projects = await db.project.findMany({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
      })
      await db.$disconnect()

      if (Array.isArray(projects) && projects.length > 0) {
        return NextResponse.json(projects)
      }
    } catch (err: any) {
      lastError = err
      await db.$disconnect().catch(() => {})
      console.warn(`[API GET] Error conectando con ${url}:`, err?.message || err)
    }
  }

  return NextResponse.json({
    error: lastError?.message || 'No se pudo conectar a Supabase',
    code: lastError?.code,
  }, { status: 500 })
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { title, comuna, startDate, endDate, workType, description, propertyType, location, gallery, videos, isFeatured, featuredOrder } = await request.json()

    if (!title || !description || !location || !startDate || !endDate || !workType || !propertyType) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        comuna: comuna || "Santiago",
        startDate,
        endDate,
        workType,
        description,
        propertyType,
        location,
        gallery: gallery || [],
        videos: videos || [],
        status: 'published',
        isFeatured: Boolean(isFeatured),
        featuredOrder: typeof featuredOrder === 'number' ? featuredOrder : (Number(featuredOrder) || 0),
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    )
  }
} 
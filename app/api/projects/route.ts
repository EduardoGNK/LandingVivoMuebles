import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Supabase IPv4 Pooler URL — funciona en Vercel Serverless (no requiere IPv6)
const SUPABASE_POOLER_URL =
  "postgres://postgres.qccdfmcbntyzzwstnvqu:Escalona1798.@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

function getDb() {
  return new PrismaClient({
    datasources: { db: { url: SUPABASE_POOLER_URL } },
  })
}

export async function GET() {
  const db = getDb()
  try {
    const projects = await db.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })
    await db.$disconnect()
    return NextResponse.json(projects)
  } catch (err: any) {
    await db.$disconnect().catch(() => {})
    console.error('[API GET] Error conectando a Supabase:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'No se pudo conectar a Supabase' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const db = getDb()
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'admin') {
      await db.$disconnect()
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const {
      title, comuna, startDate, endDate, workType,
      description, propertyType, location, gallery, videos,
      isFeatured, featuredOrder,
    } = await request.json()

    if (!title || !description || !location || !startDate || !endDate || !workType || !propertyType) {
      await db.$disconnect()
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        title,
        comuna: comuna || 'Santiago',
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
      },
    })

    await db.$disconnect()
    return NextResponse.json(project)
  } catch (error: any) {
    await db.$disconnect().catch(() => {})
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    )
  }
}
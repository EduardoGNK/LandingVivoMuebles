import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SUPABASE_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres"

export async function GET() {
  const db = new PrismaClient({
    datasources: {
      db: {
        url: SUPABASE_URL,
      },
    },
  })

  try {
    const projects = await db.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })
    await db.$disconnect()
    return NextResponse.json(projects)
  } catch (error: any) {
    await db.$disconnect()
    console.error('Error fetching projects from Supabase:', error)
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }
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
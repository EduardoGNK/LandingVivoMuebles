import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { INITIAL_PROJECTS } from '@/data/artworks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SUPABASE_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres?sslmode=require"

export async function GET() {
  try {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
      process.env.DATABASE_URL = SUPABASE_URL
    }

    const projects = await prisma.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })

    if (Array.isArray(projects) && projects.length > 0) {
      return NextResponse.json(projects)
    }

    return NextResponse.json(INITIAL_PROJECTS)
  } catch (error) {
    console.error('Error fetching projects from DB:', error)
    return NextResponse.json(INITIAL_PROJECTS)
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
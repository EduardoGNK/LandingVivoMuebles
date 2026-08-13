import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { INITIAL_PROJECTS } from '@/data/artworks'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { PrismaClient } from '@prisma/client'

const SUPABASE_URL = "postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres?sslmode=require"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })

    if (Array.isArray(projects) && projects.length > 0) {
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error('Error con prisma principal, intentando conexion directa a Supabase:', error)
  }

  try {
    const directPrisma = new PrismaClient({
      datasources: {
        db: { url: SUPABASE_URL }
      }
    })
    const realProjects = await directPrisma.project.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
    })
    await directPrisma.$disconnect()

    if (Array.isArray(realProjects) && realProjects.length > 0) {
      return NextResponse.json(realProjects)
    }
  } catch (fallbackErr) {
    console.error('Error en conexion directa a Supabase:', fallbackErr)
  }

  return NextResponse.json(INITIAL_PROJECTS)
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
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    // Consulta simplificada sin orderBy para evitar problemas de memoria de MySQL
    const projects = await prisma.project.findMany({
      where: { status: 'published' },
      // Removemos orderBy temporalmente para evitar problemas de memoria
      // orderBy: { createdAt: 'desc' },
      // Removemos include temporalmente para evitar problemas de memoria
      // include: {
      //   user: {
      //     select: { name: true }
      //   }
      // }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    )
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

    const { title, comuna, startDate, endDate, workType, description, propertyType, location, gallery } = await request.json()

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
        status: 'published',
        // userId es opcional ahora, así que no lo incluimos
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
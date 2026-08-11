import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams?.id || (params as any)?.id

    if (!id) {
      return NextResponse.json({ error: 'ID de proyecto no especificado' }, { status: 400 })
    }

    const body = await request.json()
    const { title, comuna, startDate, endDate, workType, description, propertyType, location, gallery, videos, isFeatured, featuredOrder } = body
    
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (comuna !== undefined) updateData.comuna = comuna || "Santiago"
    if (startDate !== undefined) updateData.startDate = startDate
    if (endDate !== undefined) updateData.endDate = endDate
    if (workType !== undefined) updateData.workType = workType
    if (description !== undefined) updateData.description = description
    if (propertyType !== undefined) updateData.propertyType = propertyType
    if (location !== undefined) updateData.location = location
    if (gallery !== undefined) updateData.gallery = Array.isArray(gallery) ? gallery : []
    if (videos !== undefined) updateData.videos = Array.isArray(videos) ? videos : []
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured)
    if (featuredOrder !== undefined) updateData.featuredOrder = Number(featuredOrder) || 0

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updatedProject)
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al actualizar el proyecto en la base de datos' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
} 
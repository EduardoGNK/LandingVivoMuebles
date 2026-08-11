import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Si viene una lista para reordenar múltiples proyectos
    if (Array.isArray(body)) {
      const updates = body.map((item: { id: string; featuredOrder?: number; isFeatured?: boolean }) => {
        const data: any = {}
        if (item.featuredOrder !== undefined) data.featuredOrder = Number(item.featuredOrder) || 0
        if (item.isFeatured !== undefined) data.isFeatured = Boolean(item.isFeatured)

        return prisma.project.update({
          where: { id: item.id },
          data,
        })
      })

      await prisma.$transaction(updates)
      return NextResponse.json({ success: true })
    }

    // Actualización individual rápida
    const { id, isFeatured, featuredOrder } = body
    if (!id) {
      return NextResponse.json({ error: 'ID de proyecto requerido' }, { status: 400 })
    }

    const data: any = {}
    if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured)
    if (featuredOrder !== undefined) data.featuredOrder = Number(featuredOrder) || 0

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error reordering project:', error)
    return NextResponse.json({ error: 'Error al reordenar proyecto' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Prueba simple de conexión
    const projectCount = await prisma.project.count()
    
    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa',
      projectCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing database:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error de conexión a la base de datos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    // Crear un proyecto de prueba
    const testProject = await prisma.project.create({
      data: {
        title: "Proyecto de Prueba",
        artist: "Vivo Muebles",
        year: "2024",
        medium: "Cocina completa",
        dimensions: "4.5 × 3.2 m",
        description: "Este es un proyecto de prueba para verificar que la base de datos funciona correctamente.",
        price: "$15,800",
        location: "Santiago, Chile",
        gallery: ["/placeholder.jpg"],
        status: 'published',
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Proyecto de prueba creado exitosamente',
      project: testProject
    })
  } catch (error) {
    console.error('Error creating test project:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear proyecto de prueba',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 
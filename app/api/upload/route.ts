import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Límite de tamaño en bytes: 10MB para imágenes, 200MB para videos
const IMAGE_SIZE_LIMIT = 10 * 1024 * 1024
const VIDEO_SIZE_LIMIT = 200 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // Solo admins pueden subir archivos
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    // Detectar si es video o imagen por el mimetype
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isVideo && !isImage) {
      return NextResponse.json({ error: 'Tipo de archivo no soportado. Solo imágenes y videos.' }, { status: 400 })
    }

    // Validar tamaño
    const sizeLimit = isVideo ? VIDEO_SIZE_LIMIT : IMAGE_SIZE_LIMIT
    if (file.size > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024)
      return NextResponse.json({ error: `El archivo supera el límite de ${limitMB}MB` }, { status: 400 })
    }

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Cloudinary con configuración según tipo
    const result = await new Promise<{ secure_url: string; public_id: string; resource_type: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            isVideo
              ? {
                  folder: 'vivomuebles/projects/videos',
                  resource_type: 'video',
                }
              : {
                  folder: 'vivomuebles/projects',
                  resource_type: 'image',
                  quality: 'auto',
                  fetch_format: 'auto',
                },
            (error, result) => {
              if (error) reject(error)
              else resolve(result as any)
            }
          )
          .end(buffer)
      }
    )

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      type: isVideo ? 'video' : 'image',
    })
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return NextResponse.json(
      { error: 'Error al subir el archivo' },
      { status: 500 }
    )
  }
}

// Necesario para archivos grandes (videos)
export const maxDuration = 60


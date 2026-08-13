/**
 * Módulo de conversión local de imágenes a WebP en el navegador.
 * Procesa JPG/JPEG/PNG conservando estrictamente la relación de aspecto original (Aspect Ratio).
 */

export interface ProcessedImageResult {
  file: File
  originalSize: number
  webpSize: number
  reductionPercentage: number
  previewUrl: string
  width: number
  height: number
  originalName: string
  newName: string
  isAlreadyWebP: boolean
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Convierte un objeto File de imagen a formato WebP manteniendo la relación de aspecto original.
 * @param file Archivo original (JPG, PNG, GIF, WEBP, etc.)
 * @param options Configuración de calidad (0.85 por defecto) y límite 2K (2560px max por defecto)
 */
export async function convertToWebP(
  file: File,
  options: { quality?: number; maxDimension?: number } = {}
): Promise<ProcessedImageResult> {
  const quality = options.quality ?? 0.85
  const maxDimension = options.maxDimension ?? 2560

  // Validar que sea una imagen
  if (!file.type.startsWith('image/')) {
    throw new Error(`El archivo "${file.name}" no es una imagen válida.`)
  }

  // Si ya es WebP, no reconvertir innecesariamente
  if (file.type === 'image/webp') {
    const previewUrl = URL.createObjectURL(file)
    const dimensions = await getImageDimensions(previewUrl)
    return {
      file,
      originalSize: file.size,
      webpSize: file.size,
      reductionPercentage: 0,
      previewUrl,
      width: dimensions.width,
      height: dimensions.height,
      originalName: file.name,
      newName: file.name,
      isAlreadyWebP: true,
    }
  }

  // Cargar imagen en memoria utilizando createImageBitmap o Image nativo
  let imgBitmap: ImageBitmap | HTMLImageElement
  let origWidth = 0
  let origHeight = 0
  let tempObjectUrl: string | null = null

  try {
    if (typeof createImageBitmap === 'function') {
      imgBitmap = await createImageBitmap(file)
      origWidth = imgBitmap.width
      origHeight = imgBitmap.height
    } else {
      tempObjectUrl = URL.createObjectURL(file)
      imgBitmap = await loadImageElement(tempObjectUrl)
      origWidth = imgBitmap.width
      origHeight = imgBitmap.height
    }

    // Preservación ESTRICUTA de Aspect Ratio (Relación de Aspecto)
    const aspectRatio = origWidth / origHeight
    let targetWidth = origWidth
    let targetHeight = origHeight

    // Solo escalar si supera maxDimension (2560px), conservando exactamente el aspect ratio
    if (origWidth > maxDimension || origHeight > maxDimension) {
      if (origWidth >= origHeight) {
        targetWidth = maxDimension
        targetHeight = Math.round(maxDimension / aspectRatio)
      } else {
        targetHeight = maxDimension
        targetWidth = Math.round(maxDimension * aspectRatio)
      }
    }

    // Dibujar en canvas para codificar a WebP
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No se pudo obtener el contexto 2D del canvas.')
    }

    // Renderizar con alta calidad de interpolación
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(imgBitmap, 0, 0, targetWidth, targetHeight)

    // Exportar canvas a Blob WebP
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', quality)
    })

    if (!blob) {
      throw new Error(`Error al codificar la imagen "${file.name}" a WebP.`)
    }

    // Crear nombre con extensión .webp
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    const newName = `${baseName}.webp`

    // Crear objeto File WebP resultante
    const webpFile = new File([blob], newName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    // Calcular reducción del peso
    const reductionPercentage = Math.max(
      0,
      Math.round(((file.size - blob.size) / file.size) * 100)
    )

    const previewUrl = URL.createObjectURL(blob)

    return {
      file: webpFile,
      originalSize: file.size,
      webpSize: blob.size,
      reductionPercentage,
      previewUrl,
      width: targetWidth,
      height: targetHeight,
      originalName: file.name,
      newName,
      isAlreadyWebP: false,
    }
  } finally {
    // Liberación de recursos temporales en memoria
    if ('close' in imgBitmap! && typeof imgBitmap.close === 'function') {
      imgBitmap.close()
    }
    if (tempObjectUrl) {
      URL.revokeObjectURL(tempObjectUrl)
    }
  }
}

/**
 * Obtener dimensiones de una imagen vía Blob URL
 */
function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
    }
    img.preload = 'metadata'
    img.src = url
  })
}

/**
 * Fallback para cargar imagen nativa
 */
function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(new Error('Error al cargar la imagen en el elemento Image.'))
    img.src = url
  })
}

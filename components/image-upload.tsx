"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Trash2, ArrowLeft, ArrowRight, GripVertical, Star, Loader2, Zap, CheckCircle2, AlertCircle } from "lucide-react"
import { convertToWebP, formatFileSize, ProcessedImageResult } from "@/lib/image-converter"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  disabled?: boolean
  onProcessingChange?: (isProcessing: boolean) => void
}

interface ProcessingQueueItem {
  id: string
  originalFileName: string
  originalSizeFormatted: string
  webpSizeFormatted?: string
  reductionPercentage?: number
  previewUrl?: string
  status: 'converting' | 'uploading' | 'completed' | 'error'
  errorMessage?: string
}

export function ImageUpload({
  images,
  onImagesChange,
  disabled = false,
  onProcessingChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Cola de procesamiento visual con progreso por archivo
  const [queueItems, setQueueItems] = useState<ProcessingQueueItem[]>([])
  const [batchStatusText, setBatchStatusText] = useState<string>("")
  const previewUrlsRef = useRef<string[]>([])

  // Notificar al componente padre (/admin) si hay conversiones o subidas activas
  useEffect(() => {
    onProcessingChange?.(uploading)
  }, [uploading, onProcessingChange])

  // Limpieza de Blob URLs al desmontar
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return

      // Validaciones básicas de tipo y tamaño de entrada en cliente
      const validFiles: File[] = []
      const MAX_INPUT_SIZE = 30 * 1024 * 1024 // 30MB máximo por foto original

      for (const file of acceptedFiles) {
        if (!file.type.startsWith("image/")) {
          setError(`El archivo "${file.name}" no es una imagen válida.`)
          return
        }
        if (file.size > MAX_INPUT_SIZE) {
          setError(`El archivo "${file.name}" supera el tamaño máximo permitido (30MB).`)
          return
        }
        validFiles.push(file)
      }

      setUploading(true)
      setError(null)

      // Inicializar cola de items en estado 'converting'
      const initialQueueItems: ProcessingQueueItem[] = validFiles.map((file, idx) => ({
        id: `${file.name}-${Date.now()}-${idx}`,
        originalFileName: file.name,
        originalSizeFormatted: formatFileSize(file.size),
        status: 'converting',
      }))

      setQueueItems(initialQueueItems)
      const totalCount = validFiles.length
      const uploadedUrls: string[] = []

      try {
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i]
          const currentItemId = initialQueueItems[i].id

          // 1. Notificar progreso de conversión en cliente
          setBatchStatusText(`Procesando en navegador: ${i + 1} de ${totalCount}...`)

          let converted: ProcessedImageResult
          try {
            // Conversión LOCAL en el navegador a WebP con 0.85 calidad y 2560px max Capping (conservando exacto el Aspect Ratio)
            converted = await convertToWebP(file, { quality: 0.85, maxDimension: 2560 })
            previewUrlsRef.current.push(converted.previewUrl)

            // Actualizar item de la cola con datos de reducción WebP
            setQueueItems((prev) =>
              prev.map((item) =>
                item.id === currentItemId
                  ? {
                      ...item,
                      webpSizeFormatted: formatFileSize(converted.webpSize),
                      reductionPercentage: converted.reductionPercentage,
                      previewUrl: converted.previewUrl,
                      status: 'uploading',
                    }
                  : item
              )
            )
          } catch (convErr: any) {
            console.error("Error al convertir a WebP:", convErr)
            setQueueItems((prev) =>
              prev.map((item) =>
                item.id === currentItemId
                  ? {
                      ...item,
                      status: 'error',
                      errorMessage: convErr.message || "Error de conversión a WebP",
                    }
                  : item
              )
            )
            continue // Continuar con la siguiente imagen sin romper el lote
          }

          // 2. Subida del archivo WebP procesado
          setBatchStatusText(`Subiendo WebP: ${i + 1} de ${totalCount}...`)

          try {
            const formData = new FormData()
            formData.append("file", converted.file)

            const response = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              const err = await response.json().catch(() => ({}))
              throw new Error(err.error || `Error ${response.status} al subir WebP`)
            }

            const { url } = await response.json()
            uploadedUrls.push(url)

            // Marcar item como completado
            setQueueItems((prev) =>
              prev.map((item) =>
                item.id === currentItemId
                  ? {
                      ...item,
                      status: 'completed',
                    }
                  : item
              )
            )
          } catch (uploadErr: any) {
            console.error("Error al subir WebP:", uploadErr)
            setQueueItems((prev) =>
              prev.map((item) =>
                item.id === currentItemId
                  ? {
                      ...item,
                      status: 'error',
                      errorMessage: uploadErr.message || "Error al enviar al servidor",
                    }
                  : item
              )
            )
          }
        }

        // Actualizar formulario del proyecto con las nuevas imágenes WebP subidas
        if (uploadedUrls.length > 0) {
          onImagesChange([...images, ...uploadedUrls])
        }

        setBatchStatusText("¡Procesamiento y subida WebP completados!")
      } catch (err: any) {
        console.error("Error general en el lote:", err)
        setError(err.message || "Ocurrió un error al procesar las imágenes.")
      } finally {
        setUploading(false)
        // Limpiar mensaje de lote después de unos segundos si todo fue exitoso
        setTimeout(() => {
          setBatchStatusText("")
        }, 6000)
      }
    },
    [images, onImagesChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    disabled: disabled || uploading,
  })

  const removeImage = (e: React.MouseEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const moveImage = (e: React.MouseEvent, fromIndex: number, toIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (toIndex < 0 || toIndex >= images.length) return
    const updated = [...images]
    const [movedItem] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, movedItem)
    onImagesChange(updated)
  }

  // Eventos de Drag & Drop HTML5 para reordenar
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const updated = [...images]
    const [movedItem] = updated.splice(draggedIndex, 1)
    updated.splice(targetIndex, 0, movedItem)

    setDraggedIndex(null)
    setDragOverIndex(null)
    onImagesChange(updated)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            Imágenes del proyecto ({images.length})
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <Zap className="h-3 w-3 fill-emerald-500 text-emerald-500" />
              Auto-WebP activo en navegador
            </span>
          </label>
          {images.length > 1 && (
            <span className="text-xs text-muted-foreground">
              💡 Arrastra las imágenes o usa ◀ ▶ para cambiar el orden de publicación
            </span>
          )}
        </div>

        {/* Zona de Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          {uploading ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {batchStatusText || "Optimizando imágenes en WebP..."}
              </p>
              <p className="text-xs text-muted-foreground">
                Las fotos JPG/JPEG pesadas se convierten localmente antes de viajar al servidor.
              </p>
            </div>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Suelta las imágenes aquí...</p>
          ) : (
            <div>
              <p className="text-sm font-medium">
                Arrastra y suelta imágenes JPG, PNG o WebP aquí, o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ⚡ Se optimizan y convierten a WebP automáticamente en tu navegador antes de subir.
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-2 font-medium">
            <X className="h-4 w-4" />
            {error}
          </p>
        )}
      </div>

      {/* Cola de estado de procesamiento y optimización WebP */}
      {queueItems.length > 0 && (
        <div className="p-3.5 border rounded-lg bg-muted/40 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-foreground">
              {uploading ? (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              {batchStatusText || "Optimización WebP finalizada"}
            </span>
            <button
              type="button"
              onClick={() => setQueueItems([])}
              className="text-[11px] text-muted-foreground hover:underline"
            >
              Limpiar resumen
            </button>
          </div>

          <div className="space-y-2">
            {queueItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs bg-background p-2.5 rounded-md border shadow-sm gap-2"
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="w-9 h-9 object-cover rounded border flex-shrink-0 bg-muted"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded border bg-muted flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="truncate flex-1">
                    <span className="font-semibold text-foreground truncate block">
                      {item.originalFileName}
                    </span>

                    {item.status === 'converting' && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                        <Loader2 className="h-3 w-3 animate-spin inline" />
                        Convirtiendo localmente a WebP en el navegador...
                      </span>
                    )}

                    {item.status === 'uploading' && (
                      <span className="text-blue-600 dark:text-blue-400 font-medium block mt-0.5">
                        {item.originalFileName} — {item.originalSizeFormatted} → {item.webpSizeFormatted} WebP ({item.reductionPercentage}% menos) — Subiendo...
                      </span>
                    )}

                    {item.status === 'completed' && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
                        {item.originalFileName} — {item.originalSizeFormatted} → {item.webpSizeFormatted} WebP ({item.reductionPercentage}% menos) — ✓ Listo
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="text-red-500 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="h-3 w-3" />
                        {item.errorMessage || "Error durante el proceso"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de imágenes del proyecto con Drag & Drop y eliminación directa */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isFirst = index === 0
            const isDragging = draggedIndex === index
            const isOver = dragOverIndex === index

            return (
              <div
                key={index}
                draggable={!disabled && !uploading}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-lg border overflow-hidden bg-muted transition-all select-none ${
                  isDragging ? "opacity-40 scale-95 ring-2 ring-primary" : ""
                } ${isOver ? "ring-2 ring-blue-500 scale-105" : ""}`}
              >
                <div className="aspect-square relative overflow-hidden bg-black/5">
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Badge de Portada / Orden */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    {isFirst ? (
                      <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <Star className="h-3 w-3 fill-white" />
                        Portada
                      </span>
                    ) : (
                      <span className="bg-black/60 text-white font-semibold text-[10px] px-1.5 py-0.5 rounded shadow">
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Icono de arrastrar */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white p-1 rounded opacity-70 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-3.5 w-3.5" />
                  </div>

                  {/* Botón Eliminar SIEMPRE VISIBLE */}
                  <button
                    type="button"
                    onClick={(e) => removeImage(e, index)}
                    disabled={disabled || uploading}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer z-10"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Botones de mover Izquierda / Derecha para móviles y fácil ordenamiento */}
                  <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={(e) => moveImage(e, index, index - 1)}
                        disabled={disabled || uploading}
                        className="bg-black/70 hover:bg-black text-white p-1 rounded shadow cursor-pointer"
                        title="Mover a la izquierda"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => moveImage(e, index, index + 1)}
                        disabled={disabled || uploading}
                        className="bg-black/70 hover:bg-black text-white p-1 rounded shadow cursor-pointer"
                        title="Mover a la derecha"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
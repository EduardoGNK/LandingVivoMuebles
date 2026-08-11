"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Trash2, ArrowLeft, ArrowRight, GripVertical, Star } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ images, onImagesChange, disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      setError(null)

      try {
        const uploadedUrls: string[] = []

        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || "Error al subir imagen")
          }

          const { url } = await response.json()
          uploadedUrls.push(url)
        }

        onImagesChange([...images, ...uploadedUrls])
      } catch (err: any) {
        console.error("Error uploading images:", err)
        setError(err.message || "Error al subir la imagen. Inténtalo de nuevo.")
      } finally {
        setUploading(false)
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
          <label className="text-sm font-medium">
            Imágenes del proyecto ({images.length})
          </label>
          {images.length > 1 && (
            <span className="text-xs text-muted-foreground">
              💡 Arrastra las imágenes o usa ◀ ▶ para cambiar el orden de publicación
            </span>
          )}
        </div>

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
            <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
          ) : isDragActive ? (
            <p className="text-sm text-muted-foreground">Suelta las imágenes aquí...</p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta imágenes aquí, o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF, WebP hasta 10MB
              </p>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1 mt-2">
            <X className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>

      {/* Grid de imágenes con Drag & Drop y eliminación directa */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => {
            const isFirst = index === 0
            const isDragging = draggedIndex === index
            const isOver = dragOverIndex === index

            return (
              <div
                key={index}
                draggable={!disabled}
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
                    disabled={disabled}
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
                        disabled={disabled}
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
                        disabled={disabled}
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
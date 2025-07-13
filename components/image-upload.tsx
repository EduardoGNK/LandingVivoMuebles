"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  disabled?: boolean
}

export function ImageUpload({ images, onImagesChange, disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    
    try {
      const uploadedUrls: string[] = []
      
      for (const file of acceptedFiles) {
        // Por ahora, convertimos a base64 para simular subida
        // En producción, aquí subirías a un servicio como Cloudinary o AWS S3
        const reader = new FileReader()
        const url = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
        uploadedUrls.push(url)
      }
      
      onImagesChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploading(false)
    }
  }, [images, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled: disabled || uploading
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Imágenes del proyecto</label>
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
                PNG, JPG, GIF hasta 10MB
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
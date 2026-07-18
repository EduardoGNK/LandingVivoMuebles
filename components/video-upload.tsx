"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { X, Video, Upload, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoUploadProps {
  videos: string[]
  onVideosChange: (videos: string[]) => void
  disabled?: boolean
  maxVideos?: number
}

export function VideoUpload({
  videos,
  onVideosChange,
  disabled = false,
  maxVideos = 3,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (videos.length >= maxVideos) {
        setError(`Máximo ${maxVideos} videos por proyecto.`)
        return
      }

      const filesToUpload = acceptedFiles.slice(0, maxVideos - videos.length)
      setUploading(true)
      setError(null)

      try {
        const uploadedUrls: string[] = []

        for (let i = 0; i < filesToUpload.length; i++) {
          const file = filesToUpload[i]
          setUploadProgress(
            `Subiendo video ${i + 1} de ${filesToUpload.length} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`
          )

          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || "Error al subir video")
          }

          const { url } = await response.json()
          uploadedUrls.push(url)
        }

        onVideosChange([...videos, ...uploadedUrls])
      } catch (err: any) {
        console.error("Error uploading videos:", err)
        setError(err.message || "Error al subir el video. Inténtalo de nuevo.")
      } finally {
        setUploading(false)
        setUploadProgress("")
      }
    },
    [videos, onVideosChange, maxVideos]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/quicktime": [".mov"],
      "video/webm": [".webm"],
      "video/avi": [".avi"],
    },
    maxSize: 200 * 1024 * 1024, // 200MB
    disabled: disabled || uploading || videos.length >= maxVideos,
    onDropRejected: (rejectedFiles) => {
      const reason = rejectedFiles[0]?.errors[0]?.code
      if (reason === "file-too-large") {
        setError("El video supera el límite de 200MB.")
      } else if (reason === "file-invalid-type") {
        setError("Formato no soportado. Usa MP4, MOV, WebM o AVI.")
      } else {
        setError("Error al procesar el archivo.")
      }
    },
  })

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index)
    onVideosChange(newVideos)
  }

  const isAtLimit = videos.length >= maxVideos

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Videos del proyecto{" "}
            <span className="text-muted-foreground">
              ({videos.length}/{maxVideos})
            </span>
          </label>
          {videos.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Se reproducirán en la página del proyecto
            </span>
          )}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isAtLimit
              ? "border-muted-foreground/10 cursor-not-allowed opacity-50"
              : isDragActive
              ? "border-blue-500 bg-blue-500/5 cursor-copy"
              : disabled || uploading
              ? "border-muted-foreground/25 opacity-50 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer"
          }`}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="mx-auto h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-sm text-muted-foreground">{uploadProgress}</p>
              <p className="text-xs text-muted-foreground">
                Los videos pueden tardar un momento...
              </p>
            </div>
          ) : isAtLimit ? (
            <div className="flex flex-col items-center gap-2">
              <Video className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Límite de {maxVideos} videos alcanzado
              </p>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="mx-auto h-8 w-8 text-blue-500" />
              <p className="text-sm text-blue-500 font-medium">
                Suelta el video aquí
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Video className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arrastra un video aquí, o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, MOV, WebM, AVI · Máximo 200MB por video
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <X className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>

      {/* Preview de videos */}
      {videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((videoUrl, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border bg-black"
            >
              {/* Video nativo para preview */}
              <video
                src={videoUrl}
                className="w-full max-h-48 object-contain"
                preload="metadata"
                controls={false}
                muted
                onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const vid = e.currentTarget as HTMLVideoElement
                  vid.pause()
                  vid.currentTime = 0
                }}
              />

              {/* Overlay play icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="bg-black/60 rounded-full p-3">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>

              {/* Etiqueta y botón eliminar */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                  Video {index + 1}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeVideo(index)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

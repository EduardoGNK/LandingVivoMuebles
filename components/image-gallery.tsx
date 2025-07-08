"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  alt: string
  compact?: boolean // Nuevo prop para modo compacto
}

export function ImageGallery({ images, alt, compact = false }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  if (images.length === 0) return null

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        <div className={`relative overflow-hidden rounded-lg bg-muted ${
          compact 
            ? "aspect-[4/3] max-h-[400px]" // Modo compacto: altura limitada
            : "aspect-square" // Modo normal: cuadrado
        }`}>
          <Image
            src={images[currentIndex]}
            alt={`${alt} - Imagen ${currentIndex + 1}`}
            fill
            className="object-cover cursor-pointer transition-transform hover:scale-105"
            onClick={openFullscreen}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={prevImage}
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={nextImage}
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails - solo mostrar en modo no compacto */}
        {images.length > 1 && !compact && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
              >
                <Image
                  src={image}
                  alt={`${alt} - Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeFullscreen}
          >
            <div className="relative max-h-full max-w-full p-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={closeFullscreen}
                className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="relative aspect-square max-h-[80vh] max-w-[80vw] overflow-hidden rounded-lg">
                <Image
                  src={images[currentIndex]}
                  alt={`${alt} - Imagen ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="80vw"
                  priority
                />
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="mt-4 text-center text-white">
                    <span className="text-sm">
                      {currentIndex + 1} de {images.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ImageGalleryProps {
  images: string[]
  videos?: string[]
  alt: string
  compact?: boolean // Nuevo prop para modo compacto
}

export function ImageGallery({ images, videos = [], alt, compact = false }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const mediaItems = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ]

  const nextImage = () => {
    setIsVideoPlaying(false)
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setIsVideoPlaying(false)
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const goToImage = (index: number) => {
    setIsVideoPlaying(false)
    setCurrentIndex(index)
  }

  const openFullscreen = () => {
    setIsVideoPlaying(false)
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  // Touch handlers para swipe en galería
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    // Evitamos cerrar el modal en evento táctil simple
    e.stopPropagation()
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  if (mediaItems.length === 0) return null

  return (
    <>
      {/* Main Gallery */}
      <div className="relative">
        <div 
          className={`relative overflow-hidden rounded-lg bg-muted ${
            compact 
              ? "aspect-[4/3] max-h-[400px]" // Modo compacto: altura limitada
              : "aspect-square" // Modo normal: cuadrado
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {mediaItems[currentIndex].type === "image" ? (
            <Image
              src={mediaItems[currentIndex].url}
              alt={`${alt} - Imagen ${currentIndex + 1}`}
              fill
              className="object-cover cursor-pointer transition-transform hover:scale-105"
              onClick={openFullscreen}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              {isVideoPlaying ? (
                <video
                  src={mediaItems[currentIndex].url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                  onEnded={() => setIsVideoPlaying(false)}
                />
              ) : (
                <div 
                  className="relative w-full h-full cursor-pointer flex items-center justify-center"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <video
                    src={mediaItems[currentIndex].url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/35 hover:bg-black/45 transition-colors flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-5 shadow-2xl transition-transform hover:scale-110">
                      <Play className="h-10 w-10 text-white fill-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mediaItems.length > 1 && !isVideoPlaying && (
            <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          {mediaItems.length > 1 && !isVideoPlaying && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex gap-2">
                {mediaItems.map((_, index) => (
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
        {mediaItems.length > 1 && !compact && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/50"
                }`}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.url}
                    alt={`${alt} - Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                  </div>
                )}
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative max-h-full max-w-full p-4" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                onClick={closeFullscreen}
                className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="relative w-[80vw] h-[60vh] sm:h-[80vh] overflow-hidden rounded-lg bg-black flex items-center justify-center">
                {mediaItems[currentIndex].type === "image" ? (
                  <Image
                    src={mediaItems[currentIndex].url}
                    alt={`${alt} - Imagen ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="80vw"
                    priority
                  />
                ) : (
                  <video
                    src={mediaItems[currentIndex].url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                )}
              </div>

              {mediaItems.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevImage()
                    }}
                    className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  
                  <div className="mt-4 text-center text-white">
                    <span className="text-sm">
                      {currentIndex + 1} de {mediaItems.length}
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
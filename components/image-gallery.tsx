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
      <div className="relative w-full max-w-full overflow-hidden">
        <div 
          className={`relative w-full overflow-hidden rounded-xl bg-slate-950/90 dark:bg-black/90 shadow-md ${
            compact 
              ? "aspect-[4/3] max-h-[340px] sm:max-h-[420px]" 
              : "aspect-[4/3] sm:aspect-square max-h-[380px] sm:max-h-[520px]"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {mediaItems[currentIndex].type === "image" ? (
            <div className="relative w-full h-full cursor-pointer overflow-hidden" onClick={openFullscreen}>
              <Image
                src={mediaItems[currentIndex].url}
                alt={`${alt} - Imagen ${currentIndex + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
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
                  className="relative w-full h-full cursor-pointer flex items-center justify-center overflow-hidden"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <video
                    src={mediaItems[currentIndex].url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors flex items-center justify-center z-10">
                    <div className="bg-black/60 backdrop-blur-md rounded-full p-4 sm:p-5 shadow-2xl transition-transform hover:scale-110 border border-white/20">
                      <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {mediaItems.length > 1 && !isVideoPlaying && (
            <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4 pointer-events-none">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/60 text-white hover:bg-black/80 pointer-events-auto border border-white/10 shadow"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-black/60 text-white hover:bg-black/80 pointer-events-auto border border-white/10 shadow"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          )}
          {mediaItems.length > 1 && !isVideoPlaying && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="flex gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full transition-colors pointer-events-auto ${
                      index === currentIndex ? "bg-white scale-125" : "bg-white/50"
                    }`}
                    aria-label={`Ir a elemento ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {mediaItems.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary ring-2 ring-primary/20 scale-105"
                    : "border-transparent opacity-75 hover:opacity-100 hover:border-muted-foreground/50"
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
                      className="w-full h-full object-cover opacity-60"
                      preload="metadata"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6"
            onClick={closeFullscreen}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full max-w-5xl h-[80vh] sm:h-[85vh] rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                onClick={closeFullscreen}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/70 text-white hover:bg-black z-30 border border-white/20 shadow-lg"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </Button>
              
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                {mediaItems[currentIndex].type === "image" ? (
                  <Image
                    src={mediaItems[currentIndex].url}
                    alt={`${alt} - Imagen ${currentIndex + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="100vw"
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
                    className="absolute left-3 top-1/2 h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/20 z-20"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextImage()
                    }}
                    className="absolute right-3 top-1/2 h-10 w-10 sm:h-12 sm:w-12 -translate-y-1/2 rounded-full bg-black/60 text-white hover:bg-black/90 border border-white/20 z-20"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Button>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs sm:text-sm border border-white/10 z-20">
                    {currentIndex + 1} / {mediaItems.length}
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
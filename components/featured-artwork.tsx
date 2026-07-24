"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { getArtworksFromDatabase } from "@/data/artworks"
import { ImageGallery } from "@/components/image-gallery"

export default function FeaturedArtwork() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar proyectos de la base de datos
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const artworks = await getArtworksFromDatabase()
        setFeaturedArtworks(artworks.slice(0, 5))
      } catch (error) {
        console.error('Error loading artworks:', error)
        setFeaturedArtworks([])
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  const currentArtwork = featuredArtworks[currentIndex]

  const nextProject = () => {
    setCurrentIndex((prev) => (prev === featuredArtworks.length - 1 ? 0 : prev + 1))
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredArtworks.length - 1 : prev - 1))
  }

  // Touch handlers para cambiar de proyecto en móvil
  const [projTouchStart, setProjTouchStart] = useState<number | null>(null)
  const [projTouchEnd, setProjTouchEnd] = useState<number | null>(null)

  const handleProjTouchStart = (e: React.TouchEvent) => {
    setProjTouchEnd(null)
    setProjTouchStart(e.targetTouches[0].clientX)
  }

  const handleProjTouchMove = (e: React.TouchEvent) => {
    setProjTouchEnd(e.targetTouches[0].clientX)
  }

  const handleProjTouchEnd = () => {
    if (!projTouchStart || !projTouchEnd) return
    const distance = projTouchStart - projTouchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) nextProject()
    else if (isRightSwipe) prevProject()
  }

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Mostrar mensaje si no hay proyectos
  if (featuredArtworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay proyectos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
        <motion.div
          key={currentArtwork?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full overflow-hidden"
        >
          {/* Galería interactiva con soporte de imágenes y videos */}
          <ImageGallery
            key={currentArtwork?.id}
            images={currentArtwork?.gallery || []}
            videos={currentArtwork?.videos || []}
            alt={currentArtwork?.title || "Proyecto"}
            compact={true}
          />
        </motion.div>
        <div className="flex flex-col justify-between p-4 sm:p-6">
          <motion.div
            key={currentArtwork?.id + "-info"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">{currentArtwork?.title || "Proyecto"}</h3>
              <p className="text-sm sm:text-base text-muted-foreground break-words mt-0.5">{currentArtwork?.artist || "Vivo Muebles"}</p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground dark:text-gray-300 leading-relaxed break-words">
              {currentArtwork?.description || "Descripción del proyecto no disponible."}
            </p>

            <div className="flex flex-wrap gap-2 text-xs pt-1">
              {currentArtwork?.year && (
                <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">{currentArtwork.year}</span>
              )}
              {currentArtwork?.medium && (
                <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 font-medium">{currentArtwork.medium}</span>
              )}
            </div>
          </motion.div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className="text-xs text-muted-foreground font-medium">
                Proyecto {currentIndex + 1} de {featuredArtworks.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={prevProject}
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  aria-label="Proyecto anterior"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={nextProject}
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                  aria-label="Siguiente proyecto"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
            <Link
              href={`/project/${currentArtwork?.id}`}
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 text-center shadow transition-colors"
            >
              Ver Detalles del Proyecto
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

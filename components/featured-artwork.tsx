"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { getArtworksFromDatabase, INITIAL_PROJECTS } from "@/data/artworks"
import { ImageGallery } from "@/components/image-gallery"

export default function FeaturedArtwork() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [canTruncate, setCanTruncate] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  // Cargar proyectos de la base de datos y filtrar/ordenar destacados
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const artworks = await getArtworksFromDatabase()
        
        // Separar proyectos destacados y no destacados
        const markedFeatured = artworks
          .filter((a: any) => a.isFeatured)
          .sort((a: any, b: any) => (a.featuredOrder || 0) - (b.featuredOrder || 0))

        const nonFeatured = artworks.filter((a: any) => !a.isFeatured)

        // Si hay menos de 6 destacados marcados, autocompletar con los no destacados
        let finalFeatured = [...markedFeatured]
        if (finalFeatured.length < 6) {
          const needed = 6 - finalFeatured.length
          finalFeatured = [...finalFeatured, ...nonFeatured.slice(0, needed)]
        }

        if (finalFeatured.length === 0) {
          setFeaturedArtworks(INITIAL_PROJECTS as any)
        } else {
          setFeaturedArtworks(finalFeatured.slice(0, 6))
        }
      } catch (error) {
        console.error('Error loading artworks:', error)
        setFeaturedArtworks(INITIAL_PROJECTS as any)
      } finally {
        setLoading(false)
      }
    }

    loadArtworks()
  }, [])

  const currentArtwork = featuredArtworks[currentIndex]

  // Detectar si el texto realmente desborda el límite de líneas
  useEffect(() => {
    if (!isExpanded && descriptionRef.current) {
      const el = descriptionRef.current
      setCanTruncate(el.scrollHeight > el.clientHeight + 2)
    }
  }, [currentArtwork?.id, currentArtwork?.description, isExpanded])

  const nextProject = () => {
    setIsExpanded(false)
    setCurrentIndex((prev) => (prev === featuredArtworks.length - 1 ? 0 : prev + 1))
  }

  const prevProject = () => {
    setIsExpanded(false)
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
        <div 
          className="flex flex-col justify-between p-4 sm:p-6"
          onTouchStart={handleProjTouchStart}
          onTouchMove={handleProjTouchMove}
          onTouchEnd={handleProjTouchEnd}
        >
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

            <div>
              <p 
                ref={descriptionRef}
                className={`text-xs sm:text-sm md:text-base text-muted-foreground dark:text-gray-300 leading-relaxed break-words ${!isExpanded ? "line-clamp-4 sm:line-clamp-5" : ""}`}
              >
                {currentArtwork?.description || "Descripción del proyecto no disponible."}
              </p>
              {(canTruncate || isExpanded) && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-1 inline-block text-xs font-semibold text-primary underline underline-offset-2 hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {isExpanded ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

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

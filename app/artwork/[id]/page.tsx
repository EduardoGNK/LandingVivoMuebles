"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/image-gallery"
import { artworks } from "@/data/artworks"

export default function ArtworkPage() {
  const params = useParams()
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : "1"

  const artwork = artworks.find((art) => art.id === id) || artworks[0]

  return (
    <div className="container px-4 py-4 sm:py-8 md:py-16 max-w-full overflow-x-hidden">
      <Button variant="ghost" asChild className="mb-4 sm:mb-6">
        <Link href="/gallery" className="flex items-center gap-2 text-xs sm:text-sm">
          <ArrowLeft className="h-4 w-4" />
          Volver a la Galería
        </Link>
      </Button>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-full overflow-hidden"
        >
          <ImageGallery 
            images={artwork.gallery || [artwork.image]} 
            alt={artwork.title}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 w-full max-w-full overflow-hidden"
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{artwork.title}</h1>
            <p className="text-base sm:text-xl text-muted-foreground break-words">{artwork.artist}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">{artwork.year}</span>
            <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 font-medium">{artwork.medium}</span>
            <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">{artwork.dimensions}</span>
          </div>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground dark:text-gray-300 break-words">
            {artwork.description}
          </p>

          <div className="mt-2 pt-4 border-t border-border">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Ubicación / Referencia</h3>
            <p className="text-base sm:text-xl font-semibold break-words mt-0.5">{artwork.price}</p>
          </div>

          <div className="mt-auto pt-6">
            <Link href="/#contact-form" passHref className="w-full block">
              <Button size="lg" className="w-full text-sm sm:text-base font-semibold shadow-md">
                Solicitar Cotización
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

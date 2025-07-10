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
    <div className="container px-4 py-8 md:py-16">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/gallery" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a la Galería
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
          className="flex flex-col gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <p className="text-xl text-muted-foreground">{artwork.artist}</p>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>{artwork.year}</div>
            <div>{artwork.medium}</div>
            <div>{artwork.dimensions}</div>
          </div>

          <p className="text-lg">{artwork.description}</p>

          <div className="mt-4">
            <h3 className="text-lg font-medium">Precio</h3>
            <p className="text-2xl font-bold">{artwork.price}</p>
          </div>

          <div className="mt-auto pt-8">
            <Button size="lg" className="w-full">
              Solicitar Cotización
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

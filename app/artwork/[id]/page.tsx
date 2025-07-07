"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { artworks } from "@/data/artworks"

export default function ArtworkPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : params.id[0]

  const artwork = artworks.find((art) => art.id === id) || artworks[0]

  return (
    <div className="container px-4 py-12 md:py-24">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/gallery" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-lg bg-muted"
        >
          <Image
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-background"
          />
          <div className="absolute bottom-4 right-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
              onClick={() => window.open(artwork.image, "_blank")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 3 6 6m0 0-6 6m6-6H8a5 5 0 0 0-5 5v6" />
              </svg>
            </motion.button>
          </div>
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
            <h3 className="text-lg font-medium">Price</h3>
            <p className="text-2xl font-bold">{artwork.price}</p>
          </div>

          <div className="mt-auto pt-8">
            <Button size="lg" className="w-full">
              Inquire About This Piece
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { artworks } from "@/data/artworks"

export default function FeaturedArtwork() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredArtworks = artworks.slice(0, 3)
  const currentArtwork = featuredArtworks[currentIndex]

  return (
    <div className="relative overflow-hidden rounded-lg bg-background">
      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          key={currentArtwork.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto"
        >
          <Image
            src={currentArtwork.image || "/placeholder.svg"}
            alt={currentArtwork.title}
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
        </motion.div>
        <div className="flex flex-col justify-between p-6">
          <motion.div
            key={currentArtwork.id + "-info"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-2xl font-bold">{currentArtwork.title}</h3>
              <p className="text-lg text-muted-foreground">{currentArtwork.artist}</p>
            </div>
            <p>{currentArtwork.description}</p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div>{currentArtwork.year}</div>
              <div>{currentArtwork.medium}</div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentIndex((prev) => (prev === 0 ? featuredArtworks.length - 1 : prev - 1))}
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev === featuredArtworks.length - 1 ? 0 : prev + 1))}
                className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <Link
              href={`/artwork/${currentArtwork.id}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View Artwork Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

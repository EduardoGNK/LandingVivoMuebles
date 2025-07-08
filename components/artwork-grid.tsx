"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

import { artworks } from "@/data/artworks"

export function ArtworkGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      <div className="sm:hidden">
        {/* Mobile version without animations */}
        <div className="grid grid-cols-2 gap-3">
          {artworks.map((artwork) => (
            <div key={artwork.id}>
              <Link href={`/artwork/${artwork.id}`} className="group block overflow-hidden rounded-lg">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-xs">{artwork.title}</h3>
                  <p className="text-xs text-muted-foreground">{artwork.artist}</p>
                  <p className="mt-1 text-xs font-medium">{artwork.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
        className="hidden sm:grid sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
        {/* Desktop/Tablet version with animations */}
      {artworks.map((artwork) => (
        <motion.div key={artwork.id} variants={item}>
          <Link href={`/artwork/${artwork.id}`} className="group block overflow-hidden rounded-lg">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground">{artwork.artist}</p>
              <p className="mt-2 text-sm font-medium">{artwork.price}</p>
            </div>
          </Link>
        </motion.div> 
      ))}
    </motion.div>
    </>
  )
}

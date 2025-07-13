"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"

interface Project {
  id: string
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  description: string
  price: string
  image: string
  gallery: string[]
}

interface GalleryPreviewProps {
  projects?: Project[]
}

export function GalleryPreview({ projects }: GalleryPreviewProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Si no se pasan proyectos, usar un array vacío
  const previewProjects = projects ? projects.slice(0, 6) : []

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-3"
    >
      {previewProjects.map((project) => (
        <motion.div key={project.id} variants={item}>
          <Link href={`/project/${project.id}`} className="group block overflow-hidden rounded-lg bg-muted/30">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-2 sm:p-3 md:p-4 bg-zinc-300/20 dark:bg-zinc-900/80 rounded-b-lg">
              <h3 className="font-medium text-xs sm:text-sm md:text-base">{project.title}</h3>
              <p className="text-xs text-muted-foreground">{project.artist}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

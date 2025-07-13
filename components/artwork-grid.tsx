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

interface ArtworkGridProps {
  projects?: Project[]
}

export function ArtworkGrid({ projects }: ArtworkGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  // Si no se pasan proyectos, usar los datos estáticos como fallback
  const displayProjects = projects || []

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
          {displayProjects.map((project) => (
            <div key={project.id}>
              <Link href={`/project/${project.id}`} className="group block overflow-hidden rounded-lg">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-2">
                  <h3 className="font-medium text-xs">{project.title}</h3>
                  <p className="text-xs text-muted-foreground">{project.artist}</p>
                  <p className="mt-1 text-xs font-medium">{project.price}</p>
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
      {displayProjects.map((project) => (
        <motion.div key={project.id} variants={item}>
          <Link href={`/project/${project.id}`} className="group block overflow-hidden rounded-lg">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                  sizes="(max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <h3 className="font-medium">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.artist}</p>
              <p className="mt-2 text-sm font-medium">{project.price}</p>
            </div>
          </Link>
        </motion.div> 
      ))}
    </motion.div>
    </>
  )
}

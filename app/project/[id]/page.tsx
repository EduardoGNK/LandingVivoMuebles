"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/image-gallery"

interface Project {
  id: string
  title: string
  comuna: string
  startDate: string
  endDate: string
  workType: string
  description: string
  propertyType: string
  location: string
  gallery: string[]
  videos: string[]
  status: string
  createdAt: string
}

export default function ProjectPage() {
  const params = useParams()
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : ""
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProject(data)
      }
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:py-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container px-4 py-8 md:py-16">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Button asChild>
            <Link href="/gallery">Volver a la Galería</Link>
          </Button>
        </div>
      </div>
    )
  }

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
          className="flex flex-col gap-4 sm:gap-6 w-full max-w-full overflow-hidden"
        >
          <ImageGallery 
            images={project.gallery || []} 
            videos={project.videos || []}
            alt={project.title}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 w-full max-w-full overflow-hidden"
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{project.title}</h1>
            <p className="text-base sm:text-xl text-muted-foreground break-words">{project.comuna}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {project.startDate && project.endDate && (
              <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
                {project.startDate} - {project.endDate}
              </span>
            )}
            {project.workType && (
              <span className="rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 font-medium">
                {project.workType}
              </span>
            )}
            {project.propertyType && (
              <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
                {project.propertyType}
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground dark:text-gray-300 break-words">
            {project.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-border">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Tipo de vivienda</h3>
              <p className="text-base sm:text-xl font-semibold break-words mt-0.5">{project.propertyType}</p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Ubicación</h3>
              <p className="text-base sm:text-xl font-semibold break-words mt-0.5">{project.location}</p>
            </div>
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
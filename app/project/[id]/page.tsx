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
            images={project.gallery || []} 
            alt={project.title}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.comuna}</p>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>{project.startDate} - {project.endDate}</div>
            <div>{project.workType}</div>
            <div>{project.propertyType}</div>
          </div>

          <p className="text-lg">{project.description}</p>

          <div className="mt-4">
            <h3 className="text-lg font-medium">Tipo de vivienda</h3>
            <p className="text-2xl font-bold">{project.propertyType}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium">Ubicación</h3>
            <p className="text-xl">{project.location}</p>
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
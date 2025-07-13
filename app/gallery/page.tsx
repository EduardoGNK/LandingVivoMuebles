"use client"

import { useState, useEffect } from "react"
import { ArtworkGrid } from "@/components/artwork-grid"

interface Project {
  id: string
  title: string
  artist: string
  year: string
  medium: string
  dimensions: string
  description: string
  price: string
  location: string
  gallery: string[]
  status: string
  createdAt: string
}

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  // Transformar proyectos a formato compatible con ArtworkGrid
  const transformedProjects = projects.map(project => ({
    id: project.id,
    title: project.title,
    artist: project.artist,
    year: project.year,
    medium: project.medium,
    dimensions: project.dimensions,
    description: project.description,
    price: project.price,
    image: project.gallery[0] || "/placeholder.jpg",
    gallery: project.gallery,
  }))

  return (
    <div className="container px-4 py-8 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Nuestros Proyectos
          </h1>
          <p className="max-w-[800px] text-lg text-muted-foreground">
            Explora nuestra colección de proyectos de remodelación y cocinas sustentables. 
            Cada proyecto es único y diseñado específicamente para las necesidades de nuestros clientes.
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay proyectos disponibles en este momento.</p>
          </div>
        ) : (
          <ArtworkGrid projects={transformedProjects} />
        )}
      </div>
    </div>
  )
}

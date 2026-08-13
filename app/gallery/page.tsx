"use client"

import { useState, useEffect } from "react"
import { ArtworkGrid } from "@/components/artwork-grid"

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

import { INITIAL_PROJECTS } from "@/data/artworks"

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
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data)
        } else {
          setProjects(INITIAL_PROJECTS as any)
        }
      } else {
        setProjects(INITIAL_PROJECTS as any)
      }
    } catch (error) {
      console.error("Error fetching projects, using initial fallback:", error)
      setProjects(INITIAL_PROJECTS as any)
    } finally {
      setLoading(false)
    }
  }

  const displayProjects = projects.length > 0 ? projects : (INITIAL_PROJECTS as any)

  // Transformar proyectos a formato compatible con ArtworkGrid
  const transformedProjects = displayProjects.map((project: any) => ({
    id: project.id,
    title: project.title,
    artist: project.comuna || "Vivo Muebles",
    year: `${project.startDate || "2023"} - ${project.endDate || "2023"}`,
    medium: project.workType || "Cocina completa",
    dimensions: project.propertyType || "Proporción estándar",
    description: project.description,
    price: project.location || "Consultar",
    image: project.gallery && project.gallery.length > 0 ? project.gallery[0] : "/placeholder.jpg",
    gallery: project.gallery || [],
  }))

  return (
    <div className="container px-4 py-8 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Nuestros Proyectos
          </h1>
          <p className="max-w-[800px] text-sm sm:text-base text-muted-foreground">
            Explora nuestra colección de proyectos de remodelación y cocinas sustentables. 
            Cada proyecto es único y diseñado específicamente para las necesidades de nuestros clientes.
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ArtworkGrid projects={transformedProjects} />
        )}
      </div>
    </div>
  )
}

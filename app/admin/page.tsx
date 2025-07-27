"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, LogOut, Eye, Edit, Trash2, X, Save } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ImageUpload } from "@/components/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const workTypes = [
  "Remodelación de cocinas",
  "Remodelación de baños",
  "Ampliaciones de viviendas",
  "Construcción de terrazas",
  "Instalación de pisos flotantes o cerámicos",
  "Cambio de techumbre",
  "Renovación de fachadas",
  "Pintura interior y exterior",
  "Instalación de ventanales y termopaneles",
  "Construcción de quinchos o áreas de BBQ",
  "Habilitación de oficinas o espacios comerciales",
  "Remodelación de dormitorios",
  "Instalación de muebles a medida",
  "Aislamiento térmico y acústico",
  "Revestimientos decorativos en muros"
]

export default function AdminPanel() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    comuna: "Santiago",
    startDate: "",
    endDate: "",
    workType: "",
    description: "",
    propertyType: "",
    location: "",
    gallery: [] as string[]
  })
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setFormData({
          title: "",
          comuna: "Santiago",
          startDate: "",
          endDate: "",
          workType: "",
          description: "",
          propertyType: "",
          location: "",
          gallery: []
        })
        fetchProjects()
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project.id)
    setFormData({
      title: project.title,
      comuna: project.comuna,
      startDate: project.startDate,
      endDate: project.endDate,
      workType: project.workType,
      description: project.description,
      propertyType: project.propertyType,
      location: project.location,
      gallery: project.gallery || []
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    
    setSubmitting(true)
    
    try {
      const res = await fetch(`/api/projects/${editingProject}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setEditingProject(null)
        setFormData({
          title: "",
          comuna: "Santiago",
          startDate: "",
          endDate: "",
          workType: "",
          description: "",
          propertyType: "",
          location: "",
          gallery: []
        })
        fetchProjects()
      }
    } catch (error) {
      console.error("Error updating project:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?")) return
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const handleGalleryChange = (images: string[]) => {
    setFormData({ ...formData, gallery: images })
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      comuna: "Santiago",
      startDate: "",
      endDate: "",
      workType: "",
      description: "",
      propertyType: "",
      location: "",
      gallery: []
    })
  }

  return (
    <AuthGuard>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Bienvenido, {session?.user?.name || session?.user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulario para crear/editar proyectos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingProject ? (
                  <>
                    <Edit className="h-5 w-5" />
                    Editar Proyecto
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Crear Nuevo Proyecto
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingProject ? handleUpdate : handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título del proyecto *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    disabled={submitting}
                    placeholder="Ej: Cocina Moderna Minimalista"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="comuna" className="text-sm font-medium">
                      Comuna *
                    </label>
                    <Input
                      id="comuna"
                      value={formData.comuna}
                      onChange={(e) => setFormData({...formData, comuna: e.target.value})}
                      required
                      disabled={submitting}
                      placeholder="Ej: Las Condes"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="propertyType" className="text-sm font-medium">
                      Tipo de vivienda *
                    </label>
                    <Input
                      id="propertyType"
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      required
                      disabled={submitting}
                      placeholder="Ej: Casa, Departamento, Oficina"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-medium">
                      Fecha de inicio *
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-medium">
                      Fecha de fin *
                    </label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="workType" className="text-sm font-medium">
                    Tipo de trabajo *
                  </label>
                  <Select
                    value={formData.workType}
                    onValueChange={(value) => setFormData({...formData, workType: value})}
                    disabled={submitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de trabajo" />
                    </SelectTrigger>
                    <SelectContent>
                      {workTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Descripción *
                  </label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    disabled={submitting}
                    rows={4}
                    placeholder="Describe el proyecto, materiales utilizados, características especiales..."
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Ubicación específica *
                  </label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    disabled={submitting}
                    placeholder="Ej: Las Condes, Santiago"
                  />
                </div>

                {/* Subida de imágenes */}
                <ImageUpload
                  images={formData.gallery}
                  onImagesChange={handleGalleryChange}
                  disabled={submitting}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingProject ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      <>
                        {editingProject ? (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Actualizar Proyecto
                          </>
                        ) : (
                          "Crear Proyecto"
                        )}
                      </>
                    )}
                  </Button>
                  {editingProject && (
                    <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de proyectos */}
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Existentes ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No hay proyectos creados aún
                </p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">{project.comuna} • {project.propertyType}</p>
                          <p className="text-sm text-muted-foreground">{project.workType}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Fecha: {project.startDate} - {project.endDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ubicación: {project.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estado: <span className="capitalize">{project.status}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(project)}
                            disabled={editingProject === project.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Preview de imágenes del proyecto */}
                      {project.gallery && project.gallery.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {project.gallery.slice(0, 3).map((image, index) => (
                            <div key={index} className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-md overflow-hidden border bg-muted">
                                <img
                                  src={image}
                                  alt={`${project.title} - Imagen ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          ))}
                          {project.gallery.length > 3 && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-md border bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                +{project.gallery.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
} 
"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, LogOut, Eye, Edit, Trash2, X, Save, Star, ArrowUp, ArrowDown } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ImageUpload } from "@/components/image-upload"
import { VideoUpload } from "@/components/video-upload"
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
  videos: string[]
  status: string
  isFeatured?: boolean
  featuredOrder?: number
  createdAt: string
}

const workTypes = [
  "Remodelación de cocinas",
  "Remodelación de baños",
  "Ampliaciones de viviendas",
  "Construcción de terrazas",
  "Instalación de pisos flotantes o cerámicos",
  "Cambio de techumbre",
  "Pintura interior y exterior",
  "Construcción de quinchos o áreas de BBQ",
  "Habilitación de oficinas o espacios comerciales",
  "Remodelación de dormitorios",
  "Remodelación de Closets",
  "Construcción de muebles a medida"
]

export default function AdminPanel() {
  const { data: session } = useSession()
  const formCardRef = useRef<HTMLDivElement>(null)
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
    isFeatured: false,
    featuredOrder: 0,
    gallery: [] as string[],
    videos: [] as string[]
  })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

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
    setFormError(null)
    setFormSuccess(null)
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setFormSuccess("Proyecto creado exitosamente.")
        setFormData({
          title: "",
          comuna: "Santiago",
          startDate: "",
          endDate: "",
          workType: "",
          description: "",
          propertyType: "",
          location: "",
          isFeatured: false,
          featuredOrder: 0,
          gallery: [],
          videos: []
        })
        fetchProjects()
      } else {
        setFormError(data.error || `Error ${res.status}: No se pudo crear el proyecto`)
      }
    } catch (error: any) {
      console.error("Error creating project:", error)
      setFormError(error.message || "Error de red al crear el proyecto")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project.id)
    setFormError(null)
    setFormSuccess(null)
    setFormData({
      title: project.title || "",
      comuna: project.comuna || "Santiago",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      workType: project.workType || "",
      description: project.description || "",
      propertyType: project.propertyType || "",
      location: project.location || "",
      isFeatured: project.isFeatured ?? false,
      featuredOrder: project.featuredOrder ?? 0,
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
      videos: Array.isArray(project.videos) ? project.videos : []
    })

    // Scroll suave hasta el formulario para que el usuario sepa que la edición está activa
    setTimeout(() => {
      if (formCardRef.current) {
        formCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 50)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return
    
    setSubmitting(true)
    setFormError(null)
    setFormSuccess(null)
    
    try {
      const res = await fetch(`/api/projects/${editingProject}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setEditingProject(null)
        setFormSuccess("Proyecto actualizado exitosamente.")
        setFormData({
          title: "",
          comuna: "Santiago",
          startDate: "",
          endDate: "",
          workType: "",
          description: "",
          propertyType: "",
          location: "",
          isFeatured: false,
          featuredOrder: 0,
          gallery: [],
          videos: []
        })
        fetchProjects()
      } else {
        setFormError(data.error || `Error ${res.status}: No se pudo actualizar el proyecto`)
      }
    } catch (error: any) {
      console.error("Error updating project:", error)
      setFormError(error.message || "Error de red al actualizar el proyecto")
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickToggleFeatured = async (project: Project) => {
    try {
      const nextFeatured = !project.isFeatured
      const featuredCount = projects.filter(p => p.isFeatured).length
      const res = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          isFeatured: nextFeatured,
          featuredOrder: nextFeatured ? (project.featuredOrder || featuredCount + 1) : 0
        })
      })
      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error("Error toggling featured status:", error)
    }
  }

  const handleQuickOrderChange = async (project: Project, newOrder: number) => {
    if (newOrder < 1) return
    try {
      const res = await fetch("/api/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          isFeatured: true,
          featuredOrder: newOrder
        })
      })
      if (res.ok) {
        fetchProjects()
      }
    } catch (error) {
      console.error("Error updating order:", error)
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

  const handleVideosChange = (videos: string[]) => {
    setFormData({ ...formData, videos })
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
      isFeatured: false,
      featuredOrder: 0,
      gallery: [],
      videos: []
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
          <Card ref={formCardRef} className={`scroll-mt-6 transition-all ${editingProject ? "ring-2 ring-blue-500 border-blue-500 shadow-md" : ""}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {editingProject ? (
                    <>
                      <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span>Editar Proyecto</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        En edición
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Crear Nuevo Proyecto</span>
                    </>
                  )}
                </div>
                {editingProject && (
                  <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingProject ? handleUpdate : handleSubmit} className="space-y-6">
                {formError && (
                  <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/30">
                    ❌ {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3 text-sm rounded-md bg-green-500/15 text-green-700 dark:text-green-400 font-medium border border-green-500/30">
                    ✅ {formSuccess}
                  </div>
                )}

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

                {/* Sección de Configuración Destacada */}
                <div className="p-4 border rounded-lg bg-amber-500/10 border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="isFeatured" className="text-sm font-semibold cursor-pointer flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        Destacar en "Algunos de nuestros proyectos"
                      </label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Muestra este proyecto en el carrusel de la página de inicio (máx 6 recomendados).
                      </p>
                    </div>
                    <input
                      id="isFeatured"
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="h-5 w-5 rounded border-amber-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      disabled={submitting}
                    />
                  </div>
                  {formData.isFeatured && (
                    <div className="space-y-2 pt-3 border-t border-amber-500/20">
                      <label htmlFor="featuredOrder" className="text-sm font-medium">
                        Orden de aparición (1 = Primero, 2 = Segundo, etc.)
                      </label>
                      <Input
                        id="featuredOrder"
                        type="number"
                        min="1"
                        value={formData.featuredOrder || 1}
                        onChange={(e) => setFormData({...formData, featuredOrder: parseInt(e.target.value) || 1})}
                        disabled={submitting}
                        placeholder="Ej: 1"
                      />
                    </div>
                  )}
                </div>

                {/* Subida de imágenes */}
                <ImageUpload
                  images={formData.gallery}
                  onImagesChange={handleGalleryChange}
                  disabled={submitting}
                />

                {/* Subida de videos */}
                <VideoUpload
                  videos={formData.videos}
                  onVideosChange={handleVideosChange}
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
                  {projects.map((project) => {
                    const isBeingEdited = editingProject === project.id
                    return (
                      <div 
                        key={project.id} 
                        className={`border rounded-lg p-4 space-y-3 transition-all ${
                          isBeingEdited
                            ? "border-2 border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-md"
                            : project.isFeatured 
                              ? "border-amber-400/60 bg-amber-500/5 dark:bg-amber-500/10" 
                              : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold">{project.title}</h3>
                              {isBeingEdited && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                                  ✏️ Editando ahora
                                </span>
                              )}
                              {project.isFeatured && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                  Destacado #{project.featuredOrder || 1}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{project.comuna} • {project.propertyType}</p>
                            <p className="text-sm text-muted-foreground">{project.workType}</p>
                            <p className="text-sm text-muted-foreground">
                              Fecha: {project.startDate} - {project.endDate} | Ubicación: {project.location}
                            </p>
                            
                            {/* Controles de ordenamiento rápido */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                type="button"
                                variant={project.isFeatured ? "default" : "outline"}
                                size="sm"
                                className={project.isFeatured ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
                                onClick={() => handleQuickToggleFeatured(project)}
                              >
                                <Star className={`h-3.5 w-3.5 mr-1 ${project.isFeatured ? "fill-white" : ""}`} />
                                {project.isFeatured ? "Destacado" : "Destacar"}
                              </Button>

                              {project.isFeatured && (
                                <div className="flex items-center gap-1 border rounded-md px-2 py-0.5 bg-background">
                                  <span className="text-xs text-muted-foreground font-medium">Orden:</span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={project.featuredOrder || 1}
                                    onChange={(e) => handleQuickOrderChange(project, parseInt(e.target.value) || 1)}
                                    className="w-12 text-xs font-bold text-center bg-transparent border-0 focus:outline-none focus:ring-0"
                                  />
                                  <div className="flex flex-col">
                                    <button
                                      type="button"
                                      onClick={() => handleQuickOrderChange(project, Math.max(1, (project.featuredOrder || 1) - 1))}
                                      className="text-muted-foreground hover:text-foreground text-[10px] leading-none"
                                      title="Subir posición"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleQuickOrderChange(project, (project.featuredOrder || 1) + 1)}
                                      className="text-muted-foreground hover:text-foreground text-[10px] leading-none"
                                      title="Bajar posición"
                                    >
                                      ▼
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant={isBeingEdited ? "default" : "outline"} 
                              size="sm"
                              onClick={() => handleEdit(project)}
                              title={isBeingEdited ? "Volver arriba al formulario de edición" : "Editar proyecto"}
                              className={isBeingEdited ? "bg-blue-600 hover:bg-blue-700 text-white font-medium" : ""}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              {isBeingEdited ? "Editando" : ""}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                              title="Eliminar proyecto"
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

                      {/* Preview de videos del proyecto */}
                      {project.videos && project.videos.length > 0 && (
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground font-medium">
                            🎬 {project.videos.length} video{project.videos.length > 1 ? "s" : ""}
                          </span>
                          <div className="flex gap-2 overflow-x-auto">
                            {project.videos.slice(0, 2).map((video, index) => (
                              <div key={index} className="flex-shrink-0 relative w-16 h-12 rounded-md overflow-hidden border bg-black">
                                <video
                                  src={video}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <svg className="h-4 w-4 text-white fill-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
} 
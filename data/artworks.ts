// ============================================================
// DATOS ESTÁTICOS – catálogo base de proyectos de Vivo Muebles
// NO importar Prisma aquí: este archivo se carga en el cliente.
// La lógica de base de datos está en /app/api/projects/route.ts
// ============================================================

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "Cocina Moderna Minimalista",
    comuna: "Las Condes",
    startDate: "2023-01-15",
    endDate: "2023-03-01",
    workType: "Remodelación de cocina",
    description:
      "Cocina moderna con gabinetes blancos mate, encimera de cuarzo blanco, isla central con barra de desayuno y electrodomésticos integrados. Diseño limpio y funcional que maximiza el espacio disponible.",
    propertyType: "Departamento",
    location: "Las Condes, Santiago",
    gallery: [
      "/fotos/modern-kitchen.jpg",
      "/fotos/modern-kitchen-2.jpg",
      "/fotos/modern-kitchen-3.jpg",
      "/fotos/modern-kitchen-4.jpg",
    ],
    videos: [],
    status: "published",
    isFeatured: true,
    featuredOrder: 1,
    createdAt: "2023-01-15T00:00:00.000Z",
    updatedAt: "2023-03-01T00:00:00.000Z",
  },
  {
    id: "proj-2",
    title: "Cocina Rústica Contemporánea",
    comuna: "Vitacura",
    startDate: "2023-03-10",
    endDate: "2023-05-20",
    workType: "Remodelación completa",
    description:
      "Cocina que combina elementos rústicos con toques modernos. Gabinetes de madera natural, encimera de granito, alacenas abiertas y una hermosa chimenea como punto focal. Perfecta para familias que aman cocinar juntas.",
    propertyType: "Casa",
    location: "Vitacura, Santiago",
    gallery: [
      "/fotos/2-rustic.jpg",
      "/fotos/2-rustic-2.jpeg",
      "/fotos/2-rustic-3.jpg",
    ],
    videos: [],
    status: "published",
    isFeatured: true,
    featuredOrder: 2,
    createdAt: "2023-03-10T00:00:00.000Z",
    updatedAt: "2023-05-20T00:00:00.000Z",
  },
  {
    id: "proj-3",
    title: "Cocina Industrial Elegante",
    comuna: "Lo Barnechea",
    startDate: "2022-08-01",
    endDate: "2022-10-15",
    workType: "Diseño personalizado",
    description:
      "Cocina con estilo industrial que incorpora metal, madera y concreto. Gabinetes negros mate, encimera de concreto pulido, estanterías metálicas y una gran isla central que sirve como área de trabajo y comedor.",
    propertyType: "Casa",
    location: "Lo Barnechea, Santiago",
    gallery: [
      "/fotos/3-industrial.png",
      "/fotos/3-industrial-2.jpg",
      "/fotos/3-industrial-3.jpg",
    ],
    videos: [],
    status: "published",
    isFeatured: true,
    featuredOrder: 3,
    createdAt: "2022-08-01T00:00:00.000Z",
    updatedAt: "2022-10-15T00:00:00.000Z",
  },
  {
    id: "proj-4",
    title: "Cocina Escandinava",
    comuna: "Providencia",
    startDate: "2023-06-01",
    endDate: "2023-07-30",
    workType: "Cocina completa",
    description:
      "Cocina inspirada en el diseño escandinavo con gabinetes blancos, detalles en madera clara, encimera de mármol blanco y mucha luz natural. Diseño funcional y acogedor que prioriza la simplicidad y la eficiencia.",
    propertyType: "Departamento",
    location: "Providencia, Santiago",
    gallery: [
      "/fotos/4-escandinava.jpg",
      "/fotos/4-escandinava-2.jpg",
      "/fotos/4-escandinava-3.jpg",
    ],
    videos: [],
    status: "published",
    isFeatured: true,
    featuredOrder: 4,
    createdAt: "2023-06-01T00:00:00.000Z",
    updatedAt: "2023-07-30T00:00:00.000Z",
  },
  {
    id: "proj-5",
    title: "Cocina Mediterránea",
    comuna: "La Reina",
    startDate: "2022-11-01",
    endDate: "2023-01-10",
    workType: "Remodelación integral",
    description:
      "Cocina con influencias mediterráneas que combina colores cálidos, texturas naturales y elementos artesanales. Gabinetes de madera teñida, encimera de travertino, alacenas con puertas de cristal y detalles en azulejo.",
    propertyType: "Casa",
    location: "La Reina, Santiago",
    gallery: [
      "/fotos/rustic-kitchen.jpg",
      "/fotos/rustic-kitchen-2.jpg",
      "/fotos/rustic-kitchen-3.jpeg",
    ],
    videos: [],
    status: "published",
    isFeatured: true,
    featuredOrder: 5,
    createdAt: "2022-11-01T00:00:00.000Z",
    updatedAt: "2023-01-10T00:00:00.000Z",
  },
]

// Formato transformado compatible con ArtworkGrid y FeaturedArtwork
export const artworks = INITIAL_PROJECTS.map((p) => ({
  id: p.id,
  title: p.title,
  artist: p.comuna || "Vivo Muebles",
  year: p.startDate || "2023",
  medium: p.workType,
  dimensions: p.propertyType || "Proporción estándar",
  description: p.description,
  price: p.location || "Consultar",
  image: p.gallery[0] || "/placeholder.jpg",
  gallery: p.gallery,
  videos: p.videos,
  isFeatured: p.isFeatured,
  featuredOrder: p.featuredOrder,
}))

/**
 * Obtiene proyectos desde la API (navegador) o retorna el catálogo estático.
 * SOLO se llama desde componentes cliente ("use client").
 * En Server Components, usar la ruta API directamente.
 */
export async function getArtworksFromDatabase() {
  try {
    const response = await fetch("/api/projects", { cache: "no-store" })
    if (!response.ok) return artworks

    const raw: any[] = await response.json()
    if (!Array.isArray(raw) || raw.length === 0) return artworks

    return raw.map((p: any) => ({
      id: p.id,
      title: p.title,
      artist: p.comuna || "Vivo Muebles",
      year: p.startDate || "2023",
      medium: p.workType || "Cocina completa",
      dimensions: p.propertyType || "Proporción estándar",
      description: p.description || "Proyecto de cocina personalizado.",
      price: p.location || "Consultar",
      image: p.gallery && p.gallery.length > 0 ? p.gallery[0] : "/placeholder.jpg",
      gallery: p.gallery || [],
      videos: p.videos || [],
      isFeatured: p.isFeatured ?? false,
      featuredOrder: p.featuredOrder ?? 0,
    }))
  } catch {
    return artworks
  }
}

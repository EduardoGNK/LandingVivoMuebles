// Función para obtener proyectos de la base de datos
export async function getArtworksFromDatabase() {
  try {
    const response = await fetch('/api/projects', {
      cache: 'no-store' // Para obtener datos frescos
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener proyectos');
    }
    
    const projects = await response.json();
    
    // Transformar los proyectos de la base de datos al formato de artworks
    return projects.map((project: any) => ({
      id: project.id,
      title: project.title,
      artist: project.comuna || "Vivo Muebles", // Usar comuna como artista
      year: project.startDate || "2023",
      medium: project.workType || "Cocina completa",
      dimensions: project.propertyType || "4.0 × 3.0 m",
      description: project.description || "Proyecto de cocina personalizado por Vivo Muebles.",
      price: project.location || "Consultar precio",
      image: project.gallery && project.gallery.length > 0 ? project.gallery[0] : "/placeholder.jpg",
      gallery: project.gallery || ["/placeholder.jpg"],
      videos: project.videos || [],
      isFeatured: project.isFeatured ?? false,
      featuredOrder: project.featuredOrder ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching projects from database:', error);
    // Fallback a datos estáticos si hay error
    return getStaticArtworks();
  }
}

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Datos estáticos como fallback
function getStaticArtworks() {
  return INITIAL_PROJECTS.map((item) => ({
    id: item.id,
    title: item.title,
    artist: "Vivo Muebles",
    year: "2023",
    medium: item.workType,
    dimensions: "Proporción estándar",
    description: item.description,
    price: "Consultar",
    image: item.gallery[0] || "/placeholder.jpg",
    gallery: item.gallery,
    isFeatured: item.isFeatured,
    featuredOrder: item.featuredOrder,
  }))
}

// Exportar la función principal
export const artworks = getStaticArtworks();

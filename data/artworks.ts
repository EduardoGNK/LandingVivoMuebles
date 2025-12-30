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
    }));
  } catch (error) {
    console.error('Error fetching projects from database:', error);
    // Fallback a datos estáticos si hay error
    return getStaticArtworks();
  }
}

// Datos estáticos como fallback
function getStaticArtworks() {
  return [
    {
      id: "1",
      title: "Cocina Moderna Minimalista",
      artist: "Vivo Muebles",
      year: "2023",
      medium: "Cocina completa",
      dimensions: "4.5 × 3.2 m",
      description:
        "Cocina moderna con gabinetes blancos mate, encimera de cuarzo blanco, isla central con barra de desayuno y electrodomésticos integrados. Diseño limpio y funcional que maximiza el espacio disponible.",
      price: "$15,800",
      image: "/fotos/modern-kitchen.jpg",
      gallery: [
        "/fotos/modern-kitchen.jpg",
        "/fotos/modern-kitchen-2.jpg",
        "/fotos/modern-kitchen-3.jpg",
        "/fotos/modern-kitchen-4.jpg",
      ],
    },
    {
      id: "2",
      title: "Cocina Rústica Contemporánea",
      artist: "Vivo Muebles",
      year: "2023",
      medium: "Remodelación completa",
      dimensions: "5.2 × 3.8 m",
      description:
        "Cocina que combina elementos rústicos con toques modernos. Gabinetes de madera natural, encimera de granito, alacenas abiertas y una hermosa chimenea como punto focal. Perfecta para familias que aman cocinar juntas.",
      price: "$22,500",
      image: "/fotos/2-rustic.jpg",
      gallery: [
        "/fotos/2-rustic.jpg",
        "/fotos/2-rustic-2.jpeg",
        "/fotos/2-rustic-3.jpg",
      ],
    },
    {
      id: "3",
      title: "Cocina Industrial Elegante",
      artist: "Vivo Muebles",
      year: "2022",
      medium: "Diseño personalizado",
      dimensions: "6.0 × 4.0 m",
      description:
        "Cocina con estilo industrial que incorpora metal, madera y concreto. Gabinetes negros mate, encimera de concreto pulido, estanterías metálicas y una gran isla central que sirve como área de trabajo y comedor.",
      price: "$28,900",
      image: "/fotos/3-industrial.png",
      gallery: [
        "/fotos/3-industrial.png",
        "/fotos/3-industrial-2.jpg",
        "/fotos/3-industrial-3.jpg",
      ],
    },
    {
      id: "4",
      title: "Cocina Escandinava",
      artist: "Vivo Muebles",
      year: "2023",
      medium: "Cocina completa",
      dimensions: "4.0 × 3.5 m",
      description:
        "Cocina inspirada en el diseño escandinavo con gabinetes blancos, detalles en madera clara, encimera de mármol blanco y mucha luz natural. Diseño funcional y acogedor que prioriza la simplicidad y la eficiencia.",
      price: "$18,200",
      image: "/fotos/4-escandinava.jpg",
      gallery: [
        "/fotos/4-escandinava.jpg",
        "/fotos/4-escandinava-2.jpg",
        "/fotos/4-escandinava-3.jpg",
      ],
    },
    {
      id: "5",
      title: "Cocina Mediterránea",
      artist: "Vivo Muebles",
      year: "2022",
      medium: "Remodelación integral",
      dimensions: "5.5 × 4.2 m",
      description:
        "Cocina con influencias mediterráneas que combina colores cálidos, texturas naturales y elementos artesanales. Gabinetes de madera teñida, encimera de travertino, alacenas con puertas de cristal y detalles en azulejo.",
      price: "$25,600",
      image: "/fotos/rustic-kitchen.jpg",
      gallery: [
        "/fotos/rustic-kitchen.jpg",
        "/fotos/rustic-kitchen-2.jpg",
        "/fotos/rustic-kitchen-3.jpeg",
      ],
    },
  ];
}

// Exportar la función principal
export const artworks = getStaticArtworks();

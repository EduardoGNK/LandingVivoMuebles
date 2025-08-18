"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Recycle, Frame, House, Sun } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedArtwork from "@/components/featured-artwork"
import { GalleryPreview } from "@/components/gallery-preview"
import { NewsletterForm } from "@/components/newsletter-form"
import { ExhibitionSlider } from "@/components/exhibition-slider"
import { AIKitchenGenerator } from "@/components/ai-kitchen-generator"
import { AIImageProvider } from "@/components/ai-image-context"
import { Preloader } from "@/components/preloader"
import { useRef } from "react"

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

const stats = [
  {
    name: "Garantía",
    value: "6 meses",
    description: "Disfruta de tu tranquilidad, si algo falla, lo reparamos.",
    icon: Calendar,
  },
  {
    name: "CO₂ evitado al año",
    value: "~175 kg",
    description: "Promedio de reducción en el impacto ambiental estimado por familia en un año.",
    icon: Recycle,
  },
  {
    name: "Clientes satisfechos",
    value: "+200",
    description: "Cocinas únicas adaptadas a cada hogar u oficina.",
    icon: House,
  },
]

export default function Home() {
  const contactFormRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Simular tiempo de carga mínima para mostrar el preloader
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Cargar proyectos
    fetchProjects()

    return () => clearTimeout(timer)
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
    }
  }

  // Transformar proyectos a formato compatible con GalleryPreview
  const transformedProjects = projects.map(project => ({
    id: project.id,
    title: project.title,
    artist: project.comuna, // Usar comuna como artista
    year: `${project.startDate} - ${project.endDate}`, // Usar fechas como año
    medium: project.workType, // Usar tipo de trabajo como medio
    dimensions: project.propertyType, // Usar tipo de vivienda como dimensiones
    description: project.description,
    price: project.location, // Usar ubicación como precio
    image: project.gallery[0] || "/placeholder.jpg",
    gallery: project.gallery,
  }))

  if (isLoading) {
    return <Preloader onComplete={() => setIsLoading(false)} />
  }

  return (
    <AIImageProvider>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[63vh] sm:min-h-[90vh] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="relative h-full w-full">
                <Image
                  src="/cocina_home.jpeg"
                  alt="Cocina home"
                  fill
                  priority
                  className="object-cover opacity-50 dark:opacity-20" /* Cambia foto fondo*/
                /> 
                <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% via-background/60 to-background" /* Cambia fade de foto fondo *//> 
              </div>
            </div>
            <div className="container relative z-10 flex min-h-[63vh] sm:min-h-[90vh] flex-col items-center justify-center px-4 py-6 sm:py-8 md:py-12 lg:py-32 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl space-y-4 sm:space-y-6 md:space-y-7"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-2"
                >
                  <h2 className="text-xs font-medium text-muted-foreground sm:text-sm md:text-base lg:text-lg">Remodelaciones y cocina sustentable</h2>
                  <h1 className="text-2xl font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                    Transforma tu hogar con
                    <span className="relative ml-1 sm:ml-2 inline-block bg-gradient-to-r from-blue-600 from-10% to-green-600 to-100% bg-clip-text text-transparent">
                      Vivo Muebles
                    </span>
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mx-auto max-w-2xl text-xs text-muted-foreground sm:text-sm md:text-base lg:text-lg xl:text-xl"
                >
                  Conoce nuesto trabajo y anímate a transformar tu hogar con nuestro equipo de expertos en remodelación en interiores y sustentabilidad.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:flex-row md:gap-4 lg:gap-5"
                >
                  <Button asChild size="lg" className="text-xs bg-blue-600 hover:bg-blue-700 text-white sm:text-sm md:text-base lg:text-lg w-[48.75%] sm:w-auto">
                    <Link href="/gallery">
                      Nuestros Proyectos
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-xs sm:text-sm md:text-base lg:text-lg w-[48.75%] sm:w-auto">
                    <Link href="/exhibitions">Cotiza con nosotros</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="container px-4"
              >
                <div className="hidden sm:grid gap-4 rounded-t-3xl bg-muted/50 p-4 backdrop-blur-sm dark:bg-muted/10 sm:gap-6 sm:p-6 md:grid-cols-3 md:gap-8 md:p-8">
                  {stats.map((stat, index) => (
                    <div key={stat.name} className="relative flex flex-col items-center gap-1 text-center sm:gap-2">
                      {index > 0 && <div className="absolute -left-2 top-0 hidden h-full w-px bg-border sm:block sm:-left-3 md:-left-4" />}
                      <stat.icon className="h-4 w-4 text-muted-foreground sm:h-5 sm:w-5 md:h-6 md:w-6" />
                      <div className="text-xl font-bold sm:text-2xl md:text-3xl">{stat.value}</div>
                      <div className="font-medium text-xs sm:text-sm md:text-base">{stat.name}</div>
                      <p className="text-xs text-muted-foreground sm:text-sm">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Featured Artwork Section */}
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container px-4">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">Algunos de nuestros proyectos</h2>
                  <p className="max-w-[800px] text-sm sm:text-base md:text-lg text-muted-foreground">
                    Conoce algunos de nuestros mejores proyectos donde no solo te ofrecemos una cocina, sino una experiencia única y personalizada.
                  </p>
                </div>
                <FeaturedArtwork />
              </div>
            </div>
          </section>

          {/* AI Kitchen Generator Section */}
          <section className="relative overflow-hidden bg-muted/50 py-16 sm:py-20 md:py-24 dark:bg-muted/10">
            <div className="container px-4">
              <AIKitchenGenerator contactFormRef={contactFormRef} />
            </div>
          </section>

          {/* AEservicios Section */}
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container px-4">
              <div className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 lg:items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                      <span className="text-green-600">Vivo Muebles</span> como parte de{" "}
                      <span className="text-blue-600">AEservicios</span>
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
                      <strong className="text-foreground">AEservicios</strong> es una empresa dedicada a la remodelación integral de espacios, tanto para hogares como para empresas, combinando diseño funcional con soluciones modernas, duraderas y eficientes.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
                      Dentro de AEservicios nace <strong className="text-foreground">Vivo Muebles</strong>, una propuesta que ha transformado los hogares de cientos de chilenos, no solo con diseño a medida, sino que también con un compromiso ambiental: nuestros muebles integran botes para separar la basura desde su origen, facilitando la recolección y fomentando un estilo de vida más sustentable.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
                      Rediseña tus espacios, eleva la estética de tu hogar y sé parte del cambio hacia un futuro más limpio y consciente.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <Image
                      src="/fotos/modern-kitchen.jpg"
                      alt="Cocina moderna sustentable"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Upcoming Exhibitions Section */}
          <section className="relative overflow-hidden bg-muted/50 py-16 sm:py-20 md:py-24 dark:bg-muted/10">
            <div className="container px-4">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">Más que solo Cocinas</h2>
                  <p className="max-w-[800px] text-sm sm:text-base md:text-lg text-muted-foreground">
                    Nuestras remodelaciones no solo son cocinas, sino que también son espacios únicos y personalizados para cada cliente con proyectos de todo tipo.
                  </p>
                </div>
                <ExhibitionSlider />
              </div>
            </div>
          </section>

          {/* Gallery Preview Section */}
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container px-4">
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
                  <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">Revisa nuestros proyectos</h2>
                  <p className="max-w-[800px] text-sm sm:text-base md:text-lg text-muted-foreground">
                    Si aún no te convences de renovar tu hogar, te invitamos a revisar nuestros últimos proyectos y ver cómo podemos ayudarte a transformar tu hogar.
                  </p>
                </div>
                <GalleryPreview projects={transformedProjects} />
                <div className="flex justify-center">
                  <Button asChild size="lg" variant="outline" className="text-sm sm:text-base">
                    <Link href="/gallery">Ver más proyectos</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Logos Row Section */}
          <section className="py-8 sm:py-10 md:py-12 bg-muted/50 dark:bg-muted/10">
            <div className="container px-4">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-20 lg:gap-28">
                {[
                  { src: "/logos/creattiva.png", alt: "Creattiva", href: "https://www.creattiva.cl/" },
                  { src: "/logos/infinity-padel.png", alt: "Infinity Padel", href: "https://talca.infinitypadel.cl/" },
                  { src: "/logos/xinergy.png", alt: "Xinergy", href: "https://xinergy.cl/" },
                  { src: "/logos/matrix.png", alt: "Matrix Consulting", href: "https://www.matrixconsulting.com/" },
                ].map((logo, i) => (
                  <a
                    key={i}
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-16 w-20 p-2 sm:h-18 sm:w-24 md:h-20 md:w-36 md:p-0 lg:h-28 lg:w-48 transition-transform duration-300 hover:scale-110"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="object-contain h-full w-full filter grayscale brightness-0 dark:invert transition-all duration-300"
                    />
                  </a>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 text-center">
                <h3 className="text-sm sm:text-base font-semibold text-muted-foreground tracking-wide">AEservicios remodelando más allá de tu casa.</h3>
              </div>
            </div>
          </section>

          
          {/* Newsletter Section */}
          <section className="py-16 sm:py-20 md:py-24">
            <div className="container px-4">
              <Card className="bg-muted/50 dark:bg-muted/10 relative overflow-hidden">
                {/* Imagen decorativa esquina superior izquierda */}
                <div className="absolute top-[-48px] left-[-48px] w-[416px] h-[416px] opacity-20 pointer-events-none z-0">
                  <img
                    src="icono-solo-izquierda.png"
                    alt=""
                    className="w-full h-full object-contain"
                    style={{filter: 'brightness(0.89)'}}
                  />
                </div>

                {/* Imagen decorativa esquina inferior derecha */}
                <div className="absolute bottom-[-48px] right-[-48px] w-[440px] h-[440px] opacity-20 pointer-events-none z-0">
                  <img
                    src="icono-solo-form-derecha.png"
                    alt=""
                    className="w-full h-full object-contain"
                    style={{filter: 'brightness(0.86)'}}
                  />
                </div>

                {/* Contenido principal del formulario */}
                <CardContent className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 md:p-12 text-center relative z-10">
                  <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Cotiza con Nuestro Equipo</h2>
                  <p className="max-w-[600px] text-sm sm:text-base text-muted-foreground">
                    Completa el siguiente formulario de cotización y nuestro equipo te responderá a la brevedad. No te olvides de describir tu idea y/o duda sobre tu proyecto.
                  </p>
                  <div className="w-full max-w-md" ref={contactFormRef}>
                    <NewsletterForm />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </AIImageProvider>
  )
}

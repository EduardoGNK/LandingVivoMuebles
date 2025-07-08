"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Recycle, Frame, House, Sun } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedArtwork from "@/components/featured-artwork"
import { GalleryPreview } from "@/components/gallery-preview"
import { NewsletterForm } from "@/components/newsletter-form"
import { ExhibitionSlider } from "@/components/exhibition-slider"
import { AIKitchenGenerator } from "@/components/ai-kitchen-generator"

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
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] overflow-hidden">
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
          <div className="container relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 py-8 text-center sm:py-12 md:py-32">
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
                <h2 className="text-sm font-medium text-muted-foreground sm:text-base md:text-lg">Remodelaciones y cocina sustentable</h2>
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                  Transforma tu cocina con
                  <span className="relative ml-2 inline-block bg-gradient-to-r from-blue-600 from-10% to-green-600 to-100% bg-clip-text text-transparent">
                    Vivo Muebles
                  </span>
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg lg:text-xl"
              >
                Conoce nuesto trabajo y anímate a transformar tu cocina con nuestro equipo de expertos en remodelación en interiores y sustentabilidad.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 md:gap-5"
              >
                <Button asChild size="lg" className="text-sm bg-blue-600 hover:bg-blue-700 text-white sm:text-base md:text-lg">
                  <Link href="/gallery">
                    Nuestros Proyectos
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-sm sm:text-base md:text-lg">
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
        <section className="py-24">
          <div className="container px-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Algunos de nuestros proyectos</h2>
                <p className="max-w-[800px] text-lg text-muted-foreground">
                  Conoce algunos de nuestros mejores proyectos donde no solo te ofrecemos una cocina, sino una experiencia única y personalizada.
                </p>
              </div>
              <FeaturedArtwork />
            </div>
          </div>
        </section>

        {/* AI Kitchen Generator Section */}
        <section className="relative overflow-hidden bg-muted/50 py-24 dark:bg-muted/10">
          <div className="container px-4">
            <AIKitchenGenerator />
          </div>
        </section>

        {/* Upcoming Exhibitions Section */}
        <section className="relative overflow-hidden bg-muted/50 py-24 dark:bg-muted/10">
          <div className="container px-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Upcoming Exhibitions</h2>
                <p className="max-w-[800px] text-lg text-muted-foreground">
                  Mark your calendar for these extraordinary showcases of artistic excellence.
                </p>
              </div>
              <ExhibitionSlider />
            </div>
          </div>
        </section>

        {/* Gallery Preview Section */}
        <section className="py-24">
          <div className="container px-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Gallery Preview</h2>
                <p className="max-w-[800px] text-lg text-muted-foreground">
                  Explore a selection of our diverse collection, featuring works that challenge and inspire.
                </p>
              </div>
              <GalleryPreview />
              <div className="flex justify-center">
                <Button asChild size="lg" variant="outline">
                  <Link href="/gallery">View Full Gallery</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Row Section */}
        <section className="py-12 bg-muted/50 dark:bg-muted/10">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-20 lg:gap-28">
              {[
                { src: "/logos/Banco_de_Chile.png", alt: "Banco de Chile" },
                { src: "/logos/banco-estado.png", alt: "Banco Estado" },
                { src: "/logos/Sodimac.png", alt: "Sodimac" },
                { src: "/logos/matrix.png", alt: "Matrix Consulting" },
              ].map((logo, i) => (
                <div key={i} className="flex items-center justify-center h-8 w-21 md:h-20 md:w-36 lg:h-28 lg:w-48">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="object-contain h-full w-full"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-base font-semibold text-muted-foreground tracking-wide">Casos de éxito como AEservicios</h3>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24">
          <div className="container px-4">
            <Card className="bg-muted/50 dark:bg-muted/10">
              <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
                <h2 className="text-2xl font-bold sm:text-3xl">Stay Connected with Artistry</h2>
                <p className="max-w-[600px] text-muted-foreground">
                  Subscribe to our newsletter for exclusive previews, exhibition announcements, and artistic insights.
                </p>
                <div className="w-full max-w-md">
                  <NewsletterForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

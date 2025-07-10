"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const exhibitions = [
  {
    id: 1,
    title: "Canchas de Padel",
    artist: "Antofagasta",
    date: "mayo 15 - Julio 28, 2025",
    description: "Remodelación de interior dentro del mall Antofagasta para la empresa Infinity Padel. ",
    image: "masque/cancha-padel.jpg",
  },
  {
    id: 2,
    title: "Diseño de oficinas abiertas",
    artist: "Providencia - Santiago",
    date: "Septiembre 25 - Octubre 20, 2024",
    description: "Remodelación de oficina abierta ajustando a la medida mesas y muebles ubicada en oficinas de Costanera Center.",
    image: "masque/oficina-abierta.jpg",
  },
  {
    id: 3,
    title: "Diseño de exteriores",
    artist: "La Reina - Santiago",
    date: "Abril 1 - Mayo 20, 2024",
    description: "Terraza con trabajos en madera y piedra, integración de estufa y diseño de iluminación para un particular de La Reina.",
    image: "masque/terraza.jpg",
  },
]

export function ExhibitionSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === exhibitions.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? exhibitions.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative overflow-hidden">
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card className="overflow-hidden">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                  <Image
                    src={exhibitions[currentIndex].image || "/placeholder.svg"}
                    alt={exhibitions[currentIndex].title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <CardContent className="flex flex-col justify-center gap-4 p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{exhibitions[currentIndex].date}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{exhibitions[currentIndex].title}</h3>
                  <p className="text-lg text-muted-foreground">{exhibitions[currentIndex].artist}</p>
                  <p className="text-muted-foreground">{exhibitions[currentIndex].description}</p>
                  <div className="mt-4">
                    <Button asChild>
                      <Link href="/exhibitions">Ver Proyectos</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        <Button variant="outline" size="icon" onClick={prevSlide} className="h-8 w-8 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Button>
        {exhibitions.map((_, index) => (
          <Button
            key={index}
            variant={currentIndex === index ? "default" : "outline"}
            size="icon"
            onClick={() => setCurrentIndex(index)}
            className="h-8 w-8 rounded-full"
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </Button>
        ))}
        <Button variant="outline" size="icon" onClick={nextSlide} className="h-8 w-8 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

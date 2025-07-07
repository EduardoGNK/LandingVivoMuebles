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
    title: "Abstract Visions",
    artist: "Various Artists",
    date: "March 15 - April 30, 2024",
    description: "A collective exhibition exploring the boundaries of abstract expression in contemporary art.",
    image: "https://images.unsplash.com/photo-1541512416146-3cf58d6b27cc?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Urban Perspectives",
    artist: "Sarah Chen & Marcus Davis",
    date: "May 5 - June 20, 2024",
    description: "A dual exhibition examining the intersection of urban life and artistic interpretation.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Digital Frontiers",
    artist: "Tech Art Collective",
    date: "July 1 - August 15, 2024",
    description: "Exploring the convergence of technology and traditional artistic mediums.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
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
                      <Link href="/exhibitions">Learn More</Link>
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

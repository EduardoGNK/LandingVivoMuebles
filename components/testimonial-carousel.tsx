"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    content:
      "Artistry Gallery has transformed my perspective on contemporary art. Their curation is exceptional, and the team's expertise made collecting art an enlightening experience.",
    author: "Emily Chen",
    role: "Art Collector",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: 2,
    content:
      "The gallery's commitment to showcasing diverse artists and styles is remarkable. Each visit reveals new perspectives and inspiring works.",
    author: "Michael Rodriguez",
    role: "Gallery Member",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
  },
  {
    id: 3,
    content:
      "As an artist, exhibiting at Artistry Gallery was a milestone in my career. Their support for emerging artists and dedication to excellence is unmatched.",
    author: "Sarah Thompson",
    role: "Featured Artist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
  },
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <div 
      className="relative overflow-hidden py-12"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl"
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
                <Quote className="h-12 w-12 text-muted-foreground" />
                <p className="text-xl">{testimonials[currentIndex].content}</p>
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                      alt={testimonials[currentIndex].author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold">{testimonials[currentIndex].author}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </div>
              </CardContent>
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
        {testimonials.map((_, index) => (
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

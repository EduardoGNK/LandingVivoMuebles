"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Pequeño delay para mostrar el contenido después de que la página esté lista
    const showTimer = setTimeout(() => {
      setShowContent(true)
    }, 100)

    // Simular progreso de carga
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    // Animación de puntos
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => {
      clearTimeout(showTimer)
      clearInterval(progressInterval)
      clearInterval(dotsInterval)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background pb-16"
      >
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Logo con efecto de respiración */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
                          <Image
              src="/logo-slogan.png"
              alt="Vivo Muebles"
              width={320}
              height={128}
              className="object-contain"
              priority
            />
            </motion.div>

            {/* Texto de carga con puntos */}
            <div className="flex items-center">
              <span className="text-lg font-medium text-muted-foreground">
                Cargando
              </span>
              <span className="text-lg font-medium text-muted-foreground w-4 ml-1">
                {dots}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-56 h-2.5 bg-muted rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 from-10% to-green-600 to-100%"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
} 
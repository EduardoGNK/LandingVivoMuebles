"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function AIKitchenGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Por favor, describe tu cocina perfecta")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-kitchen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al generar la imagen')
      }

      setGeneratedImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la imagen')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInterest = () => {
    // Aquí puedes agregar la lógica para manejar el interés del usuario
    alert("¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Crea tu cocina perfecta con IA
        </h2>
        <p className="max-w-[800px] text-lg text-muted-foreground">
          Descríbenos tu cocina perfecta y te generamos una imagen considerando tus gustos, recuerda que mientras más detallada la describes mejor resultados obtienes, ¡se recomienda considerar estilo, espacio, color y materiales!
        </p>
      </div>

      <Card className="bg-muted/50 dark:bg-muted/10">
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="text"
                placeholder="Ej: Una cocina moderna con gabinetes blancos, encimera de mármol, isla central y ventanas grandes..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 text-base sm:text-lg"
                disabled={isGenerating}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate()
                  }
                }}
              />
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando...
                  </>
                ) : (
                  "Generar"
                )}
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center"
              >
                {error}
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="text-center text-muted-foreground">
                  Tu cocina perfecta se está generando...
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                    <div className="absolute inset-0 h-8 w-8 rounded-full border-4 border-transparent border-t-blue-400 animate-ping"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative aspect-square w-full max-w-sm sm:max-w-md overflow-hidden rounded-lg bg-muted">
                  <img
                    src={generatedImage}
                    alt="Cocina generada con IA"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-center space-y-4">
                  <p className="text-base sm:text-lg text-muted-foreground max-w-lg sm:max-w-2xl">
                    ¡Esta es tu cocina soñada! Si te gusta lo que ves, podemos hacerla realidad. Nuestro equipo de expertos está listo para transformar tu espacio.
                  </p>
                  <Button 
                    onClick={handleInterest}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    ¡Me interesa!
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
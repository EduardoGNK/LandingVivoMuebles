"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAIImage } from "@/components/ai-image-context"

interface AIKitchenGeneratorProps {
  contactFormRef?: React.RefObject<HTMLDivElement | null>
}

interface KitchenPreferences {
  style: string
  color: string
  countertop: string
  island: string
}

const kitchenOptions = {
  style: [
    { value: "moderna", label: "Moderna", description: "Líneas limpias y minimalistas" },
    { value: "minimalista", label: "Minimalista", description: "Simplicidad y funcionalidad" },
    { value: "escandinava", label: "Escandinava", description: "Luz natural y diseño nórdico" },
    { value: "rustica", label: "Rústica", description: "Calidez y materiales naturales" },
    { value: "industrial", label: "Industrial", description: "Metal y elementos urbanos" },
    { value: "clásica", label: "Clásica", description: "Diseños tradicionales y elegantes" },
    { value: "japandi", label: "Japandi", description: "Combinación de estilo japonés y escandinavo" },
    { value: "transicional", label: "Transicional", description: "Fusión de clásico y moderno" },
    { value: "mediterránea", label: "Mediterránea", description: "Colores vivos y elementos naturales" },
    { value: "bohemia", label: "Bohemia", description: "Colores cálidos y mezcla de estilos" }
  ],
  color: [
    { value: "blanco", label: "Blanco", description: "Limpio y luminoso" },
    { value: "gris", label: "Gris", description: "Neutral y moderno" },
    { value: "madera clara", label: "Madera Clara", description: "Natural y cálido" },
    { value: "negro", label: "Negro", description: "Elegante y sofisticado" },
    { value: "crema", label: "Crema", description: "Suave y acogedor" },
    { value: "madera oscura", label: "Madera Oscura", description: "Elegancia natural" },
    { value: "verde salvia", label: "Verde Salvia", description: "Fresco y relajante" },
    { value: "azul petróleo", label: "Azul Petróleo", description: "Profundo y moderno" },
    { value: "ocre", label: "Ocre", description: "Cálido y terroso" },
    { value: "rojo vino", label: "Rojo Vino", description: "Atrevido y cálido" }
  ],
  countertop: [
    { value: "cuarzo", label: "Cuarzo", description: "Moderno y práctico" },
    { value: "granito", label: "Granito", description: "Durabilidad y resistencia" },
    { value: "marmol", label: "Mármol", description: "Lujo y elegancia" },
    { value: "madera", label: "Madera", description: "Natural y acogedor" },
    { value: "cemento pulido", label: "Cemento Pulido", description: "Industrial y único" },
    { value: "acero inoxidable", label: "Acero Inoxidable", description: "Profesional y resistente" },
    { value: "piedra natural", label: "Piedra Natural", description: "Rústico y auténtico" },
    { value: "resina", label: "Resina", description: "Versátil y moderna" }
  ],
  island: [
    { value: "con isla central", label: "Con Isla Central", description: "Espacio adicional y funcional" },
    { value: "isla con comedor", label: "Isla con Comedor", description: "Con barra para comer integrada" },
    { value: "isla con cocina", label: "Isla con Cocina", description: "Con encimera y fogón" },
    { value: "sin isla", label: "Sin Isla", description: "Más espacio para circulación" }
  ]
}

const phases = [
  { key: "style", title: "¿Qué estilo de cocina prefieres?", description: "Elige el estilo que mejor se adapte a tu hogar" },
  { key: "color", title: "¿Qué color te gusta para los muebles?", description: "Selecciona el color principal de los gabinetes" },
  { key: "countertop", title: "¿Qué tipo de encimera prefieres?", description: "Elige el material para tu superficie de trabajo" },
  { key: "island", title: "¿Te gustaría una isla de cocina?", description: "Decide si quieres una isla central" }
]

export function AIKitchenGenerator({ contactFormRef }: AIKitchenGeneratorProps) {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [preferences, setPreferences] = useState<KitchenPreferences>({
    style: "",
    color: "",
    countertop: "",
    island: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAllOptions, setShowAllOptions] = useState<Record<string, boolean>>({
    style: false,
    color: false,
    countertop: false,
    island: false
  })
  const { setIaImage } = useAIImage()

  const currentPhaseData = phases[currentPhase]
  const currentOptions = kitchenOptions[currentPhaseData.key as keyof typeof kitchenOptions]
  const isLastPhase = currentPhase === phases.length - 1
  const canProceed = preferences[currentPhaseData.key as keyof KitchenPreferences] !== ""
  const currentPhaseKey = currentPhaseData.key
  const showAllForCurrentPhase = showAllOptions[currentPhaseKey]
  const displayedOptions = showAllForCurrentPhase ? currentOptions : currentOptions.slice(0, 6)
  const hasMoreOptions = currentOptions.length > 6

  const generatePrompt = () => {
    return `Crea una cocina ${preferences.style} con muebles de color ${preferences.color}, encimera de ${preferences.countertop} y ${preferences.island}.`
  }

  const handleOptionSelect = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      [currentPhaseData.key]: value
    }))
  }

  const handleNext = () => {
    if (isLastPhase) {
      handleGenerate()
    } else {
      setCurrentPhase(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentPhase > 0) {
      setCurrentPhase(prev => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentPhase(0)
    setPreferences({
      style: "",
      color: "",
      countertop: "",
      island: ""
    })
    setGeneratedImage(null)
    setError(null)
    setShowPreview(false)
    setShowAllOptions({
      style: false,
      color: false,
      countertop: false,
      island: false
    })
  }

  const handleShowMore = () => {
    setShowAllOptions(prev => ({
      ...prev,
      [currentPhaseKey]: true
    }))
  }

  const handleShowLess = () => {
    setShowAllOptions(prev => ({
      ...prev,
      [currentPhaseKey]: false
    }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const prompt = generatePrompt()
      const response = await fetch('/api/generate-kitchen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
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
    if (generatedImage) {
      setIaImage(generatedImage)
      if (contactFormRef?.current) {
        const y = contactFormRef.current.getBoundingClientRect().top + window.scrollY - 220;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }

  const progressPercentage = ((currentPhase + 1) / phases.length) * 100

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Crea tu cocina perfecta con
          <span className="relative ml-2 inline-block bg-gradient-to-r from-blue-600 from-10% to-green-600 to-100% bg-clip-text text-transparent">
            IA
          </span>
        </h2>
        <p className="max-w-[800px] text-lg text-muted-foreground">
          Sigue estos pasos para crear tu cocina ideal. Te guiaremos a través de cada decisión para obtener el resultado perfecto.
        </p>
      </div>

      <Card className="bg-muted/50 dark:bg-muted/10">
        <CardContent className="p-4 sm:p-8">
          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Paso {currentPhase + 1} de {phases.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!generatedImage && !isGenerating && (
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Título y descripción de la fase */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold sm:text-2xl">
                    {currentPhaseData.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {currentPhaseData.description}
                  </p>
                </div>

                {/* Opciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayedOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        preferences[currentPhaseData.key as keyof KitchenPreferences] === option.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100'
                          : 'border-border hover:border-blue-300 hover:bg-muted/50'
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Botón mostrar más/menos */}
                {hasMoreOptions && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={showAllForCurrentPhase ? handleShowLess : handleShowMore}
                      className="text-sm rounded-full"
                    >
                      {showAllForCurrentPhase ? "Mostrar menos" : "Mostrar más"}
                    </Button>
                  </div>
                )}

                {/* Botones de navegación */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    {currentPhase > 0 && (
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reiniciar
                    </Button>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    {isLastPhase ? (
                      <>
                        <Loader2 className="h-4 w-4" />
                        Generar
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>


              </motion.div>
            )}

            {/* Estado de generación */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="text-center text-muted-foreground">
                  Tu cocina perfecta se está generando... esto puede tardar unos minutos.
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

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Imagen generada */}
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
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={handleInterest}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      ¡Me interesa!
                    </Button>
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                    >
                      Generar otra cocina
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
} 
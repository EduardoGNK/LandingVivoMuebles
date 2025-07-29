"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { simulatePatPassFlow, PatPassPlan } from "@/lib/patpass"

interface PricingCardProps {
  name: string
  price: number
  period: string
  features: string[]
  featured?: boolean
  compact?: boolean
}

export function PricingCard({ name, price, period, features, featured, compact = false }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Función para formatear el precio en pesos chilenos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Manejar suscripción a PatPass (simulación completa)
  const handleSubscription = async () => {
    setIsLoading(true)
    
    try {
      // Crear objeto plan para PatPass
      const plan: PatPassPlan = {
        name,
        price,
        period,
        features,
        featured,
      }

      console.log('🎯 Iniciando suscripción PatPass para plan:', plan)

      // Simular el flujo completo de PatPass
      await simulatePatPassFlow(plan)

    } catch (error) {
      console.error('❌ Error iniciando suscripción PatPass:', error)
      
      // Mostrar error al usuario
      alert(`Error iniciando la suscripción: ${error instanceof Error ? error.message : 'Error desconocido'}`)
      
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`relative ${compact ? 'p-4 sm:p-6' : 'p-8'} rounded-2xl border transition-all duration-300 ${
        featured
          ? "bg-gradient-to-br from-card via-card/80 to-card border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/20"
          : "bg-gradient-to-br from-card to-card/90 border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      }`}
    >
      {featured && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            <Sparkles className="h-4 w-4" />
            Más Popular
          </div>
        </motion.div>
      )}
      
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center">
          <h3 className={`${compact ? 'text-lg sm:text-xl' : 'text-2xl'} font-bold mb-2 ${
            featured ? "bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" : "text-foreground"
          }`}>
            {name}
          </h3>
          <div className="flex items-baseline justify-center">
            <span className={`${compact ? 'text-3xl sm:text-4xl' : 'text-5xl'} font-bold tracking-tight ${
              featured ? "bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent" : "text-foreground"
            }`}>
              {formatPrice(price)}
            </span>
            <span className="ml-2 text-base sm:text-lg font-medium text-muted-foreground">/{period}</span>
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          <Button 
            disabled={isLoading}
            className={`w-full h-11 sm:h-12 text-base sm:text-lg font-semibold transition-all duration-300 ${
              featured
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border border-primary/20 hover:border-primary/30 disabled:opacity-50"
            }`}
            onClick={handleSubscription}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando PatPass...
              </>
            ) : (
              `Suscribirse a ${name}`
            )}
          </Button>
        </motion.div>
        
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Incluye:
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2 sm:gap-3"
              >
                <div className={`flex-shrink-0 mt-0.5 p-1 rounded-full ${
                  featured ? "bg-blue-500/20" : "bg-muted"
                }`}>
                  <Check className={`h-3 w-3 ${
                    featured ? "text-blue-500" : "text-muted-foreground"
                  }`} />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

"use client"

import { PricingCard } from "@/components/pricing-card"
import { processPatPassResponse } from "@/lib/patpass"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const plans = [
  {
    name: "Básico",
    price: 7990,
    period: "mes",
    features: [
      "2 recolectadas de basura por semana",
      "Sin personalización de horarios",
      "Soporte vía email y WhatsApp",
      "Cancelar en cualquier momento",
      "Rutas estándar de recolección",
    ],
  },
  {
    name: "Premium",
    price: 10000,
    period: "mes",
    featured: true,
    features: [
      "3 recolectadas de basura por semana",
      "Personalización de días y horarios",
      "Prioridad en rutas de recolección",
      "Soporte prioritario vía email y WhatsApp",
      "Flexibilidad total en programación",
      "Todo lo del plan Básico",
    ],
  },
  {
    name: "Básico Anual",
    price: 80000,
    period: "año",
    features: [
      "2 recolectadas de basura por semana",
      "Sin personalización de horarios",
      "Soporte vía email y WhatsApp",
      "Ahorro de 2 meses al pagar anual",
      "Rutas estándar de recolección",
      "Cancelar en cualquier momento",
    ],
  },
]

const faqs = [
  {
    question: "¿Cómo funciona el sistema de cobro automático con PatPass?",
    answer: "PatPass by Webpay es un servicio de Transbank que crea un mandato digital autorizado por ti. Una vez activado, los cobros se realizan automáticamente según tu plan seleccionado (mensual, trimestral o anual). Puedes cancelar el mandato en cualquier momento desde tu cuenta bancaria sin costo adicional."
  },
  {
    question: "¿Qué pasa si no tengo fondos en mi tarjeta cuando se realiza el cobro?",
    answer: "Si tu tarjeta no tiene fondos suficientes, el cobro automático fallará. Te notificaremos por email y WhatsApp para que regularices tu situación. Después de 3 intentos fallidos, tu suscripción se pausará automáticamente hasta que actualices tu método de pago. No se generarán cargos por intentos fallidos."
  },
  {
    question: "¿Puedo cambiar de plan o cancelar mi suscripción en cualquier momento?",
    answer: "Sí, puedes cambiar de plan o cancelar tu suscripción en cualquier momento sin penalización. Los cambios de plan se aplicarán desde el próximo ciclo de facturación. Para cancelar, simplemente contacta nuestro equipo de soporte vía email o WhatsApp, y también puedes cancelar el mandato digital directamente desde tu cuenta bancaria."
  }
]

export default function PricingPage() {
  const searchParams = useSearchParams()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

  // Manejar parámetros de callback de PatPass
  useEffect(() => {
    const status = searchParams.get('status')
    const token = searchParams.get('token')
    const tbk_token = searchParams.get('tbk_token')
    const message = searchParams.get('message')

    if (status && token && tbk_token) {
      console.log('Procesando respuesta PatPass:', { status, token, tbk_token, message })

      // Procesar respuesta de PatPass
      const result = processPatPassResponse(token, tbk_token)
      
      setAlertType(result.success ? "success" : "error")
      setAlertMessage(result.message)
      setShowAlert(true)

      // Limpiar parámetros de la URL
      const url = new URL(window.location.href)
      url.searchParams.delete('status')
      url.searchParams.delete('token')
      url.searchParams.delete('tbk_token')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.toString())

      // Ocultar alerta después de 5 segundos
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background text-foreground py-10 px-2 sm:py-16 sm:px-4">
      {/* Alerta de resultado de PatPass */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full">
          <div className={`p-4 rounded-lg shadow-lg border ${
            alertType === "success" 
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  alertType === "success" ? "bg-green-500" : "bg-red-500"
                }`} />
                <p className="text-sm font-medium">{alertMessage}</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
            Plan de suscripción para recolección de basura sustentable
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Nuestros planes están diseñados para ofrecerte un servicio de recolección de basura sustentable que se adapte a tus necesidades y contribuya al cuidado del medio ambiente.
          </p>
          {/* Información sobre PatPass */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 max-w-2xl mx-auto text-sm sm:text-base">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>💳 Pago Seguro:</strong> Utilizamos PatPass by Webpay de Transbank para procesar tus pagos de forma segura. 
              Al suscribirte, se creará un mandato digital que permitirá cobros automáticos según tu plan seleccionado.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {plans.map((plan) => (
            <div key={plan.name} className="w-full max-w-md mx-auto">
              <PricingCard {...plan} compact />
            </div>
          ))}
        </div>

        {/* Sección de Preguntas Frecuentes */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 sm:mt-4 max-w-2xl mx-auto">
              Resolvemos las dudas más comunes sobre nuestros servicios y el sistema de pagos
            </p>
          </div>

          <div className="max-w-2xl sm:max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-3 sm:px-6 bg-card/50 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                    <span className="text-base sm:text-lg font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 sm:pb-6">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground/70 text-sm text-center">
            ¿Necesitas un plan personalizado? <span className="text-muted-foreground hover:text-foreground cursor-pointer underline">Contáctanos</span>
          </p>
          {/* Información adicional sobre PatPass */}
          <div className="text-xs text-muted-foreground/60 max-w-2xl mx-auto">
            <p>
              PatPass by Webpay es un servicio de Transbank que permite crear mandatos digitales para cobros automáticos. 
              Puedes cancelar tu suscripción en cualquier momento desde tu cuenta bancaria.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

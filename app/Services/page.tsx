'use client'

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

  useEffect(() => {
    const status = searchParams.get('status')
    const token = searchParams.get('token')
    const tbk_token = searchParams.get('tbk_token')
    const message = searchParams.get('message')

    if (status && token && tbk_token) {
      const result = processPatPassResponse(token, tbk_token)
      setAlertType(result.success ? "success" : "error")
      setAlertMessage(result.message)
      setShowAlert(true)

      const url = new URL(window.location.href)
      url.searchParams.delete('status')
      url.searchParams.delete('token')
      url.searchParams.delete('tbk_token')
      url.searchParams.delete('message')
      window.history.replaceState({}, '', url.toString())

      setTimeout(() => setShowAlert(false), 5000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen ...">
      {/* tu JSX con alert, PricingCards y Accordion */}
    </div>
  )
}

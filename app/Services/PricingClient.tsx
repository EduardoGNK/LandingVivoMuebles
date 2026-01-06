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

const plans = [ /* … igual que antes … */ ]
const faqs = [ /* … igual que antes … */ ]

export default function PricingClient() {
  const searchParams = useSearchParams()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] =
    useState<"success" | "error">("success")

  useEffect(() => {
    const status = searchParams.get("status")
    const token = searchParams.get("token")
    const tbk_token = searchParams.get("tbk_token")
    const message = searchParams.get("message")

    if (status && token && tbk_token) {
      const result = processPatPassResponse(token, tbk_token)

      setAlertType(result.success ? "success" : "error")
      setAlertMessage(result.message)
      setShowAlert(true)

      const url = new URL(window.location.href)
      url.searchParams.delete("status")
      url.searchParams.delete("token")
      url.searchParams.delete("tbk_token")
      url.searchParams.delete("message")
      window.history.replaceState({}, "", url.toString())

      setTimeout(() => setShowAlert(false), 5000)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen ...">
      {/* tu JSX tal cual lo tenías */}
    </div>
  )
}

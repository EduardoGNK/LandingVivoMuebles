import { Suspense } from "react"
import PricingClient from "./PricingClient"

export default function ServicesPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PricingClient />
    </Suspense>
  )
}

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAIImage } from "@/components/ai-image-context"
import { SuccessPopup } from "@/components/success-popup"

interface ContactFormProps {
  imagenIA?: string | null // Imagen generada por IA (opcional)
}

export function NewsletterForm() {
  const { iaImage } = useAIImage()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "ratelimit">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, telefono, direccion, mensaje, imagenIA: iaImage }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus("success")
        setNombre("")
        setEmail("")
        setTelefono("")
        setDireccion("")
        setMensaje("")
        setShowSuccessPopup(true)
        setTimeout(() => setStatus("idle"), 4000)
      } else if (res.status === 429 || data.error?.includes("espera")) {
        setStatus("ratelimit")
        setErrorMsg(data.error || "⚠️ Por favor espera antes de volver a enviar")
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        setStatus("error")
        setErrorMsg(data.error || "❌ Hubo un error, intenta más tarde")
        setTimeout(() => setStatus("idle"), 4000)
      }
    } catch (err) {
      setStatus("error")
      setErrorMsg("❌ Hubo un error, intenta más tarde")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-12 w-full max-w-4xl mx-auto relative z-10">
      {iaImage && (
        <div className="flex flex-col items-center md:items-start flex-1 mb-4 md:mb-0">
          <div className="relative w-full md:w-96 h-60 md:h-96 rounded-lg border shadow-md overflow-hidden mb-2 bg-muted backdrop-blur-sm bg-opacity-95">
            <img
              src={iaImage}
              alt="Imagen generada por IA"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <span className="text-blue-600 text-center text-sm md:text-left bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
            Esta imagen se adjuntará a tu correo de cotización.
          </span>
        </div>
      )}
      
      <div className="flex-1 min-w-[320px] max-w-lg mx-auto md:mx-0 md:pl-4">
        {/* Contenedor con fondo translúcido para el formulario */}
        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-border/50 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="font-medium">Nombre completo</label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                disabled={status === "loading"}
                className="bg-background/90"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="bg-background/90"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="telefono" className="font-medium">Teléfono</label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                autoComplete="tel"
                required
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                disabled={status === "loading"}
                className="bg-background/90"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="direccion" className="font-medium">Dirección</label>
              <Input
                id="direccion"
                name="direccion"
                type="text"
                autoComplete="street-address"
                required
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                disabled={status === "loading"}
                className="bg-background/90"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mensaje" className="font-medium">Descripción del proyecto</label>
              <Textarea
                id="mensaje"
                name="mensaje"
                autoComplete="off"
                required
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                disabled={status === "loading"}
                rows={4}
                className="bg-background/90"
              />
            </div>
            <Button type="submit" disabled={status === "loading"} className="h-12">
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Enviar"
              )}
            </Button>
            {status === "success" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-center bg-background/80 backdrop-blur-sm p-2 rounded">
                ✅ Enviado correctamente
              </motion.div>
            )}
            {status === "error" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-center bg-background/80 backdrop-blur-sm p-2 rounded">
                {errorMsg || "❌ Hubo un error, intenta más tarde"}
              </motion.div>
            )}
            {status === "ratelimit" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-yellow-600 text-center bg-background/80 backdrop-blur-sm p-2 rounded">
                {errorMsg || "⚠️ Por favor espera antes de volver a enviar"}
              </motion.div>
            )}
          </form>
        </div>
      </div>
      
      {/* Pop-up de éxito */}
      <SuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={() => setShowSuccessPopup(false)} 
      />
    </div>
  )
}
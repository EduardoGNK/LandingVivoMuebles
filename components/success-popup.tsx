"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessPopup({ isOpen, onClose }: SuccessPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-background rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border"
          >
            {/* Botón de cerrar */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Contenido del pop-up */}
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Ícono animado */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
                className="relative"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </motion.div>
                {/* Círculos de celebración */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-2 -left-2 h-4 w-4 bg-blue-400 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -top-1 -left-1 h-3 w-3 bg-yellow-400 rounded-full"
                />
              </motion.div>

              {/* Texto */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-2xl font-bold text-foreground">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-muted-foreground">
                  Tu solicitud de cotización ha sido enviada correctamente. 
                  Nos pondremos en contacto contigo pronto.
                </p>
              </motion.div>

              {/* Botón de confirmación */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-2 rounded-full"
                >
                  ¡Perfecto!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
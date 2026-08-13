"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { data: session } = useSession()

  // Si ya está autenticado, redirigir al admin
  if (session?.user?.role === "admin") {
    router.push("/admin")
    return null
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Usar redirect: true para permitir que NextAuth maneje la redirección OAuth correctamente
      const result = await signIn("google", { 
        callbackUrl: "/admin",
        redirect: true 
      })
      
      // Si llegamos aquí, significa que no hubo redirección (no debería pasar con redirect: true)
      if (result?.error) {
        if (result.error === "OAuthSignin") {
          setError("Error de configuración OAuth. Verifica las credenciales de Google.")
        } else if (result.error === "OAuthCallback") {
          setError("Error en el callback de OAuth. Intenta de nuevo.")
        } else if (result.error === "OAuthCreateAccount") {
          setError("No se pudo crear la cuenta. Intenta de nuevo.")
        } else if (result.error === "EmailCreateAccount") {
          setError("No se pudo crear la cuenta con este email.")
        } else if (result.error === "Callback") {
          setError("Error en el callback. Intenta de nuevo.")
        } else if (result.error === "OAuthAccountNotLinked") {
          setError("Esta cuenta ya está vinculada a otro usuario.")
        } else if (result.error === "EmailSignin") {
          setError("Error al enviar el email. Intenta de nuevo.")
        } else if (result.error === "CredentialsSignin") {
          setError("Credenciales inválidas.")
        } else if (result.error === "SessionRequired") {
          setError("Debes iniciar sesión para acceder.")
        } else {
          setError(`Error al iniciar sesión: ${result.error}`)
        }
        setLoading(false)
      }
    } catch (err) {
      console.error("Error en handleGoogleSignIn:", err)
      setError("Error al iniciar sesión. Intenta de nuevo.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <Image
              src="/logo-slogan.png"
              alt="AEservicios"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Panel de Administración</CardTitle>
          <p className="text-muted-foreground">
            Acceso exclusivo para administradores de AEservicios
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continuar con Google
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Acceso restringido</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Solo emails autorizados pueden acceder al panel de administración
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
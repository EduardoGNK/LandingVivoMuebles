"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestLoginPage() {
  const { data: session, status } = useSession()

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/admin" })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Prueba de Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>Estado:</strong> {status}</p>
            {session && (
              <div className="space-y-2">
                <p><strong>Usuario:</strong> {session.user?.name}</p>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Rol:</strong> {(session.user as any)?.role}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {!session ? (
              <Button onClick={handleGoogleSignIn} className="w-full">
                Iniciar sesión con Google
              </Button>
            ) : (
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Cerrar sesión
              </Button>
            )}
          </div>

          {session && (
            <div className="mt-4">
              <Button asChild className="w-full">
                <a href="/admin">Ir al Panel de Admin</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
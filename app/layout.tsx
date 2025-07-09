import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vivo Muebles",
  description: "Transforma tu hogar con Vivo Muebles. Especialistas en remodelaciones de interiores y cocinas sustentables en Santiago, Chile.",
  generator: 'v0.dev',
  icons: {
    icon: '/icono-pestaña.png',
    shortcut: '/icono-pestaña.png',
    apple: '/icono-pestaña.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icono-pestaña.png" />
        <link rel="shortcut icon" href="/icono-pestaña.png" />
        <link rel="apple-touch-icon" href="/icono-pestaña.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

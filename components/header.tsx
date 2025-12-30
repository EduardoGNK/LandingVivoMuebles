"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Nuestros Proyectos", href: "/gallery" },
  { name: "Contact", href: "#footer" },
]

export function Header() {
  const pathname = usePathname()
  const [hoveredPath, setHoveredPath] = useState(pathname)
  const { theme } = useTheme()
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  const scrollToContactForm = () => {
    if (pathname === "/") {
      // Si estamos en la página principal, hacer scroll al formulario con offset
      const contactForm = document.querySelector('[data-contact-form]')
      if (contactForm) {
        const elementPosition = contactForm.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - 200 // 100px de offset hacia arriba
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    } else {
      // Si estamos en otra página, navegar a la página principal con scroll
      window.location.href = "/#contact-form"
    }
  }

  const scrollToFooter = () => {
    if (pathname === "/") {
      // Si estamos en la página principal, hacer scroll al footer
      const footer = document.querySelector('#footer')
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' })
        // Trigger the animation by setting the hash
        window.history.pushState(null, '', '#footer')
        // Dispatch a hashchange event to trigger the animation
        window.dispatchEvent(new HashChangeEvent('hashchange'))
      }
    } else {
      // Si estamos en otra página, navegar a la página principal con hash
      window.location.href = "/#footer"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Image
                src={theme === "dark" ? "/logo-slogan-white.png" : "/logo-slogan.png"}
                alt="Vivo Muebles Logo"
                width={130}
                height={130}
                className="mr-2 rounded-full"
              />
              
            </motion.div>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navigation.map((item) => (
              item.name === "Contact" ? (
                <button
                  key={item.href}
                  onClick={scrollToFooter}
                  className="relative flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
                  onMouseOver={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(pathname)}
                >
                  <span>{item.name}</span>
                  {(hoveredPath === item.href || pathname === item.href) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[1px] left-0 h-[2px] w-full bg-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center text-sm font-medium transition-colors hover:text-foreground/80"
                  onMouseOver={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(pathname)}
                >
                  <span>{item.name}</span>
                  {(hoveredPath === item.href || pathname === item.href) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[1px] left-0 h-[2px] w-full bg-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              )
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user?.role === "admin" && (
            <>
              <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
                <Link href="/admin">Admin</Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden md:flex" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </>
          )}
          <Button size="sm" className="hidden md:flex" onClick={scrollToContactForm}>
            Cotizar
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="text-2xl font-bold tracking-tight mb-6">ARTISTRY</SheetTitle>
              <div className="flex flex-col gap-6">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    item.name === "Contact" ? (
                      <button
                        key={item.href}
                        onClick={scrollToFooter}
                        className={`text-lg font-medium text-left ${
                          pathname === item.href ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-lg font-medium ${
                          pathname === item.href ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </nav>
                <div className="flex flex-col gap-2">
                  {session?.user?.role === "admin" && (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/admin">Admin</Link>
                      </Button>
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        Cerrar Sesión
                      </Button>
                    </>
                  )}
                  <Button className="w-full" onClick={scrollToContactForm}>Cotizar</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

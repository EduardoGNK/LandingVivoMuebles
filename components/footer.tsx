import Link from "next/link"
import { Facebook, Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { FaXTwitter } from "react-icons/fa6"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="font-serif text-2xl font-bold tracking-tight">AEservicos</div>
            <p className="text-justify text-muted-foreground max-w-[300px] text-sm">
              Una empresa con más de 10 años de experiencia en el rubro de redodelación de interiores y exteriores, ofreciendo servicios de alta calidad y atención personalizada a nuestros clientes.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground">
                  Nuestros proyectos
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-muted-foreground hover:text-foreground">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/Artist" className="text-muted-foreground hover:text-foreground">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Contacto</h3>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>Santiago, Chile </p>
              <p>vivomueblescl@gmail.com</p>
              <p>aeservicioshogar@gmail.com</p>
              <p>+56 9 8418 7065</p>
            </address>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Nuestras redes sociales</h3>
            <div className="flex gap-6">
              <Link href="https://www.instagram.com/vivomuebles.cl/" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-7 w-7" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-7 w-7" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <FaXTwitter className="h-7 w-7" />
                <span className="sr-only">X</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <SiTiktok className="h-7 w-7" />
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AEservicios. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

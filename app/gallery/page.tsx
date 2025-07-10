import { ArtworkGrid } from "@/components/artwork-grid"

export default function GalleryPage() {
  return (
    <div className="container px-4 py-8 md:py-16">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nuestros proyectos</h1>
          <p className="text-base text-muted-foreground sm:text-xl">Conoce algunos de nuestros proyectos de cocina y más!</p>
        </div>
        <ArtworkGrid />
      </div>
    </div>
  )
}

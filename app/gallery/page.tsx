import { ArtworkGrid } from "@/components/artwork-grid"

export default function GalleryPage() {
  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Nuestros proyectos</h1>
          <p className="text-xl text-muted-foreground">Conoce algunos de nuestros proyectos de cocina y más!</p>
        </div>
        <ArtworkGrid />
      </div>
    </div>
  )
}

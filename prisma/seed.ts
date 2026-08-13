import { PrismaClient } from '@prisma/client'
import { INITIAL_PROJECTS } from '../data/artworks'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Poblando base de datos Supabase...')

  // Upsert usuario admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aeservicios.cl' },
    update: {},
    create: {
      email: 'admin@aeservicios.cl',
      name: 'Administrador Vivo Muebles',
      role: 'admin'
    }
  })

  for (const proj of INITIAL_PROJECTS) {
    await prisma.project.upsert({
      where: { id: proj.id },
      update: {
        title: proj.title,
        comuna: proj.comuna,
        startDate: proj.startDate,
        endDate: proj.endDate,
        workType: proj.workType,
        description: proj.description,
        propertyType: proj.propertyType,
        location: proj.location,
        gallery: proj.gallery,
        videos: proj.videos,
        status: 'published',
        isFeatured: proj.isFeatured,
        featuredOrder: proj.featuredOrder,
      },
      create: {
        id: proj.id,
        title: proj.title,
        comuna: proj.comuna,
        startDate: proj.startDate,
        endDate: proj.endDate,
        workType: proj.workType,
        description: proj.description,
        propertyType: proj.propertyType,
        location: proj.location,
        gallery: proj.gallery,
        videos: proj.videos,
        status: 'published',
        isFeatured: proj.isFeatured,
        featuredOrder: proj.featuredOrder,
        userId: admin.id,
      }
    })
  }

  console.log('✅ Seed completado: 5 proyectos iniciales creados/actualizados en Supabase')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
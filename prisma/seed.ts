import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario admin (sin contraseña, se usará Google OAuth)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aeservicios.cl' },
    update: {},
    create: {
      email: 'admin@aeservicios.cl',
      name: 'Administrador AEservicios',
      role: 'admin'
    }
  })

  // Crear proyecto de ejemplo
  await prisma.project.create({
    data: {
      title: 'Cocina Moderna Las Condes',
      description: 'Remodelación completa de cocina con estilo moderno, gabinetes blancos, encimera de mármol e isla central. Proyecto realizado en Las Condes, Santiago.',
      location: 'Las Condes, Santiago',
      gallery: [
        '/fotos/modern-kitchen.jpg',
        '/fotos/modern-kitchen-2.jpg',
        '/fotos/modern-kitchen-3.jpg'
      ],
      startDate: '2025-06-01',
      endDate: '2025-07-15',
      workType: 'Remodelación de cocina',
      propertyType: 'Departamento',
      status: 'published',
      metadata: {
        area: '25m²',
        duracion: '6 semanas',
        materiales: ['Mármol', 'Madera', 'Acero inoxidable']
      },
      userId: admin.id
    }
  })

  console.log('✅ Seed completado: Usuario admin y proyecto de ejemplo creados')
  console.log('')
  console.log('📝 Para acceder al panel de administración:')
  console.log('1. Configura las credenciales de Google OAuth en .env')
  console.log('2. Agrega tu email a la lista de emails autorizados en auth/[...nextauth]/route.ts')
  console.log('3. Ve a http://localhost:3000/login')
  console.log('4. Inicia sesión con Google')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
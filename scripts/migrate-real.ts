import mysql from 'mysql2/promise'
import { PrismaClient } from '@prisma/client'

async function runMigration() {
  console.log('🔌 Conectando a Railway MySQL...')
  const conn = await mysql.createConnection({
    host: 'tokaido.proxy.rlwy.net',
    port: 59857,
    user: 'root',
    password: 'wNTlxBJQVQAahOSuWzsiGdGyolADxSzP',
    database: 'railway'
  })

  const [rows]: any = await conn.query('SELECT * FROM Project')
  console.log(`✅ RECUPERADOS ${rows.length} PROYECTOS REALES DE RAILWAY!`)

  const supabase = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:Escalona1798.@db.qccdfmcbntyzzwstnvqu.supabase.co:5432/postgres'
      }
    }
  })

  // Borrar los 5 proyectos de prueba estáticos
  await supabase.project.deleteMany({
    where: {
      id: { in: ['proj-1', 'proj-2', 'proj-3', 'proj-4', 'proj-5'] }
    }
  })
  console.log('🧹 Proyectos de prueba borrados de Supabase.')

  for (const p of rows) {
    console.log(` 🚀 Transfiriendo a Supabase: [${p.id}] "${p.title}" (${p.comuna})`)

    let gallery = p.gallery
    if (typeof gallery === 'string') {
      try { gallery = JSON.parse(gallery) } catch { gallery = [gallery] }
    }
    let videos = p.videos
    if (typeof videos === 'string') {
      try { videos = JSON.parse(videos) } catch { videos = [] }
    }
    let metadata = p.metadata
    if (typeof metadata === 'string') {
      try { metadata = JSON.parse(metadata) } catch { metadata = {} }
    }

    await supabase.project.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        comuna: p.comuna || 'Santiago',
        startDate: p.startDate || '',
        endDate: p.endDate || '',
        workType: p.workType || 'Cocina completa',
        description: p.description || '',
        propertyType: p.propertyType || 'Proporción estándar',
        location: p.location || '',
        gallery: gallery || [],
        videos: videos || [],
        status: p.status || 'published',
        isFeatured: Boolean(p.isFeatured),
        featuredOrder: Number(p.featuredOrder) || 0,
        metadata: metadata || {},
      },
      create: {
        id: p.id,
        title: p.title,
        comuna: p.comuna || 'Santiago',
        startDate: p.startDate || '',
        endDate: p.endDate || '',
        workType: p.workType || 'Cocina completa',
        description: p.description || '',
        propertyType: p.propertyType || 'Proporción estándar',
        location: p.location || '',
        gallery: gallery || [],
        videos: videos || [],
        status: p.status || 'published',
        isFeatured: Boolean(p.isFeatured),
        featuredOrder: Number(p.featuredOrder) || 0,
        metadata: metadata || {},
      }
    })
  }

  const finalProjects = await supabase.project.findMany()
  console.log(`🎉 MIGRACIÓN COMPLETA Y EXITOSA! Total proyectos en Supabase: ${finalProjects.length}`)
  finalProjects.forEach((fp) => {
    console.log(`  - [${fp.id}] ${fp.title} (${(fp.gallery as any[])?.length || 0} fotos Cloudinary)`)
  })

  await conn.end()
  await supabase.$disconnect()
}

runMigration().catch((err) => console.error('💥 ERROR EN MIGRACIÓN:', err))

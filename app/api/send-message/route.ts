import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; last: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 2 * 60 * 1000 // 2 minutos

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()

  // Rate limiting
  const entry = rateLimitMap.get(ip)
  if (entry) {
    if (now - entry.last < WINDOW_MS) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json({ error: '⚠️ Por favor espera antes de volver a enviar' }, { status: 429 })
      }
      entry.count++
      entry.last = now
      rateLimitMap.set(ip, entry)
    } else {
      rateLimitMap.set(ip, { count: 1, last: now })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, last: now })
  }

  try {
    const { nombre, email, telefono, direccion, mensaje, imagenIA } = await request.json()
    if (!nombre || !email || !telefono || !direccion || !mensaje) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    // SMTP config from env
    const user = process.env.BREVO_SMTP_USER
    const pass = process.env.BREVO_SMTP_KEY
    const recipients = [
      process.env.EMAIL_1 || 'eduardo.escalona1@mail.udp.cl',
      process.env.EMAIL_2 || 'aeservicios@gmail.com',
      process.env.EMAIL_3 || 'alvaro.escalona@vivomuebles.cl',
      process.env.EMAIL_4 || 'contacto@vivomuebles.cl',
    ].filter((e): e is string => Boolean(e && e.trim()))

    if (!user || !pass || recipients.length === 0) {
      return NextResponse.json({ error: 'Configuración de correo incompleta' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: {
        // En desarrollo local, permitir certificados autofirmados
        // En producción, esto debería ser true para mayor seguridad
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    })

    console.log('Enviando correos individuales a destinatarios:', recipients.join(', '))

    let attachments: nodemailer.SendMailOptions['attachments'] = undefined
    // Adjuntar imagen si viene
    if (imagenIA && typeof imagenIA === 'string' && imagenIA.startsWith('data:')) {
      const matches = imagenIA.match(/^data:(.+);base64,(.+)$/)
      if (matches) {
        attachments = [
          {
            filename: 'cocina-ia.jpg',
            content: Buffer.from(matches[2], 'base64'),
            contentType: matches[1],
          },
        ]
      }
    }

    const results = await Promise.allSettled(
      recipients.map((to) =>
        transporter.sendMail({
          from: 'eduardo9escalona@gmail.com',
          to,
          subject: 'Nuevo mensaje de contacto desde el sitio web',
          text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nDirección: ${direccion}\nMensaje: ${mensaje}`,
          html: `<p><b>Nombre:</b> ${nombre}</p><p><b>Email:</b> ${email}</p><p><b>Teléfono:</b> ${telefono}</p><p><b>Dirección:</b> ${direccion}</p><p><b>Mensaje:</b><br/>${mensaje.replace(/\n/g, '<br/>')}</p>`,
          attachments,
        })
      )
    )

    results.forEach((res, i) => {
      if (res.status === 'rejected') {
        console.error(`Error enviando a ${recipients[i]}:`, res.reason)
      } else {
        console.log(`Enviado con éxito a ${recipients[i]}`)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error procesando envío de mensaje:', error)
    return NextResponse.json({ error: '❌ Hubo un error, intenta más tarde' }, { status: 500 })
  }
} 
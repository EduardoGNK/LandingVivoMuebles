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
    const to1 = process.env.EMAIL_1
    const to2 = process.env.EMAIL_2
    if (!user || !pass || !to1 || !to2) {
      return NextResponse.json({ error: 'Configuración de correo incompleta' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    })

    const mailOptions: nodemailer.SendMailOptions = {
      from: user,
      to: [to1, to2],
      subject: 'Nuevo mensaje de contacto desde el sitio web',
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nDirección: ${direccion}\nMensaje: ${mensaje}`,
      html: `<p><b>Nombre:</b> ${nombre}</p><p><b>Email:</b> ${email}</p><p><b>Teléfono:</b> ${telefono}</p><p><b>Dirección:</b> ${direccion}</p><p><b>Mensaje:</b><br/>${mensaje.replace(/\n/g, '<br/>')}</p>`,
    }

    // Adjuntar imagen si viene
    if (imagenIA && typeof imagenIA === 'string' && imagenIA.startsWith('data:')) {
      const matches = imagenIA.match(/^data:(.+);base64,(.+)$/)
      if (matches) {
        mailOptions.attachments = [
          {
            filename: 'cocina-ia.jpg',
            content: Buffer.from(matches[2], 'base64'),
            contentType: matches[1],
          },
        ]
      }
    }

    await transporter.sendMail(mailOptions)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error enviando mensaje:', error)
    }
    return NextResponse.json({ error: '❌ Hubo un error, intenta más tarde' }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// SECURITY: HTML escaping to prevent HTML injection in email body (CWE-80)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; last: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 2 * 60 * 1000 // 2 minutos

// Input validation constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD_LENGTH = 500
const MAX_MESSAGE_LENGTH = 2000

export async function POST(request: NextRequest) {
  // Use first IP from x-forwarded-for (not the full chain, to avoid header spoofing)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
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

    // SECURITY: Validate email format to prevent header injection
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 })
    }

    // SECURITY: Enforce field length limits to prevent payload abuse
    if (
      nombre.length > MAX_FIELD_LENGTH ||
      email.length > MAX_FIELD_LENGTH ||
      telefono.length > MAX_FIELD_LENGTH ||
      direccion.length > MAX_FIELD_LENGTH ||
      mensaje.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ error: 'Uno o más campos exceden el límite permitido' }, { status: 400 })
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
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    })

    // SECURITY: Escape all user-supplied values before injecting in HTML (CWE-80)
    const safeNombre = escapeHtml(String(nombre))
    const safeEmail = escapeHtml(String(email))
    const safeTelefono = escapeHtml(String(telefono))
    const safeDireccion = escapeHtml(String(direccion))
    const safeMensaje = escapeHtml(String(mensaje)).replace(/\n/g, '<br/>')

    let attachments: nodemailer.SendMailOptions['attachments'] = undefined
    // SECURITY: Strictly validate MIME type and base64 charset for image attachments
    if (imagenIA && typeof imagenIA === 'string' && imagenIA.startsWith('data:image/')) {
      const matches = imagenIA.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/)
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

    console.log(`Enviando correos a ${recipients.length} destinatario(s)`)

    const results = await Promise.allSettled(
      recipients.map((to) =>
        transporter.sendMail({
          from: process.env.EMAIL_FROM || '"Vivo Muebles - Cotizaciones" <eduardo9escalona@gmail.com>',
          to,
          subject: 'Nuevo mensaje de contacto desde el sitio web',
          // Plain text version (no HTML injection risk)
          text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nDirección: ${direccion}\nMensaje: ${mensaje}`,
          // HTML version with properly escaped values
          html: `<p><b>Nombre:</b> ${safeNombre}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Teléfono:</b> ${safeTelefono}</p><p><b>Dirección:</b> ${safeDireccion}</p><p><b>Mensaje:</b><br/>${safeMensaje}</p>`,
          attachments,
        })
      )
    )

    results.forEach((res, i) => {
      if (res.status === 'rejected') {
        console.error(`Error enviando a destinatario ${i + 1}:`, res.reason)
      } else {
        console.log(`Enviado con éxito a destinatario ${i + 1}`)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error procesando envío de mensaje:', error)
    return NextResponse.json({ error: '❌ Hubo un error, intenta más tarde' }, { status: 500 })
  }
}
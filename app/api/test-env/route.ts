import { NextResponse } from 'next/server';

export async function GET() {
  // Restringir el acceso a entornos de desarrollo únicamente por seguridad
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint no disponible en producción' }, { status: 403 });
  }

  return NextResponse.json({
    BREVO_SMTP_USER: process.env.BREVO_SMTP_USER ? 'Configurado' : 'No configurado',
    EMAIL_1: process.env.EMAIL_1 ? 'Configurado' : 'No configurado',
  });
}
import { NextRequest, NextResponse } from 'next/server';

// API Route para manejar el callback de PatPass by Webpay
// Esta ruta recibe la respuesta de Transbank después de completar la inscripción

// SECURITY: Usar una URL base fija en lugar de confiar en el header Host.
// Esto previene Host Header Injection (CWE-601) y Open Redirect.
function getTrustedBaseUrl(): string {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const tbk_token = searchParams.get('tbk_token');
    const tbk_orden_compra = searchParams.get('tbk_orden_compra');
    const tbk_id_sesion = searchParams.get('tbk_id_sesion');

    // No loggear tokens sensibles en texto plano
    console.log('📞 Callback PatPass recibido:', {
      token: token ? '[PRESENTE]' : null,
      tbk_token: tbk_token ? '[PRESENTE]' : null,
      tbk_orden_compra,
      tbk_id_sesion,
    });

    // SECURITY: URL base fija y confiable, no derivada de headers de la request
    const baseUrl = getTrustedBaseUrl();
    const redirectUrl = new URL('/Artist', baseUrl);

    if (token && tbk_token) {
      redirectUrl.searchParams.set('status', 'success');
      redirectUrl.searchParams.set('message', 'Inscripción completada exitosamente');
    } else {
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', 'Error en la inscripción');
    }

    console.log('🔄 Redirigiendo a:', redirectUrl.pathname);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error en callback PatPass:', error);
    const baseUrl = getTrustedBaseUrl();
    const redirectUrl = new URL('/Artist', baseUrl);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', 'Error procesando la respuesta');
    return NextResponse.redirect(redirectUrl);
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
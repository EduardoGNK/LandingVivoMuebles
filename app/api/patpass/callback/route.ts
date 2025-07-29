import { NextRequest, NextResponse } from 'next/server';

// API Route para manejar el callback de PatPass by Webpay
// Esta ruta recibe la respuesta de Transbank después de completar la inscripción

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const tbk_token = searchParams.get('tbk_token');
    const tbk_orden_compra = searchParams.get('tbk_orden_compra');
    const tbk_id_sesion = searchParams.get('tbk_id_sesion');

    console.log('📞 Callback PatPass recibido:', {
      token,
      tbk_token,
      tbk_orden_compra,
      tbk_id_sesion,
    });

    // En modo testing, simulamos el procesamiento
    // En producción, aquí se verificaría la respuesta con Transbank
    
    // Construir URL de redirección con parámetros
    // Usar localhost explícitamente para evitar problemas con 0.0.0.0
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    
    // Asegurar que usamos localhost en lugar de 0.0.0.0
    const cleanHost = host.replace('0.0.0.0', 'localhost');
    
    const redirectUrl = new URL('/Artist', `${protocol}://${cleanHost}`);
    
    if (token && tbk_token) {
      // Éxito - agregar parámetros de éxito
      redirectUrl.searchParams.set('status', 'success');
      redirectUrl.searchParams.set('token', token);
      redirectUrl.searchParams.set('tbk_token', tbk_token);
      redirectUrl.searchParams.set('message', 'Inscripción completada exitosamente');
    } else {
      // Error - agregar parámetros de error
      redirectUrl.searchParams.set('status', 'error');
      redirectUrl.searchParams.set('message', 'Error en la inscripción');
    }

    console.log('🔄 Redirigiendo a:', redirectUrl.toString());

    // Redirigir al usuario de vuelta a la página de pricing
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('❌ Error en callback PatPass:', error);
    
    // En caso de error, redirigir con mensaje de error
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const cleanHost = host.replace('0.0.0.0', 'localhost');
    
    const redirectUrl = new URL('/Artist', `${protocol}://${cleanHost}`);
    redirectUrl.searchParams.set('status', 'error');
    redirectUrl.searchParams.set('message', 'Error procesando la respuesta');
    
    return NextResponse.redirect(redirectUrl);
  }
}

export async function POST(request: NextRequest) {
  // También manejar POST requests si Transbank los envía
  return GET(request);
} 
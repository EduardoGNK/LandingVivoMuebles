// Utilidades para integración con PatPass by Webpay (Modo Testing)
// Documentación: https://www.transbankdevelopers.cl/documentacion/pago-automatico-con-tarjetas

export interface PatPassPlan {
  name: string;
  price: number;
  period: string;
  features: string[];
  featured?: boolean;
}

export interface PatPassInitRequest {
  commerce_code: string;
  buy_order: string;
  session_id: string;
  amount: number;
  return_url: string;
  commerce_logo_url?: string;
  commerce_name: string;
  payment_method: number;
  payment_type: string;
  subscription_start_date: string;
  subscription_end_date: string;
  max_installments_number: number;
  periodicity: number;
  periodicity_type: string;
}

export interface PatPassInitResponse {
  token: string;
  url: string;
}

// Función para obtener la URL base correcta
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar la URL actual
    return window.location.origin;
  }
  // En el servidor, usar localhost por defecto
  return 'http://localhost:3000';
};

// Configuración para modo testing
const PATPASS_CONFIG = {
  commerce_code: '597055555532', // Código de comercio de prueba
  api_key: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key de prueba
  base_url: 'https://pagoautomaticocontarjetasint.transbank.cl',
  get return_url() {
    return `${getBaseUrl()}/api/patpass/callback`;
  },
};

// Generar ID único para la orden
export const generateBuyOrder = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORDER_${timestamp}_${random}`;
};

// Generar ID de sesión único
export const generateSessionId = (): string => {
  return `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Calcular fecha de término del mandato según la duración del plan
export const calculateEndDate = (period: string): string => {
  const startDate = new Date();
  let endDate = new Date();

  switch (period.toLowerCase()) {
    case 'mes':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case 'año':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case 'trimestre':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 1); // Por defecto 1 mes
  }

  return endDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

// Calcular fecha de inicio (hoy)
export const getStartDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Determinar periodicidad según el plan
export const getPeriodicity = (period: string): { number: number; type: string } => {
  switch (period.toLowerCase()) {
    case 'mes':
      return { number: 1, type: 'MONTH' };
    case 'año':
      return { number: 12, type: 'MONTH' };
    case 'trimestre':
      return { number: 3, type: 'MONTH' };
    default:
      return { number: 1, type: 'MONTH' };
  }
};

// Inicializar inscripción PatPass
export const initPatPass = async (plan: PatPassPlan): Promise<PatPassInitResponse> => {
  const buyOrder = generateBuyOrder();
  const sessionId = generateSessionId();
  const startDate = getStartDate();
  const endDate = calculateEndDate(plan.period);
  const periodicity = getPeriodicity(plan.period);

  const requestData: PatPassInitRequest = {
    commerce_code: PATPASS_CONFIG.commerce_code,
    buy_order: buyOrder,
    session_id: sessionId,
    amount: plan.price,
    return_url: PATPASS_CONFIG.return_url,
    commerce_logo_url: `${getBaseUrl()}/logo-slogan.png`,
    commerce_name: 'Vivo Muebles - Recolección Sustentable',
    payment_method: 101, // Tarjeta de crédito
    payment_type: 'VD', // Venta Débito
    subscription_start_date: startDate,
    subscription_end_date: endDate,
    max_installments_number: 1, // Sin cuotas para suscripciones
    periodicity: periodicity.number,
    periodicity_type: periodicity.type,
  };

  try {
    // En modo testing, simulamos la respuesta de Transbank
    // En producción, aquí iría la llamada real a la API de Transbank
    console.log('🚀 Iniciando PatPass con datos:', requestData);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular respuesta exitosa de Transbank
    const mockResponse: PatPassInitResponse = {
      token: `TOKEN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: `${PATPASS_CONFIG.base_url}/webpay/patpass/init?token=${Date.now()}`,
    };

    // Guardar datos en localStorage para el callback
    localStorage.setItem('patpass_data', JSON.stringify({
      plan: plan.name,
      amount: plan.price,
      buyOrder,
      sessionId,
      timestamp: Date.now(),
    }));

    console.log('✅ Respuesta simulada de PatPass:', mockResponse);
    return mockResponse;
  } catch (error) {
    console.error('❌ Error iniciando PatPass:', error);
    throw new Error('No se pudo iniciar la inscripción PatPass');
  }
};

// Simular el proceso completo de PatPass (para testing)
export const simulatePatPassFlow = async (plan: PatPassPlan): Promise<void> => {
  try {
    console.log('🎭 Simulando flujo completo de PatPass...');
    
    // Paso 1: Inicializar PatPass
    const response = await initPatPass(plan);
    console.log('📋 Paso 1 - Inicialización completada');
    
    // Paso 2: Simular que el usuario completa el formulario en Transbank
    console.log('⏳ Paso 2 - Simulando proceso en Transbank...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Paso 3: Simular callback exitoso
    console.log('🔄 Paso 3 - Simulando callback exitoso...');
    
    // Usar la URL base correcta
    const baseUrl = getBaseUrl();
    const successUrl = new URL('/api/patpass/callback', baseUrl);
    successUrl.searchParams.set('status', 'success');
    successUrl.searchParams.set('token', response.token);
    successUrl.searchParams.set('tbk_token', `TBK_${Date.now()}`);
    successUrl.searchParams.set('message', 'Inscripción completada exitosamente');
    
    console.log('🌐 Redirigiendo a:', successUrl.toString());
    
    // Redirigir al callback simulado
    window.location.href = successUrl.toString();
    
  } catch (error) {
    console.error('❌ Error en simulación:', error);
    throw error;
  }
};

// Procesar respuesta de PatPass (callback)
export const processPatPassResponse = (token: string, tbk_token: string): {
  success: boolean;
  message: string;
  details?: any;
} => {
  try {
    // En modo testing, simulamos la verificación
    // En producción, aquí se verificaría con Transbank
    
    const storedData = localStorage.getItem('patpass_data');
    if (!storedData) {
      return {
        success: false,
        message: 'No se encontraron datos de la transacción',
      };
    }

    const data = JSON.parse(storedData);
    
    // Simular verificación exitosa
    const success = Math.random() > 0.1; // 90% de éxito para testing
    
    if (success) {
      // Limpiar datos almacenados
      localStorage.removeItem('patpass_data');
      
      return {
        success: true,
        message: `¡Inscripción exitosa al plan ${data.plan}! Tu mandato digital ha sido activado.`,
        details: {
          plan: data.plan,
          amount: data.amount,
          buyOrder: data.buyOrder,
          sessionId: data.sessionId,
        },
      };
    } else {
      return {
        success: false,
        message: 'La inscripción no pudo ser completada. Por favor, intenta nuevamente.',
      };
    }
  } catch (error) {
    console.error('Error procesando respuesta PatPass:', error);
    return {
      success: false,
      message: 'Error procesando la respuesta del sistema de pagos.',
    };
  }
}; 
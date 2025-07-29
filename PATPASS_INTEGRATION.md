# Integración PatPass by Webpay - Modo Testing

## Descripción
Esta implementación integra PatPass by Webpay de Transbank para crear mandatos digitales (suscripciones automáticas) en modo testing. Permite a los usuarios suscribirse a planes de recolección de basura sustentable con cobros automáticos.

## 🚀 **CÓMO PROBAR LA INTEGRACIÓN**

### **Paso 1: Iniciar la Aplicación**
```bash
npm run dev
# o
yarn dev
```

### **Paso 2: Ir a la Página de Pricing**
```
http://localhost:3000/Artist
```

### **Paso 3: Probar la Suscripción**
1. **Hacer clic en "Suscribirse"** en cualquier plan
2. **Ver en la consola del navegador** los logs del proceso:
   ```
   🎯 Iniciando suscripción PatPass para plan: {name: "Premium", price: 10000, ...}
   🚀 Iniciando PatPass con datos: {commerce_code: "597055555532", ...}
   ✅ Respuesta simulada de PatPass: {token: "TOKEN_...", url: "..."}
   🎭 Simulando flujo completo de PatPass...
   📋 Paso 1 - Inicialización completada
   ⏳ Paso 2 - Simulando proceso en Transbank...
   🔄 Paso 3 - Simulando callback exitoso...
   ```
3. **Esperar 3 segundos** mientras se simula el proceso
4. **Ver la alerta de éxito** que aparece automáticamente

### **Paso 4: Verificar el Resultado**
- ✅ **Alerta verde** aparece en la parte superior
- ✅ **Mensaje de éxito** con detalles del plan
- ✅ **Parámetros de URL** se limpian automáticamente
- ✅ **Datos en localStorage** se procesan correctamente

## Archivos Implementados

### 1. `lib/patpass.ts`
- **Funcionalidad**: Utilidades para integración con PatPass
- **Características**:
  - Configuración para modo testing
  - Generación de IDs únicos (buy_order, session_id)
  - Cálculo de fechas de inicio y término
  - Simulación de llamadas a API de Transbank
  - Procesamiento de respuestas
  - **NUEVO**: Simulación completa del flujo

### 2. `app/api/patpass/callback/route.ts`
- **Funcionalidad**: API route para manejar callbacks de Transbank
- **Características**:
  - Recibe parámetros de respuesta de PatPass
  - Redirige al usuario de vuelta a la página de pricing
  - Maneja tanto GET como POST requests

### 3. `components/pricing-card.tsx` (Actualizado)
- **Funcionalidad**: Componente de tarjeta de precios con integración PatPass
- **Características**:
  - Botón de suscripción que inicia PatPass
  - Estado de carga durante el proceso
  - Manejo de errores
  - **NUEVO**: Simulación completa sin redirección a Transbank

### 4. `app/Artist/page.tsx` (Actualizado)
- **Funcionalidad**: Página principal de pricing con manejo de callbacks
- **Características**:
  - Procesamiento de parámetros de URL
  - Alertas de éxito/error
  - Información sobre PatPass para usuarios
  - Limpieza automática de parámetros de URL

## Flujo de Integración (Simulado)

### 1. Inicio de Suscripción
```
Usuario hace clic en "Suscribirse" → 
Se genera buy_order y session_id → 
Se calculan fechas de mandato → 
Se simula llamada a Transbank → 
Se simula proceso completo → 
Usuario ve alerta de éxito
```

### 2. Proceso Simulado
```
Paso 1: Inicialización PatPass (1 segundo)
Paso 2: Simulación de formulario Transbank (2 segundos)  
Paso 3: Simulación de callback exitoso (automático)
```

### 3. Resultado Final
```
API route recibe parámetros simulados → 
Se procesa respuesta → 
Usuario ve alerta de éxito/error → 
Parámetros se limpian automáticamente
```

## Configuración de Testing

### Credenciales de Prueba
```typescript
const PATPASS_CONFIG = {
  commerce_code: '597055555532', // Código de comercio de prueba
  api_key: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C', // API Key de prueba
  base_url: 'https://pagoautomaticocontarjetasint.transbank.cl',
  return_url: 'http://localhost:3000/api/patpass/callback',
};
```

### Datos de Prueba
- **Simulación completa**: Sin necesidad de ir a Transbank real
- **Simulación de éxito**: 90% de probabilidad de éxito
- **Logs detallados**: Con emojis para fácil identificación
- **Tiempo de simulación**: 3 segundos total

## Planes Implementados

### 1. Plan Básico - $7.990/mes
- 2 recolectadas por semana
- Mandato digital mensual
- Sin personalización

### 2. Plan Premium - $10.000/mes
- 3 recolectadas por semana
- Mandato digital mensual
- Con personalización y prioridad

### 3. Plan Básico Anual - $80.000/año
- 2 recolectadas por semana
- Mandato digital anual
- Ahorro de 2 meses

## Cálculo de Fechas de Mandato

### Fechas de Inicio
- **Inicio**: Fecha actual
- **Formato**: YYYY-MM-DD

### Fechas de Término
- **Mensual**: +1 mes
- **Trimestral**: +3 meses
- **Anual**: +12 meses

## Características de Seguridad

### Modo Testing
- Credenciales de prueba
- Simulación completa de respuestas
- Sin validación real de Transbank
- Datos almacenados en localStorage
- **NUEVO**: No redirección a URLs reales

### Para Producción
- Credenciales reales de Transbank
- Validación de respuestas con Transbank
- Almacenamiento seguro de datos
- Manejo de errores robusto
- Redirección real a Transbank

## Pruebas Detalladas

### 1. Probar Suscripción Completa
1. Ir a `/Artist`
2. Abrir consola del navegador (F12)
3. Hacer clic en "Suscribirse" en cualquier plan
4. Verificar logs en consola:
   ```
   🎯 Iniciando suscripción PatPass para plan: {...}
   🚀 Iniciando PatPass con datos: {...}
   ✅ Respuesta simulada de PatPass: {...}
   🎭 Simulando flujo completo de PatPass...
   📋 Paso 1 - Inicialización completada
   ⏳ Paso 2 - Simulando proceso en Transbank...
   🔄 Paso 3 - Simulando callback exitoso...
   ```
5. Verificar alerta de éxito
6. Verificar limpieza de parámetros de URL

### 2. Probar Estados de Carga
1. Hacer clic en "Suscribirse"
2. Verificar que el botón muestra "Procesando PatPass..."
3. Verificar que el botón está deshabilitado
4. Esperar a que termine el proceso

### 3. Probar Manejo de Errores
1. Simular error en la consola
2. Verificar alerta de error
3. Verificar que el botón vuelve a su estado normal

## Logs y Debugging

### Console Logs con Emojis
- 🎯 Inicio de suscripción
- 🚀 Datos enviados a PatPass
- ✅ Respuesta recibida
- 🎭 Inicio de simulación
- 📋 Paso 1 completado
- ⏳ Paso 2 en progreso
- 🔄 Paso 3 completado
- ❌ Errores

### LocalStorage
- Datos de transacción temporal
- Limpieza automática en éxito
- Persistencia para debugging

## Ventajas de la Simulación

### ✅ **Fácil Testing**
- No necesitas credenciales reales
- No necesitas ir a Transbank
- Proceso completo en 3 segundos

### ✅ **Debugging Completo**
- Logs detallados en consola
- Control total del flujo
- Fácil identificación de problemas

### ✅ **Desarrollo Rápido**
- Sin dependencias externas
- Respuestas predecibles
- Fácil modificación

## Próximos Pasos para Producción

1. **Credenciales Reales**
   - Obtener credenciales de Transbank
   - Configurar URLs de producción
   - Implementar validación de respuestas

2. **Seguridad**
   - Validar tokens con Transbank
   - Implementar firma digital
   - Almacenamiento seguro de datos

3. **Base de Datos**
   - Guardar suscripciones activas
   - Tracking de pagos
   - Gestión de cancelaciones

4. **Notificaciones**
   - Emails de confirmación
   - Notificaciones de cobro
   - Alertas de problemas

## Documentación de Transbank

- [PatPass by Webpay](https://www.transbankdevelopers.cl/documentacion/pago-automatico-con-tarjetas)
- [Ambiente de Integración](https://www.transbankdevelopers.cl/documentacion/ambiente-de-integracion)
- [Códigos de Comercio](https://www.transbankdevelopers.cl/documentacion/codigos-de-comercio)

## Notas Importantes

- Esta implementación es **SOLO PARA TESTING**
- **No redirige a Transbank real** - todo es simulado
- **Proceso completo en 3 segundos** para testing rápido
- **Logs detallados** para debugging fácil
- **Fácil transición a producción** cuando tengas credenciales reales 
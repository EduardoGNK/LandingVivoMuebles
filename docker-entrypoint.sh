#!/bin/sh

echo "🚀 Iniciando Vivo Muebles..."

# Esperar a que la base de datos esté lista
echo "⏳ Esperando conexión a la base de datos..."
npx prisma db push --accept-data-loss

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

# Iniciar la aplicación
echo "✅ Iniciando aplicación Next.js..."
exec node server.js


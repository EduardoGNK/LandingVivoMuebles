#!/bin/bash

# ===========================================
# SCRIPT DE DESPLIEGUE - VIVO MUEBLES
# ===========================================

set -e

echo "🚀 Iniciando despliegue de Vivo Muebles..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar archivo .env
if [ ! -f .env ]; then
    print_warning "Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    print_warning "Por favor edita el archivo .env con tus configuraciones antes de continuar."
    exit 1
fi

# Parar contenedores existentes
print_status "Parando contenedores existentes..."
docker-compose down

# Limpiar imágenes antiguas (opcional)
read -p "¿Deseas limpiar imágenes Docker antiguas? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Limpiando imágenes antiguas..."
    docker system prune -f
fi

# Construir y levantar contenedores
print_status "Construyendo y levantando contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
print_status "Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los contenedores
print_status "Verificando estado de los contenedores..."
docker-compose ps

# Ejecutar migraciones de Prisma
print_status "Ejecutando migraciones de Prisma..."
docker-compose exec app npx prisma migrate deploy

# Generar cliente de Prisma
print_status "Generando cliente de Prisma..."
docker-compose exec app npx prisma generate

# Verificar que la aplicación esté funcionando
print_status "Verificando que la aplicación esté funcionando..."
sleep 10

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Aplicación desplegada exitosamente!"
    print_status "🌐 Accede a: http://localhost:3000"
else
    print_error "❌ La aplicación no está respondiendo. Revisa los logs:"
    docker-compose logs app
fi

print_status "📋 Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Parar servicios: docker-compose down"
echo "  - Reiniciar: docker-compose restart"
echo "  - Acceder al contenedor: docker-compose exec app sh"


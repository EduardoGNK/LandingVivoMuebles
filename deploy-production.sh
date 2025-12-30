#!/bin/bash

# ===========================================
# SCRIPT DE DESPLIEGUE EN PRODUCCIÓN
# ===========================================

set -e

echo "🚀 Desplegando Vivo Muebles en PRODUCCIÓN..."

# Configuración
PRODUCTION_ENV=".env.production"
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[PROD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en producción
if [ "$NODE_ENV" != "production" ]; then
    print_warning "NODE_ENV no está configurado como 'production'"
    read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Crear backup de la base de datos
print_status "Creando backup de la base de datos..."
mkdir -p $BACKUP_DIR
docker-compose exec mysql mysqldump -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE > $BACKUP_DIR/database_backup.sql

# Parar servicios
print_status "Parando servicios de producción..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# Limpiar sistema Docker
print_status "Limpiando sistema Docker..."
docker system prune -f

# Construir y levantar en producción
print_status "Construyendo y desplegando en producción..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Esperar servicios
print_status "Esperando que los servicios estén listos..."
sleep 60

# Ejecutar migraciones
print_status "Ejecutando migraciones..."
docker-compose exec app npx prisma migrate deploy

# Verificar salud de la aplicación
print_status "Verificando salud de la aplicación..."
sleep 30

# Health check
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_status "✅ Despliegue en producción exitoso!"
    print_status "🌐 Aplicación disponible en: https://tu-dominio.com"
else
    print_error "❌ Error en el despliegue. Revisando logs..."
    docker-compose logs app
    exit 1
fi

print_status "📊 Estado de los servicios:"
docker-compose ps

print_status "💾 Backup creado en: $BACKUP_DIR"


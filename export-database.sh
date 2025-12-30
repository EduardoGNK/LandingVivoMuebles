#!/bin/bash

# ===========================================
# SCRIPT PARA EXPORTAR BASE DE DATOS LOCAL
# ===========================================

set -e

echo "📦 Exportando base de datos local..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Cargar variables de entorno desde .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Verificar que DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL no está configurada${NC}"
    echo "Asegúrate de tener DATABASE_URL en tu .env.local"
    exit 1
fi

# Extraer información de la conexión desde DATABASE_URL
# Formato: mysql://user:password@host:port/database
DB_URL_REGEX="mysql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo -e "${RED}❌ Error: No se pudo parsear DATABASE_URL${NC}"
    exit 1
fi

# Nombre del archivo de backup
BACKUP_FILE="backup_${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

echo -e "${GREEN}📊 Información de la base de datos:${NC}"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Verificar que mysqldump está disponible
if ! command -v mysqldump &> /dev/null; then
    echo -e "${RED}❌ Error: mysqldump no está instalado${NC}"
    echo "Instala MySQL client tools para exportar la base de datos"
    exit 1
fi

# Exportar la base de datos
echo -e "${YELLOW}⏳ Exportando base de datos...${NC}"
mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
    --single-transaction \
    --routines \
    --triggers \
    "$DB_NAME" > "$BACKUP_FILE"

# Comprimir el backup
echo -e "${YELLOW}📦 Comprimiendo backup...${NC}"
gzip "$BACKUP_FILE"

echo ""
echo -e "${GREEN}✅ Backup creado exitosamente: ${BACKUP_FILE_GZ}${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Transfiere este archivo al VPS (usando SCP, SFTP, o Bitvise)"
echo "   2. En el VPS, ejecuta: ./import-database.sh ${BACKUP_FILE_GZ}"
echo ""


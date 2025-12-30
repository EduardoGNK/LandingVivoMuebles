#!/bin/bash

# ===========================================
# SCRIPT PARA IMPORTAR BASE DE DATOS EN VPS
# ===========================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar que se proporcionó el archivo de backup
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar el archivo de backup${NC}"
    echo "Uso: ./import-database.sh backup_database_YYYYMMDD_HHMMSS.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: El archivo $BACKUP_FILE no existe${NC}"
    exit 1
fi

# Cargar variables de entorno desde .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Verificar que DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL no está configurada en .env${NC}"
    exit 1
fi

# Extraer información de la conexión desde DATABASE_URL
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

echo -e "${GREEN}📊 Información de la base de datos:${NC}"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo ""

# Verificar que el contenedor de MySQL está corriendo
if [ "$DB_HOST" = "mysql" ] || [ "$DB_HOST" = "localhost" ]; then
    echo -e "${YELLOW}⏳ Verificando que MySQL está corriendo...${NC}"
    if ! docker-compose ps mysql | grep -q "Up"; then
        echo -e "${YELLOW}⚠️  MySQL no está corriendo. Iniciando contenedores...${NC}"
        docker-compose up -d mysql
        echo "⏳ Esperando a que MySQL esté listo..."
        sleep 10
    fi
fi

# Descomprimir el backup si está comprimido
TEMP_SQL_FILE=""
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo -e "${YELLOW}📦 Descomprimiendo backup...${NC}"
    TEMP_SQL_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$BACKUP_FILE" > "$TEMP_SQL_FILE"
    SQL_FILE="$TEMP_SQL_FILE"
else
    SQL_FILE="$BACKUP_FILE"
fi

# Confirmar antes de importar
echo ""
echo -e "${RED}⚠️  ADVERTENCIA: Esto reemplazará todos los datos en la base de datos $DB_NAME${NC}"
read -p "¿Estás seguro de que quieres continuar? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Operación cancelada"
    [ -n "$TEMP_SQL_FILE" ] && rm -f "$TEMP_SQL_FILE"
    exit 0
fi

# Importar la base de datos
echo -e "${YELLOW}⏳ Importando base de datos...${NC}"

if [ "$DB_HOST" = "mysql" ]; then
    # Si MySQL está en Docker, usar docker exec
    docker-compose exec -T mysql mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"
else
    # Si MySQL está en el host
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$SQL_FILE"
fi

# Limpiar archivo temporal
[ -n "$TEMP_SQL_FILE" ] && rm -f "$TEMP_SQL_FILE"

echo ""
echo -e "${GREEN}✅ Base de datos importada exitosamente${NC}"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica que los datos se importaron correctamente"
echo "   2. Ejecuta las migraciones de Prisma si es necesario:"
echo "      docker-compose exec app npx prisma migrate deploy"
echo "   3. Regenera el cliente de Prisma:"
echo "      docker-compose exec app npx prisma generate"
echo ""


#!/bin/bash

# ===========================================
# SCRIPT DE CONFIGURACIÓN INICIAL DEL VPS
# ===========================================

set -e

echo "🔧 Configurando VPS para LandingVivoMuebles..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# 1. Verificar que .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
    echo "📝 Copiando env.example a .env..."
    cp env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo ""
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales:"
    echo "   nano .env"
    echo ""
    read -p "Presiona Enter cuando hayas editado el .env..."
fi

# 2. Verificar permisos del .env
echo "🔒 Configurando permisos del archivo .env..."
chmod 600 .env
echo -e "${GREEN}✅ Permisos configurados (solo lectura para el propietario)${NC}"

# 3. Verificar que .env está en .gitignore
if grep -q "^\.env$" .gitignore && grep -q "^\.env\.local$" .gitignore; then
    echo -e "${GREEN}✅ .env está en .gitignore${NC}"
else
    echo -e "${YELLOW}⚠️  Advertencia: .env podría no estar en .gitignore${NC}"
fi

# 4. Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "Instala Docker con: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo -e "${GREEN}✅ Docker y Docker Compose están instalados${NC}"

# 5. Verificar que las variables críticas están configuradas
echo ""
echo "🔍 Verificando variables críticas en .env..."

REQUIRED_VARS=(
    "NEXTAUTH_URL"
    "NEXTAUTH_SECRET"
    "GOOGLE_CLIENT_ID"
    "GOOGLE_CLIENT_SECRET"
    "HF_TOKEN"
    "BREVO_SMTP_USER"
    "BREVO_SMTP_KEY"
    "EMAIL_1"
    "EMAIL_2"
    "DATABASE_URL"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env || grep -q "^${var}=your_" .env || grep -q "^${var}=$" .env; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Variables no configuradas o con valores por defecto:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Por favor edita el archivo .env y configura estas variables."
    exit 1
fi

echo -e "${GREEN}✅ Todas las variables críticas están configuradas${NC}"

# 6. Resumen
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Configuración inicial completada${NC}"
echo "=========================================="
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica que todas las variables en .env son correctas"
echo "   2. Ejecuta: ./deploy.sh"
echo "   3. O manualmente: docker-compose up -d"
echo ""



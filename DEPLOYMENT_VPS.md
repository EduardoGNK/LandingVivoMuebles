# Guía de Despliegue en VPS con Docker

Esta guía explica cómo desplegar la aplicación en un VPS usando Docker, Bitvise SSH y GitHub.

## 📋 Requisitos Previos

- VPS con Docker y Docker Compose instalados
- Acceso SSH al VPS (Bitvise SSH)
- Repositorio de GitHub configurado
- Todas las keys y tokens necesarios

## 🔐 Manejo de Secrets (IMPORTANTE)

**NUNCA subas archivos `.env` o `.env.local` al repositorio.** Estos archivos se crean directamente en el servidor.

### Variables de Entorno Necesarias

Crea un archivo `.env` en el servidor con todas las variables del `env.example`:

```bash
# En el VPS, crea el archivo .env
nano .env
```

Copia el contenido de `env.example` y reemplaza los valores con tus credenciales reales.

## 🚀 Pasos de Despliegue

### 1. Conectarse al VPS vía SSH (Bitvise)

1. Abre Bitvise SSH Client
2. Configura la conexión:
   - **Host**: IP o dominio del VPS
   - **Port**: 22 (o el puerto SSH configurado)
   - **Username**: Tu usuario del VPS
   - **Initial method**: Password o Key
3. Conecta y abre una terminal

### 2. Clonar el Repositorio

```bash
# Navegar al directorio donde quieres el proyecto
cd /opt  # o el directorio que prefieras

# Clonar el repositorio
git clone https://github.com/EduardoGNK/LandingVivoMuebles.git
cd LandingVivoMuebles
```

### 3. Crear el Archivo .env en el Servidor

```bash
# Copiar el ejemplo
cp env.example .env

# Editar con tus valores reales
nano .env
```

**IMPORTANTE**: Asegúrate de actualizar:
- `NEXTAUTH_URL` con la URL de tu dominio (ej: `https://tudominio.com`)
- Todas las credenciales (Google OAuth, HuggingFace, Brevo, etc.)
- Credenciales de MySQL

### 4. Construir y Levantar los Contenedores

```bash
# Construir las imágenes
docker-compose build

# Levantar los servicios
docker-compose up -d
```

### 5. Ejecutar Migraciones de Base de Datos

```bash
# Ejecutar migraciones de Prisma
docker-compose exec app npx prisma migrate deploy

# (Opcional) Ejecutar seed si es necesario
docker-compose exec app npx prisma db seed
```

### 6. Verificar que Todo Funciona

```bash
# Ver logs de los contenedores
docker-compose logs -f

# Verificar que los contenedores están corriendo
docker-compose ps
```

## 🔄 Actualizar la Aplicación

Cuando hagas cambios y los subas a GitHub:

```bash
# En el VPS, dentro del directorio del proyecto
git pull origin main

# Reconstruir y reiniciar
docker-compose down
docker-compose build
docker-compose up -d

# Ejecutar migraciones si hay cambios en la BD
docker-compose exec app npx prisma migrate deploy
```

## 🛡️ Seguridad

### Proteger el Archivo .env

```bash
# Cambiar permisos del archivo .env (solo lectura para el propietario)
chmod 600 .env

# Verificar que .env está en .gitignore
cat .gitignore | grep .env
```

### Firewall

Asegúrate de que solo los puertos necesarios estén abiertos:
- **80** (HTTP)
- **443** (HTTPS)
- **22** (SSH)

```bash
# Ejemplo con ufw (Ubuntu)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📝 Estructura de Archivos en el VPS

```
/opt/LandingVivoMuebles/
├── .env                 # ⚠️ NO se sube a Git, se crea en el servidor
├── docker-compose.yml
├── Dockerfile
├── .gitignore          # Asegura que .env no se suba
└── ... (resto del código)
```

## 🔧 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs detallados
docker-compose logs app
docker-compose logs mysql

# Verificar que el .env existe y tiene valores
cat .env | grep -v "^#" | grep -v "^$"
```

### Error de conexión a la base de datos

- Verifica que MySQL está corriendo: `docker-compose ps mysql`
- Verifica la `DATABASE_URL` en el `.env`
- Verifica que las credenciales de MySQL son correctas

### Error de NextAuth

- Verifica que `NEXTAUTH_URL` apunta a tu dominio real
- Verifica que `NEXTAUTH_SECRET` está configurado
- Verifica las credenciales de Google OAuth

## 📞 Comandos Útiles

```bash
# Detener todos los contenedores
docker-compose down

# Detener y eliminar volúmenes (⚠️ elimina la BD)
docker-compose down -v

# Ver logs en tiempo real
docker-compose logs -f app

# Entrar al contenedor de la app
docker-compose exec app sh

# Reiniciar un servicio específico
docker-compose restart app
```

## ✅ Checklist de Despliegue

- [ ] VPS con Docker instalado
- [ ] Repositorio clonado en el VPS
- [ ] Archivo `.env` creado en el servidor con todas las variables
- [ ] Permisos del `.env` configurados (chmod 600)
- [ ] Contenedores construidos y corriendo
- [ ] Migraciones de base de datos ejecutadas
- [ ] Dominio configurado y apuntando al VPS
- [ ] Certificado SSL configurado (Let's Encrypt recomendado)
- [ ] Firewall configurado
- [ ] Aplicación accesible desde el navegador


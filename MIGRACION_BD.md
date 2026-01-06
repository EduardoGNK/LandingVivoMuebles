# Guía de Migración de Base de Datos Local a VPS

Esta guía explica cómo migrar tus datos de la base de datos local al VPS.

## 📋 Resumen del Proceso

1. **Exportar** la base de datos local → Crea un archivo `.sql.gz`
2. **Transferir** el backup al VPS → Usando SCP o Bitvise SFTP
3. **Importar** la base de datos en el VPS → Restaura todos tus datos

## 🔄 Paso 1: Exportar Base de Datos Local

### Requisitos

- MySQL/MariaDB corriendo localmente
- `mysqldump` instalado (viene con MySQL)
- Archivo `.env.local` con tu `DATABASE_URL` configurada

### Ejecutar Exportación

```bash
# Desde el directorio del proyecto local
./export-database.sh
```

El script:
- ✅ Lee la configuración de `.env.local`
- ✅ Extrae las credenciales de `DATABASE_URL`
- ✅ Exporta toda la base de datos
- ✅ Comprime el backup
- ✅ Crea un archivo: `backup_database_YYYYMMDD_HHMMSS.sql.gz`

### Verificar el Backup

```bash
# Ver el tamaño del archivo
ls -lh backup_*.sql.gz

# Verificar que contiene datos (primeras líneas)
gunzip -c backup_*.sql.gz | head -20
```

## 📤 Paso 2: Transferir Backup al VPS

### Opción A: Usando SCP (desde terminal local)

```bash
# Reemplaza con tus datos
scp backup_database_*.sql.gz usuario@tu-vps-ip:/opt/LandingVivoMuebles/
```

### Opción B: Usando Bitvise SFTP

1. Conecta con Bitvise SSH Client
2. Abre la pestaña **"SFTP"**
3. En el panel izquierdo: navega a donde está tu backup local
4. En el panel derecho: navega a `/opt/LandingVivoMuebles/` (o donde clonaste el repo)
5. Arrastra el archivo `backup_database_*.sql.gz` del panel izquierdo al derecho

### Opción C: Usando WinSCP (Windows)

1. Abre WinSCP
2. Conecta al VPS
3. Navega a la carpeta del proyecto
4. Arrastra el archivo de backup

## 📥 Paso 3: Importar Base de Datos en el VPS

### Requisitos en el VPS

- Docker y Docker Compose instalados
- Contenedores de MySQL corriendo (o MySQL instalado)
- Archivo `.env` configurado con `DATABASE_URL`

### Ejecutar Importación

```bash
# En el VPS, dentro del directorio del proyecto
./import-database.sh backup_database_YYYYMMDD_HHMMSS.sql.gz
```

El script:
- ✅ Verifica que el archivo existe
- ✅ Lee la configuración de `.env`
- ✅ Verifica que MySQL está corriendo
- ✅ **⚠️ Te pedirá confirmación** (reemplazará todos los datos)
- ✅ Descomprime el backup
- ✅ Importa la base de datos
- ✅ Limpia archivos temporales

### Después de Importar

```bash
# Regenerar el cliente de Prisma
docker-compose exec app npx prisma generate

# Verificar que los datos se importaron
docker-compose exec app npx prisma studio
# O conectarte directamente a MySQL
docker-compose exec mysql mysql -u usuario -p nombre_bd
```

## ⚠️ Consideraciones Importantes

### 1. Compatibilidad de Versiones

Asegúrate de que:
- La versión de MySQL/MariaDB en local sea compatible con la del VPS
- El esquema de la base de datos sea el mismo (ejecuta migraciones si es necesario)

### 2. Backup Antes de Importar

Si ya tienes datos en el VPS, haz un backup primero:

```bash
# En el VPS, antes de importar
./export-database.sh  # Si tienes el script en el VPS
# O manualmente:
docker-compose exec mysql mysqldump -u usuario -p nombre_bd > backup_antes_import.sql
```

### 3. Variables de Entorno

Asegúrate de que el `.env` en el VPS tenga:
- `DATABASE_URL` apuntando a MySQL del contenedor: `mysql://user:pass@mysql:3306/database`
- Las mismas credenciales que usaste localmente (o actualízalas después de importar)

### 4. Proyectos y Archivos

Si tus proyectos tienen archivos/imágenes:
- Los archivos en `public/` se clonarán con el repo
- Los archivos subidos por usuarios necesitan migrarse por separado
- Revisa si tienes un directorio `uploads/` que también necesite transferirse

## 🔍 Verificar que la Migración Fue Exitosa

```bash
# En el VPS, verificar cantidad de registros
docker-compose exec mysql mysql -u usuario -p nombre_bd -e "SELECT COUNT(*) FROM Project;"
docker-compose exec mysql mysql -u usuario -p nombre_bd -e "SELECT COUNT(*) FROM Artwork;"

# Ver algunos registros
docker-compose exec mysql mysql -u usuario -p nombre_bd -e "SELECT * FROM Project LIMIT 5;"
```

## 🆘 Troubleshooting

### Error: "Access denied for user"

- Verifica las credenciales en `.env`
- Asegúrate de que el usuario tiene permisos en la base de datos

### Error: "Database doesn't exist"

```bash
# Crear la base de datos primero
docker-compose exec mysql mysql -u root -p -e "CREATE DATABASE nombre_bd;"
```

### Error: "Table already exists"

- El script pregunta antes de importar, pero si hay conflicto:
- Opción 1: Eliminar la base de datos y recrearla
- Opción 2: Importar solo tablas específicas

### El backup es muy grande

Si el backup es muy grande (>100MB):
- Considera comprimirlo más: `gzip -9 backup.sql`
- O transferir usando `rsync` con compresión: `rsync -avz backup.sql.gz usuario@vps:/ruta/`

## 📝 Notas Adicionales

- **Solo necesitas `.env` en el VPS**, no `.env.local`
- El `.env.local` es solo para desarrollo local
- En producción (VPS) usa solo `.env`
- Los archivos `.env` y `.env.local` **NUNCA** se suben a Git (están en `.gitignore`)




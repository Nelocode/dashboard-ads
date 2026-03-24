# Guía de Despliegue: Ads Dashboard (Easypanel + Hostinger)

Esta guía explica cómo desplegar la plataforma utilizando Docker y Easypanel en un servidor de Hostinger.

## 1. Preparación del Repositorio
Asegúrate de que los cambios actuales estén en tu rama principal de GitHub. Easypanel detectará automáticamente el archivo `Dockerfile` en la raíz.

## 2. Configuración en Easypanel
1. **Crear Proyecto**: Desde el panel de Easypanel, crea un nuevo proyecto (ej. `ads-dashboard`).
2. **Crear Servicio**: Selecciona **App** y luego **GitHub**.
3. **Conectar Repositorio**: Elige este repositorio y la rama principal.

## 3. Variables de Entorno (Environment)
En la sección **Environment** de Easypanel, añade las siguientes variables:
- `PORT`: `3001`
- `NODE_ENV`: `production`
- `DATABASE_URL`: `file:./prisma/dev.db`
- `JWT_SECRET`: (Genera una cadena aleatoria fuerte)
- `OPENAI_API_KEY`: (Opcional, si se usa AI)
- `GOOGLE_API_KEY`: (Opcional, si se usa AI)

## 4. Persistencia de Datos (MANDATORIO)
Como usamos SQLite, es vital configurar un **Volume** para que la base de datos no se borre en cada despliegue.
1. Ve a la pestaña **Mounts** o **Volumes** en Easypanel.
2. Añade un nuevo volumen:
   - **Mount Path**: `/app/backend/prisma`
   - **Name**: `prisma-data`

*Nota: Esto asegurará que el archivo `dev.db` persista.*

## 5. Dominios
1. En la pestaña **Domains**, añade el subdominio o dominio que desees usar (ej. `ads.tuempresa.com`).
2. Easypanel gestionará automáticamente el certificado SSL (HTTPS).

## 6. Despliegue
Haz clic en **Deploy**. Easypanel ejecutará el build multi-etapa definido en el `Dockerfile`:
1. Compilará el Frontend con Vite.
2. Compilará el Backend con TypeScript.
3. Levantará la imagen final y servirá la plataforma en el puerto 3001.

---
¡Listo! Tu plataforma estará en línea en unos minutos.

# ==========================================
# Etapa 1: Construcción del Frontend (Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================================
# Etapa 2: Construcción del Backend (Node/TS)
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# ==========================================
# Etapa 3: Imagen Final de Producción
# ==========================================
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias necesarias para Prisma (si se requiere openssl)
RUN apk add --no-cache openssl

# Copiar el backend compilado y sus módulos
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/prisma ./backend/prisma

# Copiar el frontend compilado (dist) para que el backend lo sirva
COPY --from=frontend-builder /app/dist ./dist

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./prisma/dev.db"

EXPOSE 3001

# Ejecutar desde la carpeta del backend
WORKDIR /app/backend
CMD ["npm", "start"]

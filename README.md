# Ads Dashboard Premium 🚀

Plataforma inteligente y de alto rendimiento para la gestión y análisis de campañas publicitarias en Meta y Google Ads. Diseñada para un uso interno robusto, con capacidades de análisis por IA y una interfaz ultra-premium.

## ✨ Características Principales
- **Análisis con IA**: Integración con Ollama (Local) y modelos en la nube para análisis profundo de métricas.
- **Gestión Multi-Empresa**: Administra múltiples cuentas publicitarias y empresas desde un solo panel.
- **User Management CRUD**: Sistema completo de administración de usuarios con roles y permisos dinámicos.
- **Interfaz Premium**: Diseño basado en cristalería, animaciones suaves y soporte para múltiples skins (Modo Noche, Midnight, etc.).
- **Sincronización en Tiempo Real**: Backend en Node.js con base de datos SQLite persistente.

## 🛠️ Stack Tecnológico
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Base de Datos**: SQLite (almacenamiento local persistente).
- **Despliegue**: Docker, Easypanel.

## 🚀 Inicio Rápido

### Desarrollo Local (Frontend + Backend separado)
1. **Instalar dependencias**:
   ```bash
   npm install
   cd backend && npm install
   ```
2. **Configurar Base de Datos**:
   ```bash
   cd backend && npx prisma generate && npx prisma db push
   ```
3. **Ejecutar**:
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm run dev`

### Despliegue con Docker
Para desplegar en producción (Hostinger/Easypanel), consulta la **[Guía de Despliegue (DEPLOYS.md)](./DEPLOYS.md)**.

---
© 2026 Ads Dashboard Project.

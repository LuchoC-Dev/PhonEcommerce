# PhonEcommerce

E-commerce de teléfonos móviles con panel de administración completo.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 |
| Backend | Fastify 5 + TypeScript |
| Base de datos | PostgreSQL + Prisma ORM |
| Auth | JWT (access 15min + refresh con rotación) |
| Estado global | Zustand |
| Formularios | react-hook-form + Zod |

## Funcionalidades

### Sitio principal
- Catálogo con filtros por marca, categoría y precio + búsqueda
- Detalle de producto con galería de imágenes
- Carrito de compras persistente (slide-over + página)
- Checkout en 3 pasos con datos de envío
- Historial de órdenes y detalle por orden
- Cancelación de órdenes (PENDING / CONFIRMED)
- Perfil de usuario con gestión de direcciones

### Panel de administración (`/admin`)
- Gestión de productos (CRUD)
- Gestión de marcas y categorías
- Control de stock con historial de movimientos
- Gestión de órdenes con cambio de estado

## Arquitectura

**Backend** — Clean Architecture por features (bounded contexts):
```
src/<feature>/
├── domain/          ← entidades e interfaces
├── application/     ← use-cases
├── infrastructure/  ← repositorios Prisma
└── presentation/    ← controllers y routes Fastify
```

**Frontend** — Feature-based:
```
src/
├── features/<feature>/   ← components, hooks, services, types
├── shared/               ← reutilizables entre features
└── app/                  ← rutas Next.js (App Router)
```

## Requisitos

- Node.js 20+
- Docker (para PostgreSQL)
- pnpm o npm

## Setup

### Base de datos

```bash
docker run -d \
  --name imnotphound-db \
  -e POSTGRES_USER=imnotphound \
  -e POSTGRES_PASSWORD=imnotphound \
  -e POSTGRES_DB=imnotphound \
  -p 5700:5432 \
  postgres:16
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
DATABASE_URL=postgresql://imnotphound:imnotphound@localhost:5700/imnotphound npx prisma migrate dev
npm run dev
```

El servidor corre en `http://localhost:3001`.
Documentación de la API disponible en `http://localhost:3001/docs`.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

El sitio corre en `http://localhost:3000`.

## Variables de entorno

### Backend (`.env`)
```
DATABASE_URL=postgresql://imnotphound:imnotphound@localhost:5700/imnotphound
JWT_SECRET=your-secret-here
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Documentación

- `docs/api.md` — referencia de endpoints
- `docs/architecture.md` — arquitectura del proyecto
- `docs/decisions/` — decisiones de arquitectura (ADRs)
- `docs/TODO.md` — backlog de mejoras pendientes

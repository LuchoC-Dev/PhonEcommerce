# Backend — ImNotPhound

## Stack
- Fastify 5 + TypeScript (strict)
- Prisma ORM
- PostgreSQL (puerto 5700 en Docker)
- JWT auth (access 15min + refresh con rotación)

## Arquitectura: Clean Architecture por Features

Cada feature es un bounded context independiente:
```
src/
├── <feature>/
│   ├── domain/
│   │   ├── entities/         ← tipos e interfaces del dominio
│   │   └── repositories/     ← contratos (interfaces, nunca implementaciones)
│   ├── application/
│   │   └── use-cases/        ← lógica de negocio, un archivo por use-case
│   ├── infrastructure/
│   │   └── repositories/     ← implementación de contratos con Prisma
│   └── presentation/
│       ├── controllers/      ← maneja request/response, sin lógica de negocio
│       └── routes/           ← define endpoints y schemas de validación
└── shared/
    ├── database/             ← cliente Prisma singleton
    ├── middlewares/          ← auth, error handling
    ├── errors/               ← clases de error personalizadas
    ├── permissions/          ← ROLE_PERMISSIONS, formato resource:action:scope
    └── utils/                ← JwtTokenService, BcryptHashService, etc.
```

## Features implementadas
- `auth` — register, login, refresh token, forgot/reset password ✅
- `users` — profile, addresses ✅
- `products` — CRUD productos, brands, categories (con árbol) ✅

## Features pendientes
- `cart` — carrito de compras
- `orders` — pedidos, checkout, estados
- `reviews` — reseñas de productos
- `admin` — operaciones de administrador

## Reglas de arquitectura
- La dependencia va siempre hacia adentro: `presentation → application → domain`
- `infrastructure` implementa los contratos definidos en `domain/repositories`
- Los use-cases no conocen Fastify ni Prisma directamente
- Los controllers no tienen lógica de negocio
- Sin `any` en TypeScript

## Auth y permisos
- JWT en header `Authorization: Bearer <token>`
- Permisos en formato `resource:action:scope` (ej: `products:create:any`)
- Middleware: `authenticate` (verifica JWT), `requirePermission` (verifica permiso)
- Ambos en `shared/middlewares/auth.middleware.ts`

## Documentación — OBLIGATORIO en cada dominio
- **OpenAPI/Swagger**: schemas completos en las rutas (description, tags, body, params, responses)
  - Disponible en `http://localhost:3001/docs`
- **TSDoc**: interfaces de dominio, use-cases, funciones complejas
- **`/docs/api.md`**: resumen de endpoints
- **`/docs/decisions/`**: ADRs para decisiones importantes

## Variables de entorno
```
DATABASE_URL=postgresql://imnotphound:imnotphound@localhost:5700/imnotphound
JWT_SECRET=...
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

## Endpoints base
- `GET /health` — health check
- `GET /docs` — documentación OpenAPI (Swagger UI)
- Todos los endpoints bajo `/api/v1/`

## Gotchas conocidos
- `prisma generate` falla en Windows si el server está corriendo (DLL locked) — matar el proceso primero
- `tsx` no carga `.env` automáticamente — usar `--env-file=.env` en el script dev
- `prisma migrate dev` no acepta `--env-file` — pasar con `DATABASE_URL=... npx prisma migrate dev`
- Vitest necesita `fileParallelism: false` para tests de integración con DB compartida

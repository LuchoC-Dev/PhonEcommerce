# Backend — ImNotPhound

## Stack
- Fastify 5 + TypeScript (strict)
- Prisma ORM
- PostgreSQL
- JWT auth

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
    └── utils/                ← utilidades generales
```

## Features disponibles
- `products` — CRUD de productos, catálogo
- `users` — perfil, datos personales
- `auth` — login, register, JWT
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

## Variables de entorno
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
PORT=3001
```

## Endpoints base
- `GET /health` — health check
- Todos los endpoints de la API bajo `/api/v1/`

## Auth
- JWT en header `Authorization: Bearer <token>`
- Roles: `user` | `admin`

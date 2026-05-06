# Arquitectura — ImNotPhound

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15 + TypeScript |
| Backend | Fastify 5 + TypeScript |
| Base de datos | PostgreSQL + Prisma |
| Auth | JWT (access 15min + refresh con rotación) |
| Pagos | Simulados (escalable a Stripe/MercadoPago) |
| Imágenes | Local (escalable a S3/Cloudinary) |

## Estructura del proyecto

```
/
├── frontend/     ← Next.js, feature-based architecture
├── backend/      ← Fastify, Clean Architecture por features
├── docs/         ← documentación del proyecto
└── .agents/      ← skills, workflows y agentes (multi-IA)
```

## Backend — Clean Architecture por Features

Cada dominio es un bounded context independiente con sus propias capas:

```
domain → application → infrastructure
                     ↑
              presentation
```

- **domain**: entidades e interfaces (sin dependencias externas)
- **application**: use-cases con lógica de negocio
- **infrastructure**: implementaciones concretas (Prisma, servicios externos)
- **presentation**: controllers y routes (Fastify)

## Frontend — Feature-based Architecture

```
src/
├── features/<feature>/   ← componentes, hooks, services, types
├── shared/               ← reutilizables entre features
└── app/                  ← rutas Next.js (App Router)
```

## Dominios del backend

| Dominio | Descripción | Estado |
|---|---|---|
| `auth` | Login, register, JWT, recuperación de contraseña | ✅ |
| `users` | Perfil, direcciones | ✅ |
| `products` | Catálogo, brands, categories | ✅ |
| `cart` | Carrito de compras | 🔲 |
| `orders` | Pedidos, checkout, estados | 🔲 |
| `reviews` | Reseñas y calificaciones | 🔲 |
| `admin` | Panel de administración | 🔲 |

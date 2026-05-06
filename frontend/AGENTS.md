# Frontend — ImNotPhound

## Stack
- Next.js 15 + TypeScript (strict)
- App Router
- React 19

## Arquitectura: Feature-based
```
src/
├── features/
│   ├── catalog/       ← listado de teléfonos, filtros, búsqueda
│   ├── product/       ← detalle del producto, reseñas
│   ├── auth/          ← login, register, recuperar contraseña
│   ├── cart/          ← carrito de compras
│   ├── orders/        ← checkout, historial, estado de pedidos
│   ├── reviews/       ← reseñas y calificaciones
│   └── admin/         ← panel de administración (solo admins)
├── shared/
│   ├── components/    ← componentes reutilizables
│   ├── hooks/         ← hooks reutilizables
│   ├── utils/         ← utilidades
│   └── types/         ← tipos globales compartidos
└── app/               ← rutas de Next.js (App Router)
```

## Estructura interna de cada feature
```
features/<feature>/
├── components/    ← componentes específicos de la feature
├── hooks/         ← hooks específicos
├── services/      ← llamadas a la API del backend
├── types/         ← tipos TypeScript de la feature
└── index.ts       ← barrel export
```

## Reglas
- TypeScript estricto — sin `any`
- Componentes reutilizables en `shared/`, no dentro de features
- No importar entre features directamente — usar `shared/`
- Llamadas a la API solo en `services/` de cada feature
- Variables de entorno en `.env.local`

## Variables de entorno
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Conexión con el backend
- Base URL: `NEXT_PUBLIC_API_URL`
- Auth: JWT en header `Authorization: Bearer <token>`

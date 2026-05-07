# Frontend — ImNotPhound

## Stack
- Next.js 16 + TypeScript (strict)
- App Router
- React 19
- Tailwind CSS 4
- Axios (cliente HTTP)

## Arquitectura: Feature-based
```
src/
├── features/
│   ├── catalog/       ← listado de teléfonos, filtros, búsqueda
│   ├── product/       ← detalle del producto
│   ├── auth/          ← login, register, recuperar contraseña
│   ├── cart/          ← carrito de compras
│   ├── orders/        ← checkout, historial, estado de pedidos
│   └── admin/         ← panel de administración (solo admins)
├── shared/
│   ├── components/    ← componentes reutilizables
│   ├── hooks/         ← hooks reutilizables
│   ├── lib/
│   │   └── api.ts     ← cliente Axios configurado
│   └── types/         ← tipos globales compartidos
└── app/               ← rutas de Next.js (App Router)
```

## Estructura interna de cada feature
```
features/<feature>/
├── components/    ← componentes específicos de la feature
├── hooks/         ← hooks específicos
├── services/      ← llamadas a la API (usan shared/lib/api.ts)
├── types/         ← tipos TypeScript de la feature
└── index.ts       ← barrel export
```

## Cliente HTTP
- `src/shared/lib/api.ts` — instancia Axios con baseURL y JWT interceptor
- El token se lee de `localStorage.getItem('accessToken')`
- Importar como: `import api from '@shared/lib/api'`

## Reglas
- TypeScript estricto — sin `any`
- Componentes reutilizables en `shared/`, no dentro de features
- No importar entre features directamente — usar `shared/`
- Llamadas a la API solo en `services/` de cada feature
- Tailwind para estilos — sin CSS modules ni styled-components

## Variables de entorno
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Conexión con el backend
- Base URL: `NEXT_PUBLIC_API_URL`
- Auth: JWT en header `Authorization: Bearer <token>`
- Ver `/docs/api.md` para los endpoints disponibles

## Gotchas conocidos
- `.env.local` no se commitea — usar `.env.example` como referencia
- Path aliases `@features/*` y `@shared/*` configurados en tsconfig.json

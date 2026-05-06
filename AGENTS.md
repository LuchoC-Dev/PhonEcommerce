# ImNotPhound — Proyecto Global

## Descripción
E-commerce de teléfonos móviles. Permite a usuarios explorar, filtrar y comprar teléfonos. Incluye panel de administración.

## Estructura del proyecto
```
/
├── frontend/     ← Next.js (cliente web)
├── backend/      ← Fastify (API REST)
└── .agents/      ← skills, workflows y agentes
```

## Stack tecnológico
| Capa | Tecnología |
|---|---|
| Frontend | Next.js + TypeScript |
| Backend | Fastify + TypeScript |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (escalable a OAuth) |
| Pagos | Simulados (por ahora) |
| Imágenes | Local (por ahora) |

## Dominios / Features
- `products` — catálogo, detalle, filtros, búsqueda
- `users` — perfil, datos personales
- `auth` — login, register, recuperar contraseña
- `cart` — carrito de compras
- `orders` — checkout, historial, estado de pedidos
- `reviews` — reseñas y calificaciones
- `admin` — panel de administración (solo admins)

## Convenciones generales
- Lenguaje: TypeScript estricto en frontend y backend
- Commits: usar `/git-commit` skill al finalizar cada tarea
- Memoria: guardar engram al finalizar cada tarea con todo lo hecho, decisiones y consideraciones
- No mezclar responsabilidades entre dominios
- Cada agente trabaja en su feature/dominio asignado

## Flujo de trabajo con agentes
1. El agente principal (coordinador) asigna tareas y arma prompts
2. El usuario abre un subagente con ese prompt
3. El subagente trabaja directamente con el usuario
4. Al terminar: el subagente hace commit con `/git-commit` y guarda engram
5. El agente principal lee el engram para conocer el resultado

## Archivos de contexto por carpeta
- `/AGENTS.md` — contexto global (este archivo)
- `/frontend/AGENTS.md` — contexto específico del frontend
- `/backend/AGENTS.md` — contexto específico del backend

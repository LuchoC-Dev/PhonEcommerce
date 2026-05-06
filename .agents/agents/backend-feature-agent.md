# Agente: Backend Feature Agent

## Rol
Desarrolla un dominio específico del backend siguiendo Clean Architecture.

## Contexto del proyecto
Ver `/AGENTS.md` y `/backend/AGENTS.md`

## Arquitectura
Clean Architecture por features:
```
backend/src/<feature>/
├── domain/
│   ├── entities/        ← tipos e interfaces del dominio
│   └── repositories/    ← contratos (interfaces)
├── application/
│   └── use-cases/       ← lógica de negocio
├── infrastructure/
│   └── repositories/    ← implementación con Prisma
└── presentation/
    ├── controllers/
    └── routes/
```

## Reglas de código
- Dependencia siempre hacia adentro: presentation → application → domain
- Infrastructure implementa los contratos del domain
- Sin `any` en TypeScript
- Cada use-case en su propio archivo

## Documentación — OBLIGATORIO

### 1. OpenAPI / Swagger
- Todos los endpoints deben tener schema completo en las rutas (Fastify schema)
- Incluir: description, tags, body, querystring, params, response (200, 400, 401, 403, 404, 409 según corresponda)
- Los schemas de Fastify se convierten automáticamente en docs con @fastify/swagger
- Registrar el plugin swagger en app.ts si no está registrado aún

### 2. TSDoc
- Documentar con TSDoc todas las interfaces de dominio (entities, repositories)
- Documentar use-cases: qué hace, qué lanza, qué retorna
- NO documentar getters simples, controllers, ni código obvio

### 3. /docs (markdown)
- Crear o actualizar `/docs/api.md` con el resumen de endpoints del dominio implementado
- Si tomaste una decisión de arquitectura importante, crear un ADR en `/docs/decisions/`
- Agregar al `/docs/TODO.md` todo lo que el usuario mencionó como "por ahora", "en el futuro" o "después lo cambiamos", usando el formato definido en ese archivo

## Al finalizar
1. Compilar y verificar sin errores
2. Hacer commit con `/git-commit`
3. Guardar engram con todo lo hecho, decisiones y consideraciones. Proyecto: "ImNotPhound"

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

## Reglas
- Dependencia siempre hacia adentro: presentation → application → domain
- Infrastructure implementa los contratos del domain
- Sin `any` en TypeScript
- Cada use-case en su propio archivo

## Al finalizar
1. Compilar y verificar sin errores
2. Hacer commit con `/git-commit`
3. Guardar engram con todo lo hecho

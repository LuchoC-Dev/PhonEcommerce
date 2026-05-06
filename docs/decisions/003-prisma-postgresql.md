# ADR 003 — PostgreSQL + Prisma como base de datos y ORM

**Fecha**: 2026-05-06
**Estado**: Aceptado

## Contexto
E-commerce con datos relacionales (usuarios, órdenes, productos). Necesita transacciones ACID confiables.

## Decisión
PostgreSQL como base de datos y Prisma como ORM. Docker Compose para desarrollo local en puerto 5700.

## Consecuencias
- ✅ ACID transactions — crítico para órdenes y pagos
- ✅ Prisma genera tipos TypeScript automáticamente
- ✅ Migraciones versionadas con Prisma Migrate
- ✅ Puerto 5700 evita conflictos con instalaciones locales de PostgreSQL (5432)

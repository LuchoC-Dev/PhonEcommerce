# ADR 001 — Clean Architecture por Features en el backend

**Fecha**: 2026-05-06
**Estado**: Aceptado

## Contexto
El backend necesita ser mantenible y escalable. Hay múltiples dominios independientes (auth, products, cart, orders, etc.).

## Decisión
Usar Clean Architecture organizada por features (bounded contexts). Cada feature tiene sus propias capas: domain, application, infrastructure, presentation.

## Consecuencias
- ✅ Cada dominio es independiente y fácil de testear
- ✅ La lógica de negocio no depende de Fastify ni Prisma
- ✅ Fácil agregar nuevos dominios sin tocar los existentes
- ⚠️ Más archivos y carpetas que una arquitectura MVC simple

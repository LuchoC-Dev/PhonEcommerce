# ADR 002 — JWT con refresh tokens y permisos en payload

**Fecha**: 2026-05-06
**Estado**: Aceptado

## Contexto
El sistema necesita autenticación stateless escalable a OAuth en el futuro.

## Decisión
- Access token: 15 minutos, contiene permisos en formato `resource:action:scope`
- Refresh token: rotación en cada uso, almacenado en DB
- Permisos definidos por rol en `shared/permissions/permission.types.ts`

## Consecuencias
- ✅ Stateless, escalable horizontalmente
- ✅ Permisos granulares sin consultar DB en cada request
- ✅ Escalable a OAuth (Google, etc.)
- ⚠️ Refresh tokens en DB requieren limpieza periódica de tokens expirados

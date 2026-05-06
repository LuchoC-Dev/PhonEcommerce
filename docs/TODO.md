# TODO — ImNotPhound

Archivo gestionado por el agente de TODO.
Cada item representa algo que se decidió dejar para más adelante durante el desarrollo.

## Formato de cada item

```
## [dominio] - título corto
**Descripción**: qué hay que hacer
**Contexto**: por qué se dejó para después
**Prioridad**: alta / media / baja
**Agregado por**: <agente> - <fecha>
```

---

## [products] - Migrar imágenes a almacenamiento externo
**Descripción**: Reemplazar almacenamiento local de imágenes por S3 o Cloudinary
**Contexto**: Por ahora las imágenes se guardan localmente, suficiente para desarrollo
**Prioridad**: media
**Agregado por**: agente-principal - 2026-05-06

## [stock] - Alertas de stock bajo
**Descripción**: Implementar sistema de alertas cuando el stock de un producto cae por debajo de un umbral configurable (ej: `lowStock: true` en respuesta, webhooks o notificaciones)
**Contexto**: Se decidió no implementar en esta iteración para no bloquear el desarrollo
**Prioridad**: baja
**Agregado por**: agente-backend-stock - 2026-05-06

## [stock] - Reserva de stock al agregar al carrito
**Descripción**: Evaluar ventajas y desventajas de reservar stock al agregar al carrito vs. solo al confirmar la orden. Actualmente se valida solo en la creación de orden.
**Contexto**: Reservar en carrito previene overselling pero complica el flujo (TTL de reservas, liberación si el carrito expira). Se dejó para analizar con más contexto de negocio.
**Prioridad**: media
**Agregado por**: agente-backend-stock - 2026-05-06

## [orders] - Integrar pasarela de pagos real
**Descripción**: Reemplazar pagos simulados por Stripe o MercadoPago
**Contexto**: Los pagos son simulados por ahora para no bloquear el desarrollo
**Prioridad**: alta
**Agregado por**: agente-principal - 2026-05-06

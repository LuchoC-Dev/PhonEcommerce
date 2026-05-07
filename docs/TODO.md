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

## [orders] - Restaurar stock al cancelar una orden
**Descripción**: Al cancelar una orden, registrar un movimiento de tipo `RETURN` para devolver el stock a los productos. Actualmente el stock se descuenta al crear la orden pero no se restaura al cancelar.
**Contexto**: Requiere definir el flujo de negocio: ¿siempre se restaura, o depende del estado? (ej: si ya fue SHIPPED el stock físico puede no estar disponible). Se dejó para decidir con más contexto.
**Prioridad**: alta
**Agregado por**: agente-backend-orders - 2026-05-06

## [orders] - Notificaciones de cambio de estado
**Descripción**: Enviar emails o notificaciones push al usuario cuando cambia el estado de su orden (ej: "Tu pedido fue enviado")
**Contexto**: Requiere integrar un servicio de emails (Resend, SendGrid, etc.). No implementado en esta iteración.
**Prioridad**: media
**Agregado por**: agente-backend-orders - 2026-05-06

## [orders] - Paginación y filtros en GET /orders para admins
**Descripción**: Agregar filtros por `status`, `accountId`, rango de fechas y búsqueda al endpoint de listado de órdenes para admins.
**Contexto**: El listado básico está implementado. Los filtros son necesarios para el panel de administración.
**Prioridad**: media
**Agregado por**: agente-backend-orders - 2026-05-06

## [admin] - Endpoints de métricas para el panel de administración
**Descripción**: Crear endpoints en `/api/v1/admin/metrics` con datos para el dashboard: ventas totales, órdenes por estado, productos más vendidos, usuarios registrados.
**Contexto**: Se deja para cuando se implemente el frontend del panel admin, para saber exactamente qué datos necesita mostrar.
**Prioridad**: baja
**Agregado por**: agente-principal - 2026-05-07

## [reviews] - Implementar dominio de reseñas y calificaciones
**Descripción**: Crear el dominio `reviews` completo con Clean Architecture. Permitir a usuarios que compraron un producto dejar calificación (1-5) y comentario. Mostrar rating promedio y cantidad de reseñas en el detalle del producto.
**Contexto**: Se decidió dejar para más adelante para no bloquear el desarrollo del resto del backend.
**Prioridad**: media
**Agregado por**: agente-principal - 2026-05-07

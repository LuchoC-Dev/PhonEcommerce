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

## [design] - Navbar con lógica de autenticación
**Descripción**: Actualizar Navbar para mostrar avatar/nombre del usuario cuando está logueado, y esconder los botones de auth. Usar el contexto de auth cuando esté implementado.
**Contexto**: El Navbar base está implementado como estático. La lógica de auth se agregará cuando se implemente el dominio auth en el frontend.
**Prioridad**: alta
**Agregado por**: agente-ui-ux - 2026-05-07

## [design] - Animaciones y transiciones de página
**Descripción**: Agregar transiciones entre rutas (page transitions), animaciones de entrada para cards del catálogo (stagger), y micro-interacciones en el carrito.
**Contexto**: Se priorizó tener los componentes base funcionales. Las animaciones mejorarían la experiencia pero no son bloqueantes.
**Prioridad**: baja
**Agregado por**: agente-ui-ux - 2026-05-07

## [design] - Dark/Light mode toggle
**Descripción**: Agregar soporte para modo claro con toggle en la Navbar. Actualmente el diseño es 100% dark.
**Contexto**: Se decidió arrancar solo dark mode para no complicar el sistema de tokens. Se puede agregar después con CSS custom properties.
**Prioridad**: baja
**Agregado por**: agente-ui-ux - 2026-05-07

## [auth] - Mover tokens a httpOnly cookies
**Descripción**: Migrar el almacenamiento de `accessToken` y `refreshToken` de `localStorage` a cookies `httpOnly` para eliminar la vulnerabilidad XSS. Requiere un endpoint `/auth/set-cookie` en el backend o usar un BFF (Backend for Frontend).
**Contexto**: Se usó localStorage para simplificar el MVP. Es suficiente para desarrollo pero no recomendado en producción.
**Prioridad**: alta
**Agregado por**: agente-frontend-auth - 2026-05-07

## [auth] - Navbar con estado de autenticación
**Descripción**: Actualizar el Navbar para mostrar el nombre/avatar del usuario cuando está logueado y un botón de logout. Actualmente tiene botones estáticos de "Iniciar sesión" y "Registrarse".
**Contexto**: El Navbar fue diseñado antes del sistema de auth. Depende de `useCurrentUser`.
**Prioridad**: alta
**Agregado por**: agente-frontend-auth - 2026-05-07

## [auth] - Redirigir a la página original tras login
**Descripción**: Cuando el usuario es redirigido a /login por una ruta protegida, guardar la URL original en query param (`?redirect=/orders`) y redirigir allí tras el login exitoso.
**Contexto**: El HOC `withAuth` actualmente redirige siempre a /login sin guardar el destino.
**Prioridad**: media
**Agregado por**: agente-frontend-auth - 2026-05-07

## [catalog] - Filtro de precio en sidebar con rangos predefinidos
**Descripción**: Agregar opciones rápidas de precio (ej: "Hasta $500", "$500-$1000", "Más de $1000") además de los inputs libres. Mejoraría la UX del filtrado.
**Contexto**: Se implementaron inputs libres de min/max. Los rangos predefinidos son UX plus para después.
**Prioridad**: baja
**Agregado por**: agente-frontend-catalog - 2026-05-07

## [catalog] - Filtros visibles en mobile (drawer/modal)
**Descripción**: En mobile el sidebar de filtros está oculto. Agregar botón "Filtros" que abra un drawer o modal con los filtros disponibles.
**Contexto**: El sidebar usa `hidden lg:block`, no hay UI de filtros en mobile.
**Prioridad**: alta
**Agregado por**: agente-frontend-catalog - 2026-05-07

## [catalog] - Sincronizar filtros con URL (query params)
**Descripción**: Persistir los filtros activos en la URL (`?brand=apple&page=2`) para que el usuario pueda compartir o volver con el mismo estado.
**Contexto**: Los filtros son state local por ahora. Usar `useSearchParams` de Next.js para sincronizar.
**Prioridad**: media
**Agregado por**: agente-frontend-catalog - 2026-05-07

## [catalog] - Skeleton loading para ProductGrid
**Descripción**: Reemplazar el spinner de carga por skeleton cards que mantengan el layout y eviten el layout shift.
**Contexto**: Se usa un spinner centralizado por simplicidad. Los skeletons mejoran la percepción de velocidad.
**Prioridad**: baja
**Agregado por**: agente-frontend-catalog - 2026-05-07

## [product] - Productos relacionados en el detalle
**Descripción**: Agregar sección al final del detalle del producto con productos de la misma marca o categoría. Requiere endpoint GET /products con filtros de brandId o categoryId.
**Contexto**: Se decidió no incluir en esta iteración para no sobrecomplicar la vista.
**Prioridad**: baja
**Agregado por**: agente-frontend-product - 2026-05-07

## [product] - Especificaciones técnicas como campo estructurado
**Descripción**: El backend actualmente no expone specs técnicas estructuradas (RAM, almacenamiento, cámara, etc.). Para mostrarlas en el detalle hay que agregar un campo `specs` en el modelo Product.
**Contexto**: La tabla ProductSpecs muestra datos básicos (marca, categoría, SKU). Los specs técnicos reales requieren cambio en el backend.
**Prioridad**: media
**Agregado por**: agente-frontend-product - 2026-05-07

## [product] - Toast de confirmación al agregar al carrito
**Descripción**: Agregar un Toast global que aparezca al agregar un producto al carrito, con link directo para ir al carrito.
**Contexto**: Actualmente el feedback es solo visual en el botón (estado "Agregado"). Un toast mejoraría la UX sin requerir navegación.
**Prioridad**: media
**Agregado por**: agente-frontend-product - 2026-05-07

## [cart] - Página /checkout
**Descripción**: Implementar la página de checkout (`/checkout`) con formulario de datos de entrega y resumen del pedido. Actualmente el botón "Ir al checkout" navega a `/checkout` pero la página no existe.
**Contexto**: El cart feature fue implementado. El checkout fue dejado para la siguiente iteración ya que implica integración con pagos.
**Prioridad**: alta
**Agregado por**: agente-frontend-cart - 2026-05-07

## [cart] - Adaptar tipos si el backend retorna forma diferente
**Descripción**: El cart service asume que `POST /api/v1/cart/items`, `PUT /api/v1/cart/items/:id` y `DELETE /api/v1/cart/items/:id` retornan `{ items: CartItem[] }` (el carrito completo). Si el backend retorna solo el ítem, hay que agregar una llamada a `GET /api/v1/cart` después de cada mutación, o actualizar el tipo en `cart.service.ts`.
**Contexto**: Se asumió respuesta completa por diseño REST estándar. Si falla, revisar `src/features/cart/services/cart.service.ts`.
**Prioridad**: alta
**Agregado por**: agente-frontend-cart - 2026-05-07

## [cart] - Toast al agregar producto al carrito
**Descripción**: El slide-over se abre automáticamente al agregar, pero sería mejor mostrar un toast discreto y no interrumpir al usuario. Evaluar si el slide-over auto-open es la mejor UX o si preferir un toast.
**Contexto**: Se eligió abrir el slide-over desde `useAddToCart` al agregar un producto. El comportamiento puede cambiarse fácilmente en `src/features/product/hooks/useAddToCart.ts`.
**Prioridad**: baja
**Agregado por**: agente-frontend-cart - 2026-05-07

## [cart] - Manejo de carrito expirado (TTL 7 días)
**Descripción**: El backend tiene TTL de 7 días en el carrito. Si el carrito expira, el GET /cart puede retornar 404 o carrito vacío. Agregar manejo explícito en `cart.store.ts → sync()` para mostrar un mensaje al usuario si el carrito expiró.
**Contexto**: Actualmente el error de sync se ignora silenciosamente. Un carrito expirado podría confundir al usuario si ve el badge con ítems pero el carrito está vacío.
**Prioridad**: media
**Agregado por**: agente-frontend-cart - 2026-05-07

## [reviews] - Implementar dominio de reseñas y calificaciones
**Descripción**: Crear el dominio `reviews` completo con Clean Architecture. Permitir a usuarios que compraron un producto dejar calificación (1-5) y comentario. Mostrar rating promedio y cantidad de reseñas en el detalle del producto.
**Contexto**: Se decidió dejar para más adelante para no bloquear el desarrollo del resto del backend.
**Prioridad**: media
**Agregado por**: agente-principal - 2026-05-07

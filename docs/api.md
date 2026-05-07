# API Reference — ImNotPhound

Base URL: `http://localhost:3001/api/v1`
Documentación interactiva: `http://localhost:3001/docs`

## Auth

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrar usuario | — |
| POST | `/auth/login` | Iniciar sesión | — |
| POST | `/auth/refresh` | Renovar access token | — |
| GET | `/auth/me` | Perfil del usuario autenticado | JWT |
| POST | `/auth/forgot-password` | Solicitar recuperación de contraseña | — |
| POST | `/auth/reset-password` | Resetear contraseña con token | — |

## Users

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| PUT | `/users/profile` | Actualizar perfil | JWT |
| POST | `/users/addresses` | Agregar dirección | JWT |
| PUT | `/users/addresses/:id` | Actualizar dirección | JWT |
| DELETE | `/users/addresses/:id` | Eliminar dirección | JWT |

## Products

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/products` | Listado con filtros y paginación | — |
| GET | `/products/:slug` | Detalle de producto | — |
| POST | `/products` | Crear producto | Admin |
| PUT | `/products/:id` | Editar producto | Admin |
| DELETE | `/products/:id` | Eliminar producto | Admin |

### Filtros disponibles en GET /products
- `brandId`, `categoryId`, `minPrice`, `maxPrice`, `status`, `search`, `page`, `pageSize`

## Brands

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/brands` | Listado de marcas | — |
| POST | `/brands` | Crear marca | Admin |
| PUT | `/brands/:id` | Editar marca | Admin |
| DELETE | `/brands/:id` | Eliminar marca | Admin |

## Categories

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/categories` | Árbol de categorías | — |
| POST | `/categories` | Crear categoría | Admin |
| PUT | `/categories/:id` | Editar categoría | Admin |
| DELETE | `/categories/:id` | Eliminar categoría | Admin |

## Cart

Todos los endpoints del carrito requieren JWT. Cada usuario tiene un único carrito activo (TTL: 7 días).

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/cart` | Obtener carrito con ítems y precios actuales | JWT |
| POST | `/cart/items` | Agregar producto al carrito (suma cantidad si ya existe) | JWT |
| PUT | `/cart/items/:productId` | Actualizar cantidad de un ítem | JWT |
| DELETE | `/cart/items/:productId` | Eliminar un ítem del carrito | JWT |
| DELETE | `/cart` | Vaciar el carrito (conserva el carrito) | JWT |

### Notas del carrito
- `priceAtAdd`: precio capturado al momento de agregar el ítem.
- `currentPrice`: precio actual del producto, actualizado en cada consulta.
- Si el carrito expira (7 días de inactividad), sus ítems se limpian al siguiente acceso.
- Validación de stock: pendiente (se validará al crear la orden, no al agregar al carrito).

## Stock

Todos los endpoints de stock son exclusivos de admins (`stock:read:any` / `stock:manage:any`).
El stock del producto se actualiza atómicamente junto con el registro del movimiento.

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/stock/:productId` | Stock actual de un producto | Admin |
| POST | `/stock/:productId/adjust` | Ajuste manual de stock (RESTOCK o ADJUSTMENT) | Admin |
| GET | `/stock/:productId/movements` | Historial paginado de movimientos | Admin |

### Tipos de movimiento
- `RESTOCK` — entrada de stock (admin)
- `SALE` — salida por venta (generada por el dominio `orders`, no expuesta directamente)
- `ADJUSTMENT` — corrección manual (admin)
- `RETURN` — devolución (generada internamente)

### Body de POST /stock/:productId/adjust
```json
{
  "delta": 10,
  "type": "RESTOCK",
  "reason": "Compra a proveedor - Factura #1234"
}
```
`delta` positivo = agregar stock, negativo = quitar stock.

## Orders

Todos los endpoints de órdenes requieren JWT. Los usuarios solo ven y gestionan sus propias órdenes; los admins tienen acceso a todas.

### Checkout desde el carrito (flujo principal)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/orders/checkout/preview` | Vista previa del checkout (precios actuales, sin escribir en DB) | JWT (user) |
| POST | `/orders/checkout/confirm` | Confirma la orden desde el carrito, descuenta stock y vacía el carrito | JWT (user) |

### Compra rápida (producto individual)

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/orders/quick-buy/preview` | Vista previa de compra rápida de un producto | JWT (user) |
| POST | `/orders/quick-buy/confirm` | Confirma compra rápida, descuenta stock | JWT (user) |

### Gestión de órdenes

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/orders` | Listar órdenes (propias para users, todas para admins) | JWT |
| GET | `/orders/:id` | Detalle de una orden con ítems e historial de estados | JWT |
| PATCH | `/orders/:id/cancel` | Cancelar orden (users: solo PENDING/CONFIRMED; admins: cualquier estado no terminal) | JWT |
| PATCH | `/orders/:id/status` | Cambiar estado de la orden (solo admin) | JWT (admin) |

### Estados de una orden

`PENDING → CONFIRMED → SHIPPED → DELIVERED`

Desde cualquier estado no terminal se puede ir a `CANCELLED`.

### Notas

- **Precios**: se captura el precio actual del producto al momento del checkout (no `priceAtAdd` del carrito).
- **Atomicidad**: la creación de la orden, el descuento de stock y la limpieza del carrito ocurren en una única transacción.
- **Historial**: cada cambio de estado se registra en `OrderStatusHistory` (quién lo cambió, cuándo, de qué a qué estado).

### Body de POST /orders/checkout/preview y /checkout/confirm

```json
{
  "shipping": {
    "name": "John Doe",
    "phone": "+54 11 1234-5678",
    "address": "Av. Corrientes 1234",
    "city": "Buenos Aires",
    "state": "CABA",
    "country": "AR",
    "zipCode": "1043"
  }
}
```

### Body de POST /orders/quick-buy/preview y /quick-buy/confirm

```json
{
  "productId": "cld...",
  "quantity": 1,
  "shipping": { ... }
}
```

### Body de PATCH /orders/:id/status

```json
{
  "status": "CONFIRMED",
  "note": "Pago verificado manualmente"
}
```

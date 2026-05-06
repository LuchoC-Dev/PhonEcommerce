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

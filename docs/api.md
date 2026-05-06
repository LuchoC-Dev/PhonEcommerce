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

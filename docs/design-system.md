# Sistema de Diseño — ImNotPhound

## Identidad visual

**Estilo:** Dark & Premium — fondo oscuro, acentos índigo, estética tech sofisticada.

---

## Paleta de colores

### Fondos y superficies
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-bg` | `#0a0a0a` | Fondo principal de la app |
| `--color-surface` | `#111827` | Navbar, footer, superficies secundarias |
| `--color-card` | `#1a1a2e` | Cards, inputs, modales |
| `--color-border` | `#2d3748` | Bordes generales |
| `--color-border-subtle` | `#1e293b` | Bordes sutiles / divisores |

### Acento primario — Índigo
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#6366f1` | Botones, links activos, foco |
| `--color-primary-hover` | `#4f46e5` | Hover de elementos primarios |
| `--color-primary-light` | `#818cf8` | Texto sobre fondo oscuro |
| `--color-primary-muted` | `#312e81` | Fondos de badges primarios |

### Texto
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-text` | `#f0f0f0` | Texto principal |
| `--color-text-muted` | `#94a3b8` | Texto secundario, labels |
| `--color-text-subtle` | `#64748b` | Texto terciario, placeholders |

### Estados
| Token | Valor | Uso |
|-------|-------|-----|
| `--color-success` | `#22c55e` | Éxito, confirmación |
| `--color-warning` | `#f59e0b` | Advertencia |
| `--color-danger` | `#ef4444` | Error, acción destructiva |
| `--color-info` | `#06b6d4` | Información |

---

## Tipografía

| Rol | Fuente | Pesos | Uso |
|-----|--------|-------|-----|
| Display | **Space Grotesk** | 400, 500, 600, 700 | H1–H6, logos, CTAs |
| Body | **DM Sans** | 400, 500, 600 | Párrafos, labels, UI |
| Mono | JetBrains Mono (sistema) | 400 | Código, precios formateados |

```css
font-family: var(--font-display);  /* Space Grotesk */
font-family: var(--font-body);     /* DM Sans */
```

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | `0.375rem` | Botones pequeños, badges |
| `--radius-md` | `0.5rem` | Botones, inputs |
| `--radius-lg` | `0.75rem` | Cards pequeñas, toasts |
| `--radius-xl` | `1rem` | Cards principales |
| `--radius-2xl` | `1.5rem` | Modales |
| `--radius-full` | `9999px` | Pills, avatares |

---

## Shadows

| Token | Uso |
|-------|-----|
| `--shadow-sm` | Cards, botones |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Modales, toasts |
| `--shadow-glow` | Hover de elementos primarios (glow índigo) |

---

## Componentes

### Button
```tsx
<Button variant="primary" size="md">Comprar</Button>
<Button variant="secondary">Ver más</Button>
<Button variant="ghost">Cancelar</Button>
<Button variant="danger">Eliminar</Button>
<Button loading>Procesando...</Button>
```
**Variantes:** `primary` | `secondary` | `ghost` | `danger`  
**Tamaños:** `sm` (h-8) | `md` (h-10) | `lg` (h-12)

### Input / Textarea / Select
```tsx
<Input label="Email" placeholder="tu@email.com" error="Campo requerido" />
<Textarea label="Comentario" hint="Máximo 500 caracteres" />
<Select label="Marca" placeholder="Seleccioná...">
  <option value="apple">Apple</option>
</Select>
```

### Card
```tsx
<Card hoverable>
  <CardHeader>
    <CardTitle>iPhone 16 Pro</CardTitle>
    <CardDescription>El más avanzado de Apple</CardDescription>
  </CardHeader>
  contenido...
  <CardFooter>pie de card</CardFooter>
</Card>
```

### Badge
```tsx
<Badge variant="primary">Nuevo</Badge>
<Badge variant="success">En stock</Badge>
<Badge variant="warning">Pocas unidades</Badge>
<Badge variant="danger">Sin stock</Badge>
<Badge variant="info">Oferta</Badge>
```

### Spinner
```tsx
<Spinner size="sm" />
<Spinner size="md" label="Cargando productos..." />
<PageSpinner />   {/* Centra el spinner en la página */}
```

### Modal
```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Confirmar compra" size="md">
  contenido...
</Modal>
```

### Toast
```tsx
// Envolver la app con ToastProvider, luego:
const { toast } = useToast();
toast("Producto agregado al carrito", "success");
toast("Error al procesar pago", "error");
```

### Navbar
Base estática con logo, links de catálogo/ofertas y botones de auth.  
**Pendiente:** lógica de auth (mostrar usuario/avatar cuando esté logueado).

### Footer
Cuatro columnas: brand + descripción, Tienda, Soporte, links legales.

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `src/app/globals.css` | Tokens de diseño en `@theme` (Tailwind v4) |
| `src/app/layout.tsx` | Layout raíz con Navbar y Footer |
| `src/shared/components/` | Todos los componentes base |
| `src/shared/components/index.ts` | Barrel export |

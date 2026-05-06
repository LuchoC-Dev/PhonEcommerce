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

## [orders] - Integrar pasarela de pagos real
**Descripción**: Reemplazar pagos simulados por Stripe o MercadoPago
**Contexto**: Los pagos son simulados por ahora para no bloquear el desarrollo
**Prioridad**: alta
**Agregado por**: agente-principal - 2026-05-06

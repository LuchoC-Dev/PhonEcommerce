# Workflow: Feature Development

## Descripción
Flujo estándar para desarrollar una feature/dominio.

## Pasos

### 1. Arrancar
- Leer `AGENTS.md` del directorio correspondiente
- Buscar engrams relevantes con `mem_search`
- Entender el contexto antes de tocar código

### 2. Preguntar antes de implementar
- Consultar al usuario cómo deben ser las entidades del dominio
- No asumir nada sobre campos, relaciones ni comportamientos
- Confirmar antes de arrancar

### 3. Desarrollar
- Trabajar dentro del dominio asignado
- No modificar código de otros dominios sin justificación
- TypeScript estricto, sin `any`

### 4. Documentar — OBLIGATORIO
- **OpenAPI**: todos los endpoints con schema completo (description, tags, body, params, responses)
- **TSDoc**: interfaces de dominio, use-cases, funciones complejas
- **`/docs/api.md`**: agregar resumen de endpoints del dominio
- **`/docs/decisions/`**: crear ADR si hubo decisiones de arquitectura importantes

### 5. Finalizar
- Revisar que el código compila sin errores
- Hacer commit con skill `/git-commit`
- Guardar engram con:
  - Qué se hizo
  - Decisiones tomadas con el usuario
  - Consideraciones y gotchas
  - Archivos modificados
  - Proyecto: "ImNotPhound"

# Skill: git-commit

## Descripción
Realiza un commit semántico con los cambios actuales.

## Cuándo usar
Al finalizar una tarea o feature completa.

## Pasos
1. `git status` — revisar cambios
2. `git diff` — revisar qué cambió
3. `git add <archivos relevantes>`
4. `git commit -m "<tipo>(<scope>): <descripción>"`

## Tipos de commit
- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `chore` — configuración, setup
- `refactor` — refactorización
- `docs` — documentación

## Ejemplo
```
feat(products): add product listing with filters
```

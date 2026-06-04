# Repository Guidelines

## Project Structure & Module Organization
Monorepo con separación explícita entre frontend y backend:
Crea las carpetas de apps y packages.
- `apps/frontend/` Frontend Next.js + TypeScript + Tailwind.
- `apps/backend/` Backend NestJS + TypeORM con arquitectura hexagonal (modules, controllers, services, repositories).
- `packages/shared/` tipos/DTOs compartidos entre frontend y backend.
- `infra/` despliegue y configuración (Docker, MySQL, CI).

Estructura base (resumen):
```
apps/
  frontend/
    src/
      app/          # bootstrap, routing, providers
      features/     # módulos por dominio
      shared/       # UI y utilidades
      styles/       # Tailwind y estilos globales
  backend/
    src/
      domain/       # entidades y reglas de negocio puras
      application/  # casos de uso y servicios
      adapters/
        inbound/    # Controllers y DTOs HTTP
        outbound/   # Repositorios TypeORM y servicios externos
      infrastructure/ # Configuración, DI, clientes (DataSource)
packages/
  shared/           # Tipos, DTOs, interfaces compartidas
infra/              # Docker, MySQL, scripts CI/CD

```

## Database
- **Motor**: MySQL 8+
- **ORM**: TypeORM
- **Migraciones**: TypeORM para versionado de esquemas.
- **Diseño de esquema**: explícito y normalizado, sin lógica de negocio dentro de la base de datos.
- **Patrón**: Adapter (outbound) aislado del dominio para mantener arquitectura hexagonal.

## Build, Test, and Development Commands
Frontend (`apps/frontend`):
- `npm install` instalar dependencias.
- `npm run dev` servidor local Next.js
- `npm run build` build de producción.
- `npm run test` tests unitarios.

Backend (`apps/backend`):
- `npm install` instalar dependencias NestJS.
- `npm run dev` levantar servidor en modo desarrollo
- `npm run build` build de producción.
- `npm run test` tests unitarios.

## Coding Style & Naming Conventions
- TypeScript: `camelCase` para funciones/variables, `PascalCase` para componentes.
- NestJS: PascalCase para controllers, services y modules; camelCase para funciones y variables.
- Formateo sugerido: prettier + eslint en frontend; prettier + eslint en backend.

## Testing Guidelines
- Frontend: tests en `apps/frontend/tests/`, nombres `*.test.tsx`.
- Backend: tests en `apps/backend/tests/`, nombres `*.spec.ts`.
- Priorizar casos de uso (application) y adaptadores críticos.

## Commit & Pull Request Guidelines
Usar convención clara (recomendado: Conventional Commits). Ejemplo: `feat(bakend): add user signup`.
PRs deben incluir: descripción breve, issue linkeado (si aplica) y capturas para cambios UI.

## Security & Configuration Tips
- Configuración en `.env` (no commitear). Agregar `.env.example` con llaves requeridas.
- Credenciales de MySQL solo por variables de entorno (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).
- Evitar lógica sensible en frontend; todo acceso a datos pasa por la API.

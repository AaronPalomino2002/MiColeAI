# MiColeAI — Estado del Backend y Plan de Ejecución por Fases

> Análisis de `apps/backend` (NestJS + TypeORM + MySQL) frente a las 19 entidades del dominio y a las necesidades del frontend.
> Documento de trabajo: módulos reales + endpoints existentes + huecos + roadmap.
> Última actualización: 2026-06-15.

---

## 1. Resumen Ejecutivo

| Bloque | Estado |
|--------|--------|
| Autenticación (login multi-rol, registro estudiante) | ✅ Funcional (registro solo crea estudiantes) |
| Chat con IA (OpenAI real, texto + imagen, historial) | ✅ Funcional |
| Agentes IA (listar, ver, crear) | ✅ Funcional |
| Dashboards (student, tutor, teacher, director) | ✅ Funcional (queries reales, no mock) |
| Exámenes | ⚠️ Solo lectura (no se pueden crear ni rendir) |
| Mutación de alertas, temas, usuarios, matrículas | ❌ Ausente |
| Gestión institucional (schools, grades, sections) | ❌ Sin módulo (solo entidades + dashboard de lectura) |

**Diagnóstico:** el backend está sorprendentemente avanzado en **lectura y analítica** (los 4 dashboards calculan métricas reales con QueryBuilder) y en **chat IA** (OpenAI integrado). El gran hueco es la **escritura**: faltan los módulos para crear exámenes, rendirlos, gestionar el colegio y mutar alertas/temas/usuarios. Hay 19 entidades pero solo **6 módulos** y la mayoría son de solo-lectura.

---

## 2. Configuración base

| Aspecto | Valor | Nota |
|---------|-------|------|
| Framework | NestJS | `main.ts` |
| ORM / Motor | TypeORM / MySQL | `app.module.ts` |
| `synchronize` | `true` | ⚠️ solo dev; peligroso en prod (recrea esquema) |
| Auth | JWT + bcrypt | `JwtAuthGuard` global por controller |
| Swagger | `/api` | Bearer auth configurado |
| IA | OpenAI SDK | `process.env.OPENAI_API_KEY`, modelo por agente (`gpt-4o-mini` default) |
| Uploads | estáticos en `/uploads`, imágenes de chat en base64 | `main.ts` |

---

## 3. Módulos y Endpoints existentes

| Módulo | Endpoint | Método | Auth | Estado |
|--------|----------|--------|------|--------|
| **auth** | `/auth/register` | POST | público | ✅ solo crea `students` |
| **auth** | `/auth/login` | POST | público | ✅ busca en `students` y luego `users` |
| **agents** | `/agents` | GET | JWT | ✅ |
| **agents** | `/agents/:id` | GET | JWT | ✅ |
| **agents** | `/agents` | POST | JWT | ✅ crea Subject + AIAgent |
| **chat** | `/chat/sessions` | POST | JWT | ✅ |
| **chat** | `/chat/sessions` | GET | JWT | ✅ |
| **chat** | `/chat/sessions/:id/messages` | GET | JWT | ✅ |
| **chat** | `/chat/sessions/:id/messages` | POST | JWT | ✅ texto + imagen → OpenAI |
| **subjects** | `/subjects` | GET | JWT | ✅ |
| **subjects** | `/subjects/:id` | GET | JWT | ✅ |
| **exams** | `/exams` | GET | JWT | ✅ solo lectura |
| **exams** | `/exams/subject/:id` | GET | JWT | ✅ solo lectura |
| **exams** | `/exams/:id` | GET | JWT | ✅ solo lectura (no carga questions/options) |
| **dashboard** | `/dashboard/student` | GET | JWT | ✅ progreso, próximos exámenes, mejoras |
| **dashboard** | `/dashboard/tutor` | GET | JWT | ✅ stats aula + alertas + estudiantes |
| **dashboard** | `/dashboard/teacher` | GET | JWT | ✅ temas, dudas, scores por materia |
| **dashboard** | `/dashboard/director` | GET | JWT | ✅ KPIs + por grado + por materia |

---

## 4. Entidades sin módulo / sin escritura

19 entidades, pero solo 6 módulos. Quedan **sin CRUD ni endpoints de escritura**:

| Entidad | ¿Se lee? | ¿Se escribe? | Falta |
|---------|----------|--------------|-------|
| `School` | solo en dashboard director | ❌ | Módulo CRUD |
| `Grade` | solo en dashboard director | ❌ | Módulo CRUD |
| `Section` | solo en dashboards | ❌ | Módulo CRUD + asignar tutor |
| `User` (director/tutor/teacher) | login | ❌ no se crean | Endpoint crear/gestionar staff |
| `Student` | dashboards | parcial (solo register) | Gestión por director/tutor |
| `TeacherSubject` | dashboards | ❌ | Asociar docente↔materia |
| `WeeklyTopic` | dashboard teacher | ❌ | Crear/editar temas |
| `Enrollment` | ❌ | ❌ (solo seed) | Inscripción a materias |
| `Exam` | sí | ❌ | Crear examen |
| `Question` / `Option` | ❌ (ni se cargan) | ❌ | Crear preguntas |
| `ExamAttempt` | agregados en dashboard | ❌ | Iniciar/cerrar intento |
| `Answer` | ❌ | ❌ | Registrar respuestas |
| `ImprovementArea` | dashboard student | ❌ | Generar (IA tras examen) |
| `Alert` | dashboards | ❌ | Crear y resolver (`PATCH`) |

---

## 5. Deudas técnicas detectadas

- **`register` solo crea estudiantes** — no hay forma de dar de alta director/tutor/docente vía API (`auth.service.ts:19`).
- **`synchronize: true`** en producción borraría/recrearía el esquema. Migrar a migraciones antes de desplegar.
- **`@Body() body: any` sin DTOs ni validación** en auth — falta `class-validator` / `ValidationPipe`.
- **`/exams/:id` no carga `questions`/`options`** — imposible rendir un examen con el endpoint actual.
- **Queries con `manager.getRepository('Exam')` por string** en dashboard — frágil, sin tipado (`dashboard.service.ts:73`).
- **Resolver alerta no existe en backend** — el frontend lo simula localmente.
- **`tokens_used` y gamificación** (`streakCount`, `tokensBalance`) no se actualizan en ningún flujo (el chat no descuenta tokens).
- **Sin paginación** en listados (`/exams`, `/agents`, etc.).

---

## 6. Plan de Ejecución por Fases

> Alineado con el plan de frontend. El backend habilita; el frontend consume.

### FASE 1 — Cerrar mutaciones de lo ya conectado ✅ COMPLETADA (2026-06-15)
**Objetivo:** dar escritura a las acciones que el frontend ya muestra pero no puede ejecutar.
- [x] `PATCH /alerts/:id/resolve` (resolver alerta) + módulo `alerts`.
- [x] `POST /alerts` (crear alerta manual / generación automática).
- [x] Módulo `weekly-topics`: `POST /weekly-topics`, `GET /weekly-topics?subjectId=`.
- [x] Endpoint crear staff: `POST /users` + `GET /users?role=` (módulo `users`).
- [ ] Asociar `TeacherSubject` al crear docente (pendiente → mover a Fase 3).
- [ ] `ValidationPipe` global + DTOs con `class-validator` (pendiente → `class-validator` no instalado; mover a Fase 5).

**Entregable:** los 3 dashboards de rol con mutaciones reales. ✅
**Hecho:** módulos `alerts`, `weekly-topics`, `users` creados y registrados en `app.module.ts`; backend type-check OK.

---

### FASE 2 — Flujo completo de exámenes ✅ COMPLETADA (2026-06-15)
**Objetivo:** crear, rendir y corregir exámenes de verdad.
- [x] `POST /exams` con `questions` + `options` anidados (transacción `dataSource.transaction`).
- [x] `GET /exams/:id` que **sí** carga `questions` y `options` SIN revelar `is_correct` (`findOneForStudent`).
- [x] `POST /exam-attempts` (iniciar intento → `started_at`).
- [x] `POST /exam-attempts/:id/submit` → guarda `answers`, calcula `score`, cierra `completed_at`.
- [x] Genera `ImprovementArea` + `ai_feedback_summary` con OpenAI a partir de respuestas falladas (best-effort).
- [x] `GET /exam-attempts/:id` (resultado) y `GET /exam-attempts?studentId=` (historial).

**Entregable:** ciclo examen creado → rendido → corregido → feedback con IA. ✅
**Hecho:** módulo `exam-attempts` creado; `exams` ampliado (Question/Option en el module); type-check OK. El seed `pamer.seed.ts` ya crea un examen con preguntas para probar.
**Pendiente menor:** UI de docente para *crear* examen (el endpoint existe; falta el formulario). `POST /exam-attempts/:id/answers` por-pregunta se omitió: las respuestas se envían en bloque en `/submit` (más simple y suficiente).

---

### FASE 3 — Gestión institucional ✅ COMPLETADA (2026-06-15)
**Objetivo:** módulos CRUD para que un director configure el colegio.
- [x] Módulo `schools`: `POST /schools`, `GET /schools/me`, `GET /schools/:id`, `PATCH /schools/:id`.
- [x] Módulo `academics` (grados+secciones+teacher-subjects): `POST/GET /grades`, `POST/GET /sections`, `PATCH /sections/:id/tutor`, `POST/GET /teacher-subjects`.
- [x] Módulo `students`: `POST /students`, `GET /students?sectionId=`, `PATCH /students/:id/section`, `POST/GET /students/:id/enrollments`.
- [x] Asociación docente↔materia (`teacher-subjects`) — resuelve el pendiente de Fase 1.
- [ ] Guard de roles (`@Roles('director')`) — pendiente → Fase 5 (hoy solo JWT). Los controllers ya leen `schoolId` del token.

**Entregable:** API completa de administración multi-tenant. ✅
**Hecho:** módulos `schools`, `academics`, `students` creados y registrados; type-check OK.

---

### FASE 4 — Analítica avanzada ✅ COMPLETADA (2026-06-15)
**Objetivo:** servir los datos que la analítica del frontend necesita.
- [x] `GET /analytics/performance-timeline` (serie temporal; por estudiante o agregada por colegio según rol).
- [x] `GET /analytics/exam/:examId` (preguntas más falladas — agregación sobre `answers`).
- [x] `GET /analytics/frequent-doubts?subjectId=` (agrupación de `messages` por tema).
- [x] `GET /analytics/compare-grades` (promedio comparativo por grado).
- [ ] Exportación PDF del director — pendiente (UI tiene el botón; requiere generación de PDF, futura).
- [ ] Gamificación (`tokens_used`, `streak_count`) — pendiente → futura.

**Entregable:** endpoints de analítica para charts, drill-down y dudas. ✅
**Hecho:** módulo `analytics` creado y registrado; type-check OK.

---

### FASE 5 — Endurecimiento para producción 🟡 EN CURSO (2026-06-15)
**Objetivo:** preparar el backend para desplegar.
- [x] **Guard de roles** (`RolesGuard` + `@Roles`) aplicado: `users`/`schools`/`academics` (director), `students`/`alerts` (director+tutor), create de `exams`/`weekly-topics` (teacher+director), analytics institucional (director/teacher). Timeline y GETs de rendir examen quedan abiertos a JWT.
- [x] **Validación**: `class-validator` + `class-transformer` instalados, `ValidationPipe` global (`whitelist`+`transform`), DTOs convertidos a clases validadas en `users`, `students`, `exams` (anidado questions/options).
- [x] **Logging**: quitado `console.log` de depuración del chat.
- [x] **`.env.example`** documentado (`apps/backend/.env.example`).
- [ ] **Migraciones**: sigue `synchronize: true`. PENDIENTE (decisión del usuario: no tocar arranque de BD en desarrollo). Para prod: configurar DataSource, `migration:generate`, `synchronize:false`.
- [ ] Paginación en listados — pendiente.
- [ ] Tests e2e de flujos críticos — pendiente.
- [ ] DTOs validados en endpoints restantes (alerts, weekly-topics, academics, schools) — parcial.

**Entregable:** roles + validación + secrets documentados. 🟡 Falta migraciones/tests/paginación para "producción" plena.

---

## 7. Mapa de dependencia Frontend ↔ Backend

| Fase | Backend habilita | Frontend consume |
|------|------------------|------------------|
| 1 | `PATCH /alerts/:id`, `POST /weekly-topics`, `POST /users` | Botones de dashboards tutor/docente/director |
| 2 | CRUD exámenes + intentos + answers + IA feedback | Flujo `exams/*` (room, feedback, success) |
| 3 | CRUD schools/grades/sections/students/enrollments | Vistas de gestión institucional |
| 4 | `/analytics/*` | Charts, drill-down, dudas frecuentes, PDF |
| 5 | migraciones, validación, tests | (estabilidad general) |

> Recomendación: ejecutar backend y frontend **en paralelo por fase** — primero el endpoint, luego la vista que lo consume.

---

## 8. Recomendación de Priorización

1. **Fase 1** (mutaciones simples) — desbloquea botones muertos ya visibles.
2. **Fase 2** (exámenes) — corazón del producto; habilita la analítica de la Fase 4.
3. **Fase 3** (institucional) — necesaria para datos reales multi-colegio y control de roles.
4. **Fase 4** (analítica) — depende de datos reales de 2 y 3.
5. **Fase 5** (producción) — antes de cualquier despliegue real.

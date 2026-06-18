# MiColeAI — Estado del Frontend y Plan de Ejecución por Fases

> Análisis del frontend (`apps/frontend`) frente al backend (`apps/backend`, 19 entidades) y la visión del producto.
> Documento de trabajo: estado real + huecos + roadmap por fases.
> Última actualización: 2026-06-15.

---

## 1. Resumen Ejecutivo

| Bloque | Estado |
|--------|--------|
| Núcleo del estudiante (dashboard, agentes, chat) | ✅ Conectado y funcional |
| Dashboards analíticos por rol (tutor, docente, director) | ✅ Conectados (con acciones pendientes) |
| Lista de exámenes | ✅ Conectada |
| Flujo completo de exámenes (rendir → corregir → feedback) | ❌ Mock |
| Gestión institucional (colegio, grados, secciones, staff, matrícula) | ❌ Ausente |
| Vistas `admin/*` | ⚠️ Mock duplicado y desconectado |
| Analítica avanzada (series temporales, drill-down, dudas frecuentes, PDF) | ❌ Ausente |

**Diagnóstico:** el camino del estudiante está sólido. Faltan: el flujo real de exámenes, toda la administración institucional y la analítica avanzada. Las vistas `admin/*` son prototipos visuales (Stitch) que duplican los dashboards `(portal)` reales y conviene unificar o eliminar.

---

## 2. Inventario de Vistas

### 2.1 Vistas con datos REALES (consumen API)

| Vista | Ruta | Endpoint | Observaciones |
|-------|------|----------|---------------|
| Dashboard estudiante | `(portal)/dashboard/page.tsx` | `GET /dashboard/student` | OK |
| Dashboard tutor | `(portal)/dashboard/tutor/page.tsx` | `GET /dashboard/tutor` | "Resolver alerta" es solo local; falta `PATCH /alerts/:id` |
| Dashboard docente | `(portal)/dashboard/teacher/page.tsx` | `GET /dashboard/teacher` | Botón "Registrar tema semanal" sin acción |
| Dashboard director | `(portal)/dashboard/director/page.tsx` | `GET /dashboard/director` | "Exportar PDF" y "Registrar docente" sin acción |
| Agentes IA | `(portal)/agents/page.tsx` | `GET/POST /agents` | CRUD funcional |
| Chat | `(portal)/chat/page.tsx` | `/agents`, `/chat/sessions`, mensajes | Texto + imagen + markdown/LaTeX |
| Exámenes (lista) | `(portal)/subjects/exams/page.tsx` | `GET /exams` | OK |

### 2.2 Vistas 100% MOCK (HTML hardcodeado, sin API)

| Vista | Ruta | Pista de mock |
|-------|------|---------------|
| Exam Center | `(portal)/exams/page.tsx` | "Advanced Mathematics", "Dr. Math Bot" |
| Sala de examen | `(portal)/exams/room/page.tsx` | Timer `00:42:15` fijo |
| Feedback de examen | `(portal)/exams/feedback/page.tsx` | Estático |
| Éxito de examen | `(portal)/exams/success/page.tsx` | Estático |
| Admin Dashboard | `admin/dashboard/page.tsx` | "Mathematics 101", `84.2%` |
| Admin Analytics | `admin/analytics/page.tsx` | "Quantum Mechanics", "© 2024 StudyAI" |
| Admin Students | `admin/students/page.tsx` | "Liam Wilson", avatares fijos |
| Admin Teacher Analytics | `admin/teacher/page.tsx` | "74.2%", estudiantes ficticios |

> ⚠️ **Duplicidad crítica:** `admin/*` (inglés, mock, sin API) vs `(portal)/dashboard/{tutor,teacher,director}` (español, real, conectado). El sidebar solo enlaza a `(portal)`. Las `admin/*` son prototipos huérfanos.

---

## 3. Huecos respecto a la Base de Datos

19 entidades en el backend; el frontend cubre solo una parte.

| Entidad sin UI funcional | Vista que falta | Rol |
|--------------------------|-----------------|-----|
| `schools` | Configuración del colegio | Director |
| `grades` / `sections` | Gestión de grados y secciones | Director |
| `users` (tutor/teacher) | Alta/gestión de staff | Director |
| `students` | Matrícula y gestión de estudiantes | Director/Tutor |
| `weekly_topics` | Registro de temas semanales | Docente |
| `exams` + `questions` + `options` | Crear/editar examen y rendirlo | Docente/Estudiante |
| `exam_attempts` + `answers` | Historial de intentos real | Estudiante |
| `enrollments` | Inscripción a materias | Estudiante/Director |
| `alerts` (mutación) | Resolver/crear alertas | Tutor |

---

## 4. Huecos de Análisis (visión de producto)

- **Evolución temporal:** no hay librería de charts ni series de tiempo; todo son barras de % puntuales.
- **Drill-down por grado/sección:** los botones "Ver detalle" del director no navegan.
- **Detalle de examen** (preguntas más falladas): mock en `admin/analytics`, sin endpoint.
- **Dudas frecuentes** (NLP sobre `messages`): mencionado en visión, sin vista.
- **Comparativos institucionales** (grado vs grado, materia vs materia en el tiempo): inexistentes.
- **Reportes PDF exportables:** botones presentes, sin funcionalidad.
- **Ficha de estudiante individual** para tutor/director: solo existe como mock (`admin/students`).

---

## 5. Plan de Ejecución por Fases

> Orden por dependencia y valor: primero cerrar lo casi-hecho, luego el flujo de exámenes (corazón del producto), luego administración, y por último analítica avanzada.

### FASE 0 — Limpieza y Decisiones ✅ COMPLETADA (2026-06-15, junto con Fase 5)
**Objetivo:** eliminar deuda y duplicidad antes de construir.
- [x] `admin/*` **eliminado** (era mock huérfano; `(portal)/dashboard/*` + `manage` + `analytics` lo reemplazan).
- [x] Borrados `admin/dashboard`, `admin/analytics`, `admin/students`, `admin/teacher` y assets.
- [x] Sidebar verificado: no apunta a vistas mock.
- [ ] Consolidar idioma — el portal ya está en español; sin pendientes relevantes.

**Entregable:** un único sistema de vistas, sin duplicados. ✅

---

### FASE 1 — Cerrar acciones pendientes de vistas ya conectadas ✅ COMPLETADA (2026-06-15)
**Objetivo:** que los dashboards reales sean 100% funcionales.
- [x] `PATCH /alerts/:id/resolve` → botón "Marcar como resuelta" del dashboard tutor (optimista + revertir si falla).
- [x] `POST /weekly-topics` → modal "Registrar tema semanal" en dashboard docente (recarga al guardar).
- [x] `POST /users` → modal "Registrar personal" en dashboard director (rol docente/tutor/director).
- [x] Añadido método `patch` al cliente `lib/api.ts`.

**Entregable:** los 3 dashboards de rol sin botones muertos. ✅
**Nota:** botones "Exportar PDF" y "Registrar intervención" siguen pendientes (Fase 4 y futura). Frontend type-check OK.

---

### FASE 2 — Flujo real de exámenes ✅ COMPLETADA (2026-06-15)
**Objetivo:** reemplazar todo el mock de `exams/*` por el ciclo completo real.
- [x] **Listado** (`exams/page.tsx`): reescrito, conectado a `GET /exams` (reemplaza el mock).
- [x] **Rendir** (`exams/[id]/page.tsx`): NUEVA ruta. Carga preguntas reales, timer desde `timeLimitMinutes`, crea `exam-attempt` al entrar, navegación pregunta a pregunta, autoenvío al agotar tiempo.
- [x] **Enviar + calificar:** `POST /exam-attempts/:id/submit` (respuestas en bloque).
- [x] **Resultado/Feedback** (`exams/[id]/result/page.tsx`): NUEVA ruta. Muestra score, `aiFeedbackSummary` y `improvements` reales.
- [x] Añadido `timeLimitMinutes`/`difficulty` reales en la lista de `subjects/exams`.
- [x] **Crear examen** (vista docente `exams/create`): formulario completo (datos + preguntas + opciones, marca correcta). `POST /exams`.
- [x] **Historial** (`exams/history`): lista de intentos del estudiante con score y enlace al resultado. `GET /exam-attempts`.
- [x] Sidebar: ítem "Crear examen" para docentes / "Mi historial" para estudiantes según rol.
- [x] Eliminadas las vistas mock huérfanas `exams/room`, `exams/feedback`, `exams/success`.

**Entregable:** ciclo completo crear → rendir → calificar → feedback + historial. ✅ FASE 2 100%.

---

### FASE 3 — Gestión institucional ✅ COMPLETADA (2026-06-15)
**Objetivo:** que un director pueda configurar el colegio de punta a punta.
- [x] Vista `manage/page.tsx` (solo director) con pestañas: Grados y secciones / Personal / Colegio.
- [x] Crear grados y secciones; asignar tutor a sección (dropdown de tutores reales).
- [x] Listado de personal del colegio (`GET /users`).
- [x] Datos del colegio (`GET /schools/me`).
- [x] Sidebar: ítem "Gestión" visible solo para director.
- [ ] UI de alta de estudiantes / matrícula a materias: endpoints listos (`/students`, `/students/:id/enrollments`); falta formulario (pendiente menor).

**Entregable:** Director gestiona grados → secciones → tutores → ve personal. ✅
**Nota:** las vistas mock `admin/*` siguen sin conectar; ahora son redundantes con `manage` y los dashboards → borrar en Fase 0/limpieza.

---

### FASE 4 — Analítica avanzada ✅ COMPLETADA (2026-06-15)
**Objetivo:** cumplir la promesa de "inteligencia académica institucional".
- [x] Charts en **SVG puro** (`components/Charts.tsx`: `LineChart` + `BarChart`) — sin dependencia externa.
- [x] **Series temporales:** evolución de notas en dashboard estudiante + vista analítica institucional.
- [x] **Vista `analytics/page.tsx`** (director/docente): timeline + comparativo de grados + dudas frecuentes.
- [x] **Dudas frecuentes:** ranking de temas sobre `messages`.
- [x] **Comparativo de grados.**
- [x] Sidebar: ítem "Analítica" para director y docente.
- [ ] **Drill-down** grado→sección→estudiante: endpoints base listos; navegación pendiente (futura).
- [ ] **Detalle de examen** (`GET /analytics/exam/:id`): endpoint listo; falta enchufar en UI docente (futura).
- [ ] **Exportar PDF:** pendiente (futura).

**Entregable:** dashboards con tendencias, comparativos y analítica de dudas. ✅
**Decisión:** charts en SVG en vez de Recharts para no añadir dependencias sin aprobación (igual criterio que `class-validator`).

---

## 6. Resumen de Endpoints a crear/confirmar en backend

| Fase | Endpoint | Método |
|------|----------|--------|
| 1 | `/alerts/:id` | PATCH |
| 1 | `/weekly-topics` | POST |
| 1 | `/users` | POST |
| 2 | `/exams` (crear con preguntas) | POST |
| 2 | `/exam-attempts` | POST/GET |
| 2 | `/answers` | POST |
| 3 | `/schools`, `/grades`, `/sections` | CRUD |
| 3 | `/teacher-subjects`, `/enrollments` | CRUD |
| 4 | `/analytics/*` (series, comparativos, dudas) | GET |

> Nota: confirmar qué endpoints ya existen revisando los controllers (`apps/backend/src/**/*.controller.ts`) antes de implementar.

---

## 7. Recomendación de Priorización

1. **Fase 0 + Fase 1** primero (rápido, elimina deuda y deja lo existente impecable).
2. **Fase 2** (exámenes) — es el corazón funcional y desbloquea la analítica de la Fase 4.
3. **Fase 3** (institucional) — necesaria para datos reales multi-colegio.
4. **Fase 4** (analítica) — depende de tener datos reales de las fases 2 y 3.

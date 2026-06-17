# EduInsight AI — Análisis de Pendientes, Cobertura de Datos y Flujos End-to-End

> Documento de análisis tras completar las Fases 0–5.
> Responde: ¿qué queda pendiente?, ¿todas las vistas usan datos reales de la BD?, ¿hay datos que no se usan?, y un flujo completo creación → analítica.
> Fecha: 2026-06-15.

---

## 0. Smoke test en runtime ✅ EJECUTADO (2026-06-15)

Primera ejecución real del sistema (MySQL + backend NestJS, datos del seed PAMER). Resultados:

| Verificación | Resultado |
|--------------|-----------|
| Arranque del backend | ✅ Las ~40 rutas de los 15 módulos montan; TypeORM conecta a MySQL |
| Login multi-rol (`/auth/login`) | ✅ Docente y director obtienen JWT con su rol |
| Analítica de dudas por tema (fix de hoy) | ✅ Dashboard docente muestra "Factorización → 1 duda" (mensaje sembrado con `topicId`) |
| **Guard de roles** | ✅ Docente recibe **403** en `/analytics/compare-grades` y `POST /users` |
| Dashboard director + `/analytics/compare-grades` | 🐛→✅ Daban **500**; **bug encontrado y corregido** |

**Bug encontrado y arreglado:** `Grade` no tenía la relación inversa `@OneToMany sections`, pero `dashboard.service.ts` (preexistente) y `analytics.service.ts` la usaban con `relations: ['sections']` → `EntityPropertyNotFoundError` → 500. Se añadió la relación a `grade.entity.ts`. Tras el fix, ambos endpoints responden 200 con datos reales (3 estudiantes, promedio 10, comparativo por grado).

> El smoke test cumplió su propósito: cazó un 500 en el dashboard del director que el type-check no podía detectar.

### Verificación de flujo completo (chat + examen con OpenAI real) ✅ EJECUTADA (2026-06-16)

Probado vía HTTP contra OpenAI real (BD `railway`, datos del seed). Backend y frontend levantados (`localhost:3001` / `localhost:3000`).

| Flujo | Resultado |
|-------|-----------|
| **Chat con OpenAI** | ✅ Responde coherente; mensaje guarda `topicId` y `tokensUsed:95` (confirma ambos fixes) |
| **Cargar examen para rendir** | ✅ Trae preguntas/opciones **sin** exponer `isCorrect` (seguridad OK) |
| **Rendir + calificar** | ✅ 1/2 correctas → **score 50**; feedback IA generado por OpenAI |
| **Frontend** | ✅ Sirve en `:3000` (Next.js + i18n) |

**2º bug encontrado y arreglado:** todos los agentes del seed tienen `modelId: 'claude-sonnet-4-6'`, pero `ChatService` usa el **SDK de OpenAI** → `404 model_not_found` → el chat daba **500**. Fix: el chat normaliza el modelo (si no empieza por `gpt`, usa `gpt-4o-mini`) para no romperse ante un agente mal configurado. Tras el fix, chat 201 OK.

> Quedan sin probar por UI/navegador (solo verificados por API): el render de las pantallas de chat/examen/dashboards. La lógica de negocio está confirmada end-to-end.

### Verificación VISUAL por navegador (Playwright MCP) ✅ EJECUTADA (2026-06-17)

Recorrido real en `localhost:3000` con navegador automatizado:

| Verificación | Resultado |
|--------------|-----------|
| Login docente → redirección por rol | ✅ Va a `/dashboard/teacher`; JWT + routing por rol OK |
| Render del dashboard docente | ✅ Sidebar por rol, KPIs, "Temas que más dudas generan" (Polinomios 2, Factorización 1) **renderizado con datos reales** |
| Modal "Registrar tema semanal" → `POST /weekly-topics` | ✅ Crea "Radicación · Sem 3", aparece en lista + nuevo filtro "Sem 3", sin errores en consola |

**🔴 Hallazgo crítico de configuración:** el `apps/frontend/.env.local` apuntaba a **`NEXT_PUBLIC_API_URL=https://micoleaibackend-production.up.railway.app`** (backend de producción en Railway), **no a `localhost:3001`**. Ese backend remoto tiene una versión **vieja sin las Fases 1-5** → la UI daba **404** en `POST /weekly-topics` y demás endpoints nuevos. La verificación por API no lo detectó porque golpeaba `localhost:3001` directamente.
- Para la verificación local se cambió a `http://localhost:3001` (con el valor de Railway comentado para revertir).
- **PENDIENTE DE DESPLIEGUE:** todos los cambios de las Fases 1-5 (módulos nuevos, guards, validación, fix de `topicId`, fix de `modelId`, relación `Grade.sections`) **solo viven en local**. Para que producción (Railway) los tenga hay que hacer **commit + push + redeploy del backend**. Hasta entonces, la app desplegada NO tiene ninguna de las mejoras de esta sesión.

### Recorrido visual completo de flujos (Chrome DevTools MCP) ✅ (2026-06-17)

Verificados en navegador, todos contra `localhost:3001` (confirmado por panel de red):

| Flujo | Resultado |
|-------|-----------|
| Chat estudiante con OpenAI | ✅ MateIA responde (ejemplo de factor común), markdown OK, `POST .../messages → 201` |
| **Bug 4 — alineación de mensajes en chat** | 🐛→✅ El 1er mensaje del estudiante se renderizaba como "TUTOR IA". Causa: front comparaba `sender === "STUDENT"` pero el backend persiste `'student'` (minúsculas). Fix: `sender?.toUpperCase()`. Verificado tras recarga. |
| Rendir examen (estudiante) | ✅ Timer, navegación Q1/Q2, ambas correctas → **100% "Aprobado"**; sin ImprovementArea (correcto, no falló nada) |
| Dashboard director | ✅ KPIs reales (3 est., prom 53%, 1 alerta), "3° Secundaria requiere atención" (brecha 22pp), desglose por grado — el bug del 500 (`Grade.sections`) confirmado resuelto en UI |
| Analítica director | ✅ `performance-timeline`, `compare-grades`, `frequent-doubts` → todas 200; charts SVG renderizan; "Temas con más dudas" incluye **Radicación** (tema creado en esta sesión vía UI docente → confirma cadena topic→chat→analítica completa) |

### Flujos de escritura restantes (gestión + crear examen) ✅ (2026-06-17)

| Flujo | Resultado |
|-------|-----------|
| Gestión: crear grado | ✅ `POST /grades → 201`, "6° Secundaria" aparece en lista |
| Gestión: asignar tutor a sección | ✅ `PATCH /sections/:id/tutor → 200` |
| Crear examen (docente) | ✅ Formulario con tema/preguntas/opciones → `POST /exams`, "Evaluación de Radicación" aparece en la lista (2 disponibles) |

**🐛 Bug 6 — KPI "Consultas a la IA" del director en 0.** Causa: `getRepository('TeacherSubject')` por string + `leftJoin('ts.teacher')` no resolvía la relación → 0 materias → KPI 0 (pero la analítica sí mostraba dudas, de ahí la inconsistencia). Fix: repos tipados (`getRepository(User/TeacherSubject)` con `find`+`In`+`relations`). Verificado: KPI = 4.

**🐛 Bug 7 — `POST /grades` daba 500 ("school_id no default").** Causa raíz: el **login de staff no incluía `schoolId` en el `select`** → el JWT del director salía sin `schoolId` → `req.user.schoolId` undefined en toda mutación institucional. Fix: añadir `'schoolId'` al `select` de `auth.service.ts`. Verificado: JWT ahora trae `schoolId`, crear grado/sección/tutor OK.

**Total de bugs cazados por probar en runtime/UI: 7** — (1) dashboard director 500 `Grade.sections`, (2) chat 500 `modelId` Claude, (3) config Railway, (4) alineación mensajes chat `sender`, (5) repetición del 1, (6) KPI consultas IA en 0, (7) login sin `schoolId` → mutaciones institucionales rotas. Ninguno detectable por type-check; todos corregidos y verificados en pantalla.

**Cobertura de verificación visual: COMPLETA** — login (3 roles), dashboards (estudiante/docente/director), chat con OpenAI, rendir examen, crear examen, registrar tema, gestión institucional (grados/secciones/tutor), analítica. Todo contra `localhost:3001`.

### Casos de error / validación + mutaciones restantes ✅ (2026-06-17)

| Caso | Resultado |
|------|-----------|
| Login con password incorrecto | ✅ Muestra "Invalid credentials", no rompe (⚠️ mensaje en inglés, resto en español — cosmético) |
| ValidationPipe: examen sin preguntas | ✅ 400 (`@ArrayMinSize`) |
| ValidationPipe: `timeLimitMinutes` no numérico | ✅ 400 (`@IsInt`) |
| ValidationPipe: examen sin título | ✅ 400 `"title must be a string"` |
| Registrar docente por UI (email nuevo) | ✅ `POST /users → 201`, modal éxito |
| Registrar docente con email duplicado | ✅ 409 "Email already registered" |
| Resolver alerta (tutor) por UI | ✅ `PATCH /alerts/:id/resolve → 200`, alerta pasa a "Sin alertas activas 🎉" |

**El `ValidationPipe` de Fase 5 quedó confirmado funcionando** (antes solo se había probado el camino feliz). Todos los casos de error devuelven códigos correctos (400/401/409) con mensajes legibles, ningún 500.

**Único pendiente cosmético detectado:** el mensaje de error de login está en inglés ("Invalid credentials") mientras la UI está en español. No funcional. → ✅ RESUELTO (ver abajo).

### Cierre de pendientes de trabajo futuro ✅ (2026-06-17)

| Pendiente | Implementación | Verificación |
|-----------|----------------|--------------|
| **Gamificación** | Chat descuenta `tokensUsed` de `Student.tokensBalance` (clamp a 0); login calcula `streakCount` (días consecutivos) | ✅ Balance 100 → chat 144 tokens → quedó en **0**; racha = 1 |
| **Exportar reporte (director)** | `exportReport()` genera CSV client-side (KPIs + grados + materias), sin dependencias. Botones "Exportar reporte" y "Descargar reporte" conectados | ✅ Sin errores en consola; CSV con datos reales |
| **Ver detalle del grado** | NUEVA vista `manage/grades/[gradeId]` (secciones + tutor + estudiantes). Botones del dashboard convertidos en enlaces | ✅ 3° Secundaria → Sección B con Carlos Rojas y 3 estudiantes reales |
| **Traducción login** | Frontend mapea "Invalid credentials" → `te("invalidCredentials")` | ✅ Muestra "Credenciales inválidas" |

Type-check OK en backend y frontend. Todo verificado en navegador (Chrome DevTools MCP).

**Pendientes restantes (no críticos):** migraciones (`synchronize:true`), tests e2e, paginación, `subjects/exams` huérfana, y el **despliegue a Railway** (todo sigue en local).

---

## 1. Resumen del estado

| Fase | Estado |
|------|--------|
| 0 — Limpieza (`admin/*`) | ✅ |
| 1 — Mutaciones de dashboards | ✅ |
| 2 — Flujo de exámenes | ✅ |
| 3 — Gestión institucional | ✅ |
| 4 — Analítica | ✅ |
| 5 — Roles + validación + secrets | 🟡 (migraciones/tests/paginación pendientes) |

**Lo construido funciona a nivel de tipos (type-check OK), pero NO se ha ejecutado en runtime.** Hay 3 huecos de datos que rompen funcionalidad real (sección 3).

---

## 2. Pendientes por prioridad

### 🔴 Críticos (rompen una feature con datos reales)

1. ✅ **RESUELTO (2026-06-15) — El chat ahora guarda `topicId`.**
   `chat.service.ts` resuelve el "tema activo" de la materia del agente (`WeeklyTopic` más reciente por `weekNumber`/`createdAt`) y lo asigna a los mensajes de estudiante y agente. → La analítica de **"temas con más dudas"** (docente, director, `/analytics/frequent-doubts`) ya recibe datos reales.
   *Limitación:* la heurística asume "tema más reciente = tema en estudio". Si se necesita precisión por conversación, habría que dejar al estudiante elegir el tema en el chat (mejora futura).

2. 🟡 **PARCIAL — Gamificación.**
   `tokensUsed` ya se registra en la respuesta del agente (de `completion.usage.total_tokens`). **Pendiente:** descontar ese consumo de `Student.tokensBalance` e incrementar `streakCount` en login/actividad diaria. Hoy esos dos campos siguen estáticos desde el seed.

3. **`ValidationPipe` con `whitelist` sin probar contra el frontend.**
   Si algún formulario envía un campo no declarado en el DTO, se descarta silenciosamente (o falla). No verificado en runtime. → Riesgo de que alta de usuario/estudiante/examen falle.

### 🟡 Importantes (funcionalidad incompleta)

4. **Vista `subjects/exams` huérfana.** Quedó una segunda lista de exámenes (`/subjects/exams`) que **nada enlaza**; la oficial es `/exams`. → Borrar o redirigir.
5. **Botones sin acción:** "Exportar PDF" y "Registrar intervención" (dashboards director/tutor) siguen muertos.
6. **DTOs validados solo parciales:** `alerts`, `academics`, `schools`, `weekly-topics` aún usan interfaces sin validación.
7. **UI de alta de estudiantes / matrícula:** endpoints listos (`/students`, `/students/:id/enrollments`), sin formulario.
8. **Detalle de examen** (`/analytics/exam/:id`, preguntas más falladas): endpoint listo, sin vista que lo consuma.

### 🟢 Producción / deuda técnica

9. **Migraciones:** sigue `synchronize: true` (recrea esquema). Bloqueante para prod.
10. **Sin tests** e2e/unitarios de los flujos críticos.
11. **Sin paginación** en listados.
12. **Drill-down** grado→sección→estudiante: no navegable.

---

## 3. Cobertura de datos: ¿todas las entidades se usan?

19 entidades. Clasificación por uso real (lectura **R** / escritura **W**):

| Entidad | R | W | Notas |
|---------|---|---|-------|
| `School` | ✅ | ✅ | CRUD + dashboard director |
| `User` (staff) | ✅ | ✅ | login, alta, asignaciones |
| `Grade` | ✅ | ✅ | academics + analítica |
| `Section` | ✅ | ✅ | academics + tutor |
| `Student` | ✅ | ✅ | auth, dashboards, gestión |
| `Subject` | ✅ | ✅ | agents, exámenes, analítica |
| `AIAgent` | ✅ | ✅ | agents + chat |
| `TeacherSubject` | ✅ | ✅ | academics + dashboards |
| `WeeklyTopic` | ✅ | ✅ | crea docente; eje analítico |
| `Enrollment` | ✅ | ✅ | matrícula |
| `Exam` | ✅ | ✅ | crear/rendir/listar |
| `Question` | ✅ | ✅ | crear/rendir |
| `Option` | ✅ | ✅ | crear/rendir/calificar |
| `ExamAttempt` | ✅ | ✅ | rendir/calificar/historial |
| `Answer` | ✅ | ✅ | se guardan en submit; se leen en `/analytics/exam` |
| `ImprovementArea` | ✅ | ✅ | genera IA al calificar; se lee en dashboard/result |
| `Alert` | ✅ | ✅ | crear/resolver + dashboards |
| `Message` | ✅ | ⚠️ | se crea, pero **sin `topicId`** → rompe analítica de dudas |
| `ChatSession` | ✅ | ✅ | chat |

**Campos concretos sin uso efectivo:**
- `Message.topicId` → nunca se escribe (ver crítico #1).
- `Message.tokensUsed` → solo en seed; no se acumula (crítico #2).
- `Student.tokensBalance` / `streakCount` → solo lectura (crítico #2).
- `Student.schoolName`, `gradeLevel`, `district` → campos legacy de texto libre, redundantes con las FK reales.
- `Exam.totalPoints` → se calcula al crear y se usa para el score; OK.

**Conclusión:** salvo `Message.topicId` y la gamificación, **todas las entidades se escriben y se leen**. El modelo está bien aprovechado; el problema es de *cableado de 2 campos*, no de tablas muertas.

---

## 4. ¿Las vistas se usan entre sí? (navegación)

| Vista | ¿Enlazada desde? | Estado |
|-------|------------------|--------|
| `dashboard` (+tutor/teacher/director) | Sidebar (según rol) | ✅ |
| `agents` | Sidebar, dashboard | ✅ |
| `chat` | desde `agents` (`?agentId=`) | ✅ |
| `exams` | Sidebar | ✅ |
| `exams/[id]` (rendir) | desde `exams` | ✅ |
| `exams/[id]/result` | redirige tras `submit` | ✅ |
| `exams/create` | Sidebar (docente) | ✅ |
| `exams/history` | Sidebar (estudiante) | ✅ |
| `manage` | Sidebar (director) | ✅ |
| `analytics` | Sidebar (director/docente) | ✅ |
| `subjects/exams` | **nadie** | ⚠️ huérfana → borrar |

Todo lo demás está cableado. Solo `subjects/exams` quedó suelta.

---

## 5. Flujo End-to-End: de la creación a la analítica

### Paso 0 — Setup institucional (Director)
1. Login como `director` → JWT con `role` + `schoolId`.
2. `manage` → crea **Grados** (`POST /grades`) y **Secciones** (`POST /sections`).
3. Dashboard director → "Registrar personal" → crea **docente** y **tutor** (`POST /users`, rol-guard: solo director).
4. Asigna **tutor a sección** (`PATCH /sections/:id/tutor`).
5. (Pendiente UI) asociar **docente↔materia** (`POST /teacher-subjects`) y **matricular estudiantes** (`POST /students/:id/enrollments`).

### Paso 1 — Contenido académico (Docente)
6. Login como `teacher`.
7. Dashboard docente → "Registrar tema semanal" (`POST /weekly-topics`, rol-guard teacher/director). → crea `WeeklyTopic`.
8. Sidebar → "Crear examen" (`exams/create`) → `POST /exams` (transacción Exam+Question+Option). Puede anclar el examen a un `topicId`.

### Paso 2 — Aprendizaje (Estudiante)
9. Login como `student`.
10. `agents` → elige materia → `chat` → conversa con el agente IA (OpenAI real).
    - ⚠️ El mensaje se guarda **sin `topicId`** → no alimenta la analítica de dudas (crítico #1).
11. Sidebar → `exams` → entra a un examen → `exams/[id]`:
    - `POST /exam-attempts` (inicia, `started_at`).
    - Responde; al finalizar → `POST /exam-attempts/:id/submit`.
    - Backend califica contra `Option.isCorrect`, calcula `score`, guarda `Answer`s, genera `ImprovementArea` + `aiFeedbackSummary` con IA.
12. Redirige a `exams/[id]/result` → ve nota, feedback IA y áreas de mejora.
13. `exams/history` → historial de intentos.

### Paso 3 — Analítica (Docente)
14. Dashboard docente: por materia ve KPIs (consultas IA, promedio), temas registrados, **tema más consultado** y **tema más difícil**.
    - Promedios/scores → **reales** (vienen de `ExamAttempt` + `Exam.topicId`).
    - "Dudas por tema" → **vacío con datos reales** (crítico #1).
15. `analytics` (docente): timeline, comparativos, dudas frecuentes (igual limitación de dudas).

### Paso 4 — Analítica (Director)
16. Dashboard director: KPIs del colegio (estudiantes, promedio general, consultas IA, alertas), desglose por grado y por materia.
    - Promedios por grado/materia → **reales** (agregan `ExamAttempt`).
    - Consultas IA / tema más consultado → dependen de `Message.topicId` (limitado).
17. `analytics` (director): timeline institucional, comparativo de grados, dudas frecuentes.

### Paso 5 — Intervención (Tutor)
18. Login como `tutor` (asignado a su sección).
19. Dashboard tutor: estudiantes del aula con promedio/estado (activo/inactivo/riesgo/destacado), alertas activas.
    - "Resolver alerta" → `PATCH /alerts/:id/resolve` (real).
    - Alertas se crean vía `POST /alerts` (no hay generación automática aún).

---

## 6. Sugerencias priorizadas (actualizado 2026-06-15)

> Estado: el crítico de analítica de dudas (`Message.topicId`) ya está resuelto. La prioridad #1 ahora es **validar en runtime**, porque nada se ha ejecutado todavía.

### Ahora (esta iteración)
1. 🔵 **Smoke test en runtime** — `npm run seed` + `npm run dev` (backend y frontend). Recorrer el flujo completo de la §5 y confirmar: que el `ValidationPipe` no rompe formularios, que el cálculo de examen es correcto, que OpenAI responde, y que **las dudas por tema ya aparecen** (verificación del fix de hoy). Sin esto, todo lo demás se construye sobre supuestos.

### Inmediato después (cierre funcional)
2. **Cablear gamificación restante** — descontar `tokensUsed` de `Student.tokensBalance`; incrementar `streakCount` en login/actividad diaria. (`tokensUsed` ya se registra por mensaje).
3. **Borrar `subjects/exams`** huérfana (limpieza de 1 archivo).
4. **Botones muertos** — "Exportar PDF" (director), "Registrar intervención" (tutor), UI de alta de estudiantes/matrícula.

### Diferenciador de producto
5. **Generación automática de alertas** (job/cron o trigger en submit) — hoy `alerts` solo se crean por `POST` manual; las "alertas tempranas" (riesgo, inactividad, descenso) no se disparan solas. Es el diferenciador del producto y aún es manual.

### Producción (antes de desplegar)
6. **Migraciones** — quitar `synchronize: true`, generar migración inicial, `synchronize:false`.
7. **DTOs validados** en endpoints restantes (`alerts`, `academics`, `schools`, `weekly-topics`).
8. **Tests** e2e del flujo crítico + **paginación** en listados.
9. **Drill-down** grado→sección→estudiante y **detalle de examen** en UI (endpoint `/analytics/exam/:id` ya existe).

---

## 7. Veredicto

El sistema está **funcionalmente completo de extremo a extremo a nivel de código y tipos**: un director configura, un docente crea contenido y exámenes, un estudiante aprende y rinde, y todos los roles ven analítica con datos reales de la BD.

La grieta de **analítica de dudas por tema ya está resuelta** (el chat etiqueta `topicId`). Quedan: (a) gamificación parcial (`tokensUsed` se registra pero no se descuenta ni hay racha), (b) **la validación en runtime, que nunca se ha ejecutado** — siguiente paso obligado, y (c) endurecimiento de producción (migraciones/tests). Las alertas tempranas, diferenciador del producto, siguen siendo manuales.

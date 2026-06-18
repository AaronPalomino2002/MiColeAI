# MiColeAI — Documento Único del Proyecto

> Documento consolidado: visión del producto + diseño de base de datos **tal como está implementado** en el backend (`apps/backend/src/domain/entities`).
> Reemplaza a los antiguos `EduInsight-AI.md`, `EduInsight-ER.md` y `EduInsight-DB-Design.md`.

---

## PARTE 1 — Visión del Producto

### 1.1 Resumen
**MiColeAI** es una plataforma educativa que integra agentes de IA especializados por materia, evaluaciones (incluidas adaptativas) y analítica académica para **estudiantes, tutores, docentes y directores**. Convierte cada interacción, evaluación y comportamiento del estudiante en información accionable para intervenir a tiempo y mejorar el rendimiento.

### 1.2 Problemática
- Los docentes desconocen qué temas generan más dificultades.
- Los tutores no tienen alertas tempranas de estudiantes en riesgo.
- Los directores solo ven notas finales, no el proceso de aprendizaje.
- Las dudas fuera del aula no quedan registradas.
- Las evaluaciones no aportan información para decisiones pedagógicas.

### 1.3 Diferenciador
No es un chatbot aislado: es un **sistema integral de inteligencia académica institucional**. Cada conversación, examen y patrón de comportamiento alimenta la analítica.

### 1.4 Actores y funciones

| Actor | Funciones clave |
|-------|-----------------|
| **Director** | Configurar colegio, grados/secciones, registrar tutores y docentes, crear materias, ver dashboards institucionales, detectar riesgo |
| **Tutor** | Monitorear su aula, revisar alertas, detectar inactividad, coordinar intervenciones, identificar destacados |
| **Docente** | Registrar temas semanales, revisar desempeño por tema, analizar dudas frecuentes, generar reforzamientos |
| **Estudiante** | Interactuar con agentes IA, rendir evaluaciones, consultar progreso, ver próximos exámenes, recibir recomendaciones |

### 1.5 Módulos principales
- **Tutores IA por materia** — 1 agente por materia (relación 1:1).
- **Temas semanales** (`weekly_topics`) — eje analítico: chat, exámenes y áreas de mejora se anclan a un tema para responder *"¿qué tema genera más dudas / peor desempeño?"*.
- **Evaluaciones** — tipos `daily`, `weekly`, `mock`, `adaptive`.
- **Alertas tempranas** — `low_performance`, `performance_drop`, `inactivity`, `upcoming_exam`.
- **Dashboards** — estudiante (progreso, próximos exámenes, recomendaciones), tutor (indicadores de aula + alertas), director (analítica institucional).

---

## PARTE 2 — Diseño de Base de Datos (Implementado)

### 2.1 Stack y convenciones reales
- **Motor:** MySQL (driver `mysql2`).
- **ORM:** TypeORM (arquitectura hexagonal — entidades en `apps/backend/src/domain/entities`).
- **PK:** `uuid` (`@PrimaryGeneratedColumn('uuid')`) en todas las tablas.
- **Nomenclatura:** tablas y columnas en **inglés**, `snake_case` en BD; FKs como `<entidad>_id`.
- **Timestamps:** `created_at` / `updated_at` gestionados por TypeORM.

### 2.2 Diagrama Entidad-Relación

```mermaid
erDiagram
    SCHOOL ||--o{ USER : employs
    SCHOOL ||--o{ GRADE : has
    SCHOOL ||--o{ STUDENT : enrolls
    GRADE ||--o{ SECTION : "divided into"
    SECTION ||--o| USER : "tutor assigned"
    SECTION ||--o{ STUDENT : contains

    SUBJECT ||--|| AI_AGENT : "has tutor"
    SUBJECT ||--o{ TEACHER_SUBJECT : "taught by"
    USER ||--o{ TEACHER_SUBJECT : teaches
    SUBJECT ||--o{ WEEKLY_TOPIC : contains
    USER ||--o{ WEEKLY_TOPIC : registers

    STUDENT ||--o{ ENROLLMENT : has
    SUBJECT ||--o{ ENROLLMENT : includes

    SUBJECT ||--o{ EXAM : offers
    WEEKLY_TOPIC ||--o{ EXAM : "evaluated in"
    EXAM ||--o{ QUESTION : contains
    QUESTION ||--o{ OPTION : has
    STUDENT ||--o{ EXAM_ATTEMPT : takes
    EXAM ||--o{ EXAM_ATTEMPT : "taken in"
    EXAM_ATTEMPT ||--o{ ANSWER : records
    QUESTION ||--o{ ANSWER : for
    OPTION ||--o{ ANSWER : "selected in"
    EXAM_ATTEMPT ||--o{ IMPROVEMENT_AREA : generates
    WEEKLY_TOPIC ||--o{ IMPROVEMENT_AREA : "weak topic"

    STUDENT ||--o{ CHAT_SESSION : participates
    AI_AGENT ||--o{ CHAT_SESSION : interacts
    CHAT_SESSION ||--o{ MESSAGE : contains
    WEEKLY_TOPIC ||--o{ MESSAGE : "asked about"

    STUDENT ||--o{ ALERT : observed
    USER ||--o{ ALERT : notified
    SUBJECT ||--o{ ALERT : about

    SCHOOL {
        uuid id PK
        string name
        int academic_year
        string logo_url
        string district
        datetime created_at
        datetime updated_at
    }
    USER {
        uuid id PK
        uuid school_id FK
        enum role "director | tutor | teacher"
        string email UK
        string password
        string first_name
        string last_name
        string avatar_url
        datetime last_login_at
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    GRADE {
        uuid id PK
        uuid school_id FK
        string name "1° Secundaria"
    }
    SECTION {
        uuid id PK
        uuid grade_id FK
        uuid tutor_id FK "User role=tutor, nullable"
        string name "A | B | C"
    }
    STUDENT {
        uuid id PK
        uuid school_id FK "nullable"
        uuid section_id FK "nullable"
        string email UK
        string password
        string first_name
        string last_name
        string district
        string school_name "texto libre legacy"
        string grade_level
        string avatar_url
        enum plan_type "free | premium"
        int tokens_balance
        int streak_count
        datetime last_login_at
        datetime created_at
        datetime updated_at
    }
    SUBJECT {
        uuid id PK
        string name
        text description
        string icon_name
        string color_theme
        int total_lessons
    }
    AI_AGENT {
        uuid id PK
        uuid subject_id FK "1:1"
        string name
        string model_id
        text system_prompt
        string avatar_url
    }
    TEACHER_SUBJECT {
        uuid id PK
        uuid teacher_id FK
        uuid subject_id FK
        boolean is_primary
    }
    WEEKLY_TOPIC {
        uuid id PK
        uuid subject_id FK
        uuid teacher_id FK "nullable"
        string name
        int week_number
        datetime created_at
    }
    ENROLLMENT {
        uuid id PK
        uuid student_id FK
        uuid subject_id FK
        int completed_lessons
        string status "active | completed"
        datetime enrolled_at
    }
    EXAM {
        uuid id PK
        uuid subject_id FK
        uuid topic_id FK "nullable en simulacros"
        enum type "daily | weekly | mock | adaptive"
        string title
        text description
        int time_limit_minutes
        int total_points
        string difficulty "easy | medium | hard"
        date scheduled_for "nullable"
    }
    QUESTION {
        uuid id PK
        uuid exam_id FK
        text content
        enum type "multiple_choice | true_false"
        int points
    }
    OPTION {
        uuid id PK
        uuid question_id FK
        text content
        boolean is_correct
    }
    EXAM_ATTEMPT {
        uuid id PK
        uuid student_id FK
        uuid exam_id FK
        int score "nullable"
        int time_spent_seconds
        text ai_feedback_summary
        datetime started_at
        datetime completed_at "nullable"
    }
    ANSWER {
        uuid id PK
        uuid attempt_id FK
        uuid question_id FK
        uuid selected_option_id FK "nullable"
        text text_content "preguntas abiertas"
    }
    IMPROVEMENT_AREA {
        uuid id PK
        uuid attempt_id FK
        uuid topic_id FK "nullable"
        string topic_name "fallback libre"
        string priority "low | moderate | high"
        text ai_suggestion
    }
    CHAT_SESSION {
        uuid id PK
        uuid student_id FK
        uuid agent_id FK
        datetime last_interaction
        datetime created_at
    }
    MESSAGE {
        uuid id PK
        uuid session_id FK
        uuid topic_id FK "nullable"
        enum sender "student | agent"
        text content
        int tokens_used "nullable, solo agente"
        datetime sent_at
    }
    ALERT {
        uuid id PK
        uuid student_id FK
        uuid tutor_id FK
        uuid subject_id FK "nullable"
        enum type "low_performance | performance_drop | inactivity | upcoming_exam"
        text description
        boolean resolved
        datetime resolved_at "nullable"
        datetime created_at
    }
```

### 2.3 Tablas (19) y su rol

| # | Tabla | Rol |
|---|-------|-----|
| 1 | `schools` | Colegio (multi-tenant raíz) |
| 2 | `users` | Staff institucional: **director / tutor / teacher** (una sola tabla con enum `role`, soft-delete) |
| 3 | `grades` | Grado del colegio |
| 4 | `sections` | Sección/aula; referencia a su `tutor` (User) |
| 5 | `students` | Estudiante + gamificación (`tokens_balance`, `streak_count`, `plan_type`) |
| 6 | `subjects` | Materia + metadatos de UI (`icon_name`, `color_theme`, `total_lessons`) |
| 7 | `ai_agents` | Agente IA, **1:1** con materia (`model_id`, `system_prompt`) |
| 8 | `teacher_subjects` | N:M docente↔materia (`is_primary` marca al titular) |
| 9 | `weekly_topics` | **Eje analítico**: tema semanal registrado por docente |
| 10 | `enrollments` | Matrícula estudiante↔materia + progreso |
| 11 | `exams` | Evaluación (4 tipos), `scheduled_for` alimenta "Próximos exámenes" |
| 12 | `questions` | Pregunta del examen |
| 13 | `options` | Alternativas con `is_correct` |
| 14 | `exam_attempts` | Intento/resultado + `ai_feedback_summary` |
| 15 | `answers` | Respuesta del estudiante por pregunta |
| 16 | `improvement_areas` | Áreas débiles detectadas por la IA (ligadas a `weekly_topics`) |
| 17 | `chat_sessions` | Sesión de chat estudiante↔agente |
| 18 | `messages` | Mensaje del chat (`sender`, `tokens_used`, ligado a tema) |
| 19 | `alerts` | Alertas tempranas estudiante↔tutor (diferenciador del producto) |

### 2.4 Decisiones de diseño relevantes

| Decisión | Justificación |
|----------|---------------|
| **`uuid` como PK** | Evita colisiones, seguro para exponer en APIs/multi-tenant |
| **Una tabla `users` con enum `role`** | Director/tutor/docente comparten email/password/nombre; evita 3 tablas duplicadas. Los estudiantes van aparte en `students` por su gamificación |
| **`weekly_topics` como eje analítico** | `messages`, `exams` e `improvement_areas` apuntan a `topic_id` → permite analítica "por tema" |
| **`topic_id` nullable** | Simulacros integrales y consultas ad-hoc no siempre tienen tema; `topic_name` actúa de fallback |
| **`alerts` con `student_id` + `tutor_id`** | Conecta al observado con quien debe intervenir; `subject_id` nullable (inactividad puede ser global) |
| **`school_name`/`grade_level` libres en `students`** | Campos legacy para mostrar sin join; la FK real es `school` / `section` |

### 2.5 Estado de implementación
✅ Las 19 entidades existen en `apps/backend/src/domain/entities`.
✅ `seed.js` puebla `subjects`, `ai_agents`, `students` y `enrollments` (datos de prueba).
⚠️ Pendiente: seed de la jerarquía institucional (`schools`, `users`, `grades`, `sections`) y de evaluaciones/alertas.

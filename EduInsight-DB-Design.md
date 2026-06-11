# EduInsight AI – Diseño de Base de Datos

## Convenciones

- Todas las tablas usan `id` como PK con `SERIAL` (autoincremental).
- Claves foráneas siguen el patrón `id_<tabla>`.
- Timestamps usan `TIMESTAMPTZ` (con zona horaria).
- Se usa PostgreSQL como motor de referencia.

---

## 1. COLEGIO

```sql
CREATE TABLE colegio (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(150)  NOT NULL,
    anio_academico INT          NOT NULL,
    logo_url      VARCHAR(300),
    distrito      VARCHAR(100),
    created_at    TIMESTAMPTZ   DEFAULT NOW()
);
```

---

## 2. DIRECTOR

```sql
CREATE TABLE director (
    id          SERIAL PRIMARY KEY,
    nombres     VARCHAR(100) NOT NULL,
    apellidos   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_colegio  INT NOT NULL REFERENCES colegio(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. GRADO

```sql
CREATE TABLE grado (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,   -- "1° Secundaria", "2° Secundaria"
    id_colegio  INT NOT NULL REFERENCES colegio(id) ON DELETE CASCADE
);
```

---

## 4. SECCION

```sql
CREATE TABLE seccion (
    id        SERIAL PRIMARY KEY,
    nombre    VARCHAR(10)  NOT NULL,    -- "A", "B", "C"
    id_grado  INT NOT NULL REFERENCES grado(id) ON DELETE CASCADE
);
```

---

## 5. TUTOR

```sql
CREATE TABLE tutor (
    id          SERIAL PRIMARY KEY,
    nombres     VARCHAR(100) NOT NULL,
    apellidos   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_seccion  INT NOT NULL REFERENCES seccion(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

> Un tutor está asignado a una sola sección.

---

## 6. DOCENTE

```sql
CREATE TABLE docente (
    id          SERIAL PRIMARY KEY,
    nombres     VARCHAR(100) NOT NULL,
    apellidos   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_colegio  INT NOT NULL REFERENCES colegio(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. MATERIA

```sql
CREATE TABLE materia (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    id_colegio  INT NOT NULL REFERENCES colegio(id) ON DELETE CASCADE
);
```

---

## 8. DOCENTE_MATERIA *(relación N:M)*

```sql
CREATE TABLE docente_materia (
    id_docente  INT NOT NULL REFERENCES docente(id) ON DELETE CASCADE,
    id_materia  INT NOT NULL REFERENCES materia(id) ON DELETE CASCADE,
    PRIMARY KEY (id_docente, id_materia)
);
```

---

## 9. AGENTE_IA

```sql
CREATE TABLE agente_ia (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  TEXT,
    model_id     VARCHAR(100),           -- ej: "claude-sonnet-4-6"
    system_prompt TEXT,
    id_materia   INT NOT NULL UNIQUE REFERENCES materia(id) ON DELETE CASCADE
);
```

> Relación 1:1 con `materia` (campo `UNIQUE` en `id_materia`).

---

## 10. ESTUDIANTE

```sql
CREATE TABLE estudiante (
    id            SERIAL PRIMARY KEY,
    nombres       VARCHAR(100) NOT NULL,
    apellidos     VARCHAR(100) NOT NULL,
    distrito      VARCHAR(100),
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_colegio    INT NOT NULL REFERENCES colegio(id) ON DELETE CASCADE,
    id_seccion    INT NOT NULL REFERENCES seccion(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 11. TEMA

```sql
CREATE TABLE tema (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(200) NOT NULL,
    semana      INT          NOT NULL,   -- número de semana del año académico
    id_materia  INT NOT NULL REFERENCES materia(id) ON DELETE CASCADE,
    id_docente  INT NOT NULL REFERENCES docente(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 12. INTERACCION

```sql
CREATE TABLE interaccion (
    id             SERIAL PRIMARY KEY,
    pregunta       TEXT        NOT NULL,
    respuesta      TEXT        NOT NULL,
    tokens_usados  INT,
    fecha_hora     TIMESTAMPTZ DEFAULT NOW(),
    id_estudiante  INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    id_agente      INT NOT NULL REFERENCES agente_ia(id) ON DELETE CASCADE,
    id_tema        INT REFERENCES tema(id) ON DELETE SET NULL
);
```

---

## 13. EVALUACION

```sql
CREATE TYPE tipo_evaluacion AS ENUM (
    'temas_dia',
    'semanal',
    'simulacro',
    'adaptativa'
);

CREATE TABLE evaluacion (
    id          SERIAL PRIMARY KEY,
    titulo      VARCHAR(200) NOT NULL,
    tipo        tipo_evaluacion NOT NULL,
    fecha       DATE         NOT NULL,
    id_materia  INT NOT NULL REFERENCES materia(id) ON DELETE CASCADE,
    id_tema     INT REFERENCES tema(id) ON DELETE SET NULL
);
```

---

## 14. PREGUNTA_EVALUACION

```sql
CREATE TABLE pregunta_evaluacion (
    id              SERIAL PRIMARY KEY,
    enunciado       TEXT    NOT NULL,
    opcion_a        TEXT    NOT NULL,
    opcion_b        TEXT    NOT NULL,
    opcion_c        TEXT,
    opcion_d        TEXT,
    respuesta_correcta CHAR(1) NOT NULL,   -- 'A', 'B', 'C' o 'D'
    id_evaluacion   INT NOT NULL REFERENCES evaluacion(id) ON DELETE CASCADE
);
```

---

## 15. RESULTADO_EVALUACION

```sql
CREATE TABLE resultado_evaluacion (
    id                 SERIAL PRIMARY KEY,
    nota               DECIMAL(5,2) NOT NULL,
    tiempo_empleado    INT          NOT NULL,   -- en segundos
    num_intentos       INT          DEFAULT 1,
    preguntas_falladas INT          DEFAULT 0,
    fecha              DATE         NOT NULL DEFAULT CURRENT_DATE,
    id_estudiante      INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    id_evaluacion      INT NOT NULL REFERENCES evaluacion(id) ON DELETE CASCADE
);
```

---

## 16. ALERTA

```sql
CREATE TYPE tipo_alerta AS ENUM (
    'bajo_rendimiento',
    'descenso_desempeno',
    'inactividad',
    'evaluacion_proxima'
);

CREATE TABLE alerta (
    id             SERIAL PRIMARY KEY,
    tipo           tipo_alerta NOT NULL,
    descripcion    TEXT        NOT NULL,
    resuelta       BOOLEAN     DEFAULT FALSE,
    fecha          TIMESTAMPTZ DEFAULT NOW(),
    id_estudiante  INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    id_tutor       INT NOT NULL REFERENCES tutor(id) ON DELETE CASCADE
);
```

---

## 17. PROGRESO_ESTUDIANTE *(vista materializada)*

Tabla derivada para acelerar los dashboards.

```sql
CREATE TABLE progreso_estudiante (
    id              SERIAL PRIMARY KEY,
    id_estudiante   INT NOT NULL REFERENCES estudiante(id) ON DELETE CASCADE,
    id_materia      INT NOT NULL REFERENCES materia(id) ON DELETE CASCADE,
    promedio_nota   DECIMAL(5,2),
    total_evaluaciones INT DEFAULT 0,
    total_interacciones INT DEFAULT 0,
    ultima_actividad TIMESTAMPTZ,
    UNIQUE (id_estudiante, id_materia)
);
```

> Se recalcula mediante trigger o job periódico cada vez que hay un nuevo `resultado_evaluacion` o `interaccion`.

---

## Índices Recomendados

```sql
-- Consultas frecuentes por estudiante
CREATE INDEX idx_interaccion_estudiante  ON interaccion(id_estudiante);
CREATE INDEX idx_resultado_estudiante    ON resultado_evaluacion(id_estudiante);
CREATE INDEX idx_alerta_estudiante       ON alerta(id_estudiante);
CREATE INDEX idx_alerta_tutor            ON alerta(id_tutor);

-- Filtros por materia y tema
CREATE INDEX idx_tema_materia            ON tema(id_materia);
CREATE INDEX idx_interaccion_tema        ON interaccion(id_tema);
CREATE INDEX idx_evaluacion_materia      ON evaluacion(id_materia);

-- Progreso por sección (dashboard tutor)
CREATE INDEX idx_estudiante_seccion      ON estudiante(id_seccion);
```

---

## Diagrama de Tablas (resumen)

```
colegio
  ├── director
  ├── grado
  │     └── seccion
  │           ├── tutor
  │           └── estudiante ──── interaccion ──── agente_ia
  │                          ├─── resultado_evaluacion
  │                          └─── alerta ──────────── tutor
  ├── materia ──── agente_ia (1:1)
  │          ├──── docente_materia ──── docente
  │          ├──── tema ──────────────── docente
  │          └──── evaluacion
  │                    └── pregunta_evaluacion
  └── docente
```

---

## Notas de Diseño

| Decisión | Justificación |
|----------|---------------|
| `SERIAL` como PK | Simple, compatible con ORMs como Prisma y Drizzle |
| `ON DELETE CASCADE` en hijos directos | Si se elimina un colegio, se limpian todos sus datos |
| `ON DELETE SET NULL` en referencias opcionales | Permite conservar el historial si se reasigna un tutor o docente |
| `ENUM` para `tipo_evaluacion` y `tipo_alerta` | Evita inserciones inválidas sin tabla de catálogo extra |
| `progreso_estudiante` como tabla precalculada | Evita queries pesados en los dashboards de tutor y director |
| `UNIQUE (id_estudiante, id_materia)` en progreso | Garantiza un único registro de progreso por combinación |

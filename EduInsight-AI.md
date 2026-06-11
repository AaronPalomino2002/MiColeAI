# EduInsight AI – Plataforma de Inteligencia Académica para Colegios

## 1. Resumen Ejecutivo

**EduInsight AI** es una plataforma educativa inteligente que integra agentes de Inteligencia Artificial especializados por materia, evaluaciones adaptativas y analítica académica para estudiantes, tutores, docentes y directores.

Su propósito es transformar la información generada diariamente por los estudiantes en conocimiento accionable que permita intervenir oportunamente y mejorar el rendimiento académico.

---

## 2. Problemática Actual

Los colegios enfrentan los siguientes desafíos:

- Los docentes desconocen qué temas generan más dificultades.
- Los tutores no cuentan con alertas tempranas sobre estudiantes en riesgo.
- Los directores solo visualizan notas finales y no el proceso de aprendizaje.
- Las dudas de los estudiantes fuera del aula no quedan registradas.
- Las evaluaciones no proporcionan información para tomar decisiones pedagógicas.

> Las intervenciones ocurren demasiado tarde.

---

## 3. Propuesta de Valor

La plataforma permitirá:

- Brindar apoyo académico personalizado mediante agentes IA especializados.
- Registrar todas las interacciones de aprendizaje.
- Identificar patrones de dificultad por estudiante, aula y colegio.
- Detectar estudiantes con riesgo académico de manera temprana.
- Proporcionar herramientas de seguimiento para tutores y directores.
- Generar decisiones pedagógicas basadas en evidencia.

---

## 4. Objetivos del Sistema

### Objetivo General

Desarrollar una plataforma educativa basada en Inteligencia Artificial que permita mejorar el aprendizaje estudiantil mediante tutorías inteligentes, evaluaciones adaptativas y analítica académica institucional.

### Objetivos Específicos

- Automatizar el acompañamiento académico mediante agentes IA.
- Monitorear el progreso académico de cada estudiante.
- Facilitar la detección temprana de dificultades de aprendizaje.
- Proporcionar dashboards para directores, tutores y docentes.
- Identificar temas recurrentes de dificultad.
- Promover intervenciones pedagógicas oportunas.

---

## 5. Actores del Sistema

### Director / Administrador

Responsable de la configuración y supervisión institucional.

**Funciones:**
- Configurar el colegio.
- Crear grados y secciones.
- Registrar tutores y docentes.
- Crear materias y asociar docentes.
- Visualizar dashboards institucionales.
- Detectar estudiantes en riesgo.
- Analizar tendencias académicas.

---

### Tutor

Responsable del seguimiento de un aula.

**Funciones:**
- Monitorear estudiantes asignados.
- Revisar alertas académicas.
- Detectar inactividad.
- Coordinar intervenciones.
- Identificar estudiantes destacados.

---

### Docente

Responsable de una materia específica.

**Funciones:**
- Registrar temas semanales.
- Revisar desempeño por tema.
- Analizar dudas frecuentes.
- Identificar contenidos complejos.
- Generar reforzamientos.

---

### Estudiante

Usuario final del sistema.

**Funciones:**
- Interactuar con agentes IA.
- Resolver dudas y rendir evaluaciones.
- Consultar su progreso.
- Gestionar próximos exámenes.
- Recibir recomendaciones personalizadas.

---

## 6. Datos Maestros del Colegio

### Colegio

| Campo             | Ejemplo      |
|-------------------|--------------|
| Nombre            | PAMER        |
| Año Académico     | 2026         |
| Logo institucional| —            |
| Distritos         | —            |

---

### Grados

- 1° Secundaria
- 2° Secundaria
- 3° Secundaria
- 4° Secundaria
- 5° Secundaria

---

### Secciones

Cada grado puede tener múltiples secciones.

| Grado           | Secciones       |
|-----------------|-----------------|
| 1° Secundaria   | A, B, C, D, E   |
| 2° Secundaria   | A, B, C, D, E   |

---

### Tutores por Aula

| Aula | Tutor        |
|------|--------------|
| 1° A | María López  |
| 1° B | Carlos Rojas |
| 2° A | Ana Torres   |

---

### Materias

- Matemática
- Comunicación
- Física
- Química
- Biología
- Historia
- Inglés
- Literatura
- Razonamiento Matemático
- Razonamiento Verbal

---

### Docentes por Materia

| Materia    | Docente    |
|------------|------------|
| Matemática | Juan Pérez |
| Física     | Rosa Díaz  |
| Inglés     | Luis Vega  |

---

## 7. Registro de Estudiantes

Cada estudiante se registra una única vez.

### Datos Personales

- Nombres y Apellidos
- Distrito

### Datos Académicos

| Campo   | Ejemplo          |
|---------|------------------|
| Colegio | PAMER            |
| Grado   | 3° Secundaria    |
| Sección | B                |
| Tutor   | Carlos Rojas     |

---

## 8. Agentes IA por Materia

Cada materia contará con un agente especializado.

| Materia    | Agente IA     |
|------------|---------------|
| Matemática | MateIA        |
| Física     | FisiTutor     |
| Química    | QuimiBot      |
| Inglés     | English Coach |
| Historia   | HistoriIA     |

### Funciones del Agente

- Resolver dudas y explicar conceptos.
- Adaptar el nivel de dificultad.
- Generar ejercicios y ejemplos.
- Recomendar repasos.
- Preparar evaluaciones.

---

## 9. Gestión de Temas Académicos

Los docentes registran los temas trabajados semanalmente para que el agente IA conozca exactamente el contenido que el estudiante está aprendiendo.

**Ejemplo – Matemática:**

| Semana   | Temas                                              |
|----------|----------------------------------------------------|
| Semana 1 | Factorización, Productos notables, Ecuaciones lineales |
| Semana 2 | Inecuaciones, Polinomios                           |

---

## 10. Interacciones Inteligentes

El estudiante puede realizar consultas como:

> "No entiendo cómo resolver una factorización."

> "Explícame productos notables como si tuviera 13 años."

> "Dame cinco ejercicios sobre ecuaciones lineales."

> "Evalúame sobre los temas de esta semana."

---

## 11. Módulo de Evaluaciones

### Tipos de Evaluación

| Tipo                    | Descripción                              |
|-------------------------|------------------------------------------|
| Temas del día           | Evaluaciones inmediatas                  |
| Temas semanales         | Consolidación del aprendizaje            |
| Simulacros              | Evaluaciones integrales                  |
| Evaluaciones adaptativas| Generadas según errores frecuentes       |

### Información Registrada

- Nota obtenida
- Tiempo empleado
- Número de intentos
- Preguntas falladas
- Evolución histórica

---

## 12. Dashboard del Estudiante

| Sección                 | Detalle                                     |
|-------------------------|---------------------------------------------|
| Bienvenida personalizada| "Hola, bienvenido nuevamente."              |
| Próximos exámenes       | Matemática – Viernes / Física – Lunes       |
| Progreso por materia    | Matemática 82% / Física 70% / Inglés 91%   |
| Recomendaciones IA      | "Sugerimos reforzar productos notables."    |
| Historial de evaluaciones| Registro de todas las evaluaciones         |
| Evolución académica     | Gráfico de progreso en el tiempo            |

---

## 13. Dashboard del Tutor

### Indicadores del Aula

| Indicador              | Descripción                            |
|------------------------|----------------------------------------|
| Total de estudiantes   | Cantidad total del aula                |
| Estudiantes activos    | Con actividad reciente                 |
| Estudiantes inactivos  | Sin actividad reciente                 |
| Estudiantes en riesgo  | Bajo rendimiento o descenso sostenido  |
| Estudiantes destacados | Alto rendimiento y constancia          |

### Alertas

- Bajo rendimiento.
- Descenso de desempeño.
- Falta de interacción.
- Próximas evaluaciones.

---

## 14. Dashboard del Director

Vista global del colegio con analítica institucional.

| Indicador                  | Pregunta clave                              |
|----------------------------|---------------------------------------------|
| Uso de agentes IA          | ¿Cuáles son los cursos más consultados?     |
| Temas más preguntados      | ¿Qué contenidos generan más dudas?          |
| Preguntas frecuentes       | ¿Cuáles son las consultas recurrentes?      |
| Rendimiento por grado      | Comparativo institucional                   |
| Rendimiento por sección    | Identificación de brechas                   |
| Rendimiento por materia    | Detección de oportunidades de mejora        |

---

## 15. Analítica Docente

El sistema permite identificar:

- Temas complejos con mayor tasa de errores.
- Materias con mayores consultas al agente IA.
- Patrones de dificultad recurrentes.
- Necesidades de reforzamiento por grupo.

> Esta información tiene fines de **mejora pedagógica** y no sancionadores.

---

## 16. Analítica Estudiantil

### Estudiantes Destacados

Identificados por:
- Mejores notas.
- Constancia en el uso del sistema.
- Mejora continua.

### Estudiantes en Riesgo

Identificados por:
- Bajo rendimiento.
- Escasa participación.
- Descenso sostenido de notas.
- Alta tasa de errores.

---

## 17. Sistema de Alertas Tempranas

El sistema genera recomendaciones automáticas. Ejemplos:

> "Juan presenta una disminución sostenida en Matemática durante las últimas tres semanas. Se recomienda intervención del tutor."

> "María no interactúa con el agente IA desde hace diez días."

---

## 18. Diferenciador del Proyecto

La mayoría de soluciones educativas incorporan chatbots aislados.

**EduInsight AI** convierte cada conversación, evaluación y comportamiento del estudiante en información estratégica para la mejora continua del aprendizaje.

No es únicamente una plataforma de tutoría con IA.

> Es un **sistema integral de inteligencia académica institucional**.

---

## 19. Beneficios Esperados

| Actor      | Beneficios                                                                 |
|------------|----------------------------------------------------------------------------|
| Estudiante | Aprendizaje personalizado, autonomía, preparación constante, retroalimentación inmediata |
| Tutor      | Seguimiento efectivo, intervención temprana, gestión simplificada          |
| Docente    | Información basada en evidencia, identificación de dificultades, mejora continua |
| Director   | Visibilidad institucional, decisiones oportunas, optimización pedagógica   |

---

## 20. Visión del Proyecto

Convertirse en la **principal plataforma de inteligencia académica para instituciones educativas de Latinoamérica**, integrando Inteligencia Artificial, analítica educativa y acompañamiento personalizado para potenciar el aprendizaje y la toma de decisiones pedagógicas.

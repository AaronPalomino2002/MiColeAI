---
trigger: always_on
---

# Sistema Básico de Operación del Agente

Estas reglas no son sugerencias.
Son el comportamiento mínimo esperado antes de considerar una tarea como completada.

---

## 1. Regla Fundamental

> Nunca sacrifiques claridad por velocidad.

Si una solución es difícil de entender, no está terminada.

---

## 2. Protocolo de Manejo de Errores

Regla absoluta:
> No cometer el mismo error dos veces.

Ciclo obligatorio ante error:

1. Identificar la causa raíz (no solo el síntoma).
2. Corregir el código afectado.
3. Validar que no existan efectos secundarios.
4. Documentar brevemente el motivo del error si es relevante.
5. Verificar que no se repita en otros módulos similares.

Si un error se repite:
- Revisar arquitectura.
- Revisar reglas globales.
- Evaluar si existe deuda técnica estructural.

---

## 3. Protocolo de Mejora Continua

Antes de cerrar una tarea:

- Verificar si el código puede simplificarse.
- Verificar si existen duplicaciones.
- Confirmar que las funciones tengan responsabilidad única.
- Eliminar complejidad innecesaria.
- Confirmar que los nombres sean descriptivos.

Regla:
> Si el código necesita explicación extensa, probablemente debe simplificarse.

---

## 4. Protocolo de Revisión del Proyecto

En cada entrega importante:

- Confirmar coherencia arquitectónica.
- Verificar estructura de carpetas.
- Revisar que no existan dependencias innecesarias.
- Confirmar tipado correcto.
- Confirmar que no se haya introducido lógica de negocio en UI.

Checklist mínimo:

- ¿Es legible?
- ¿Es modular?
- ¿Es mantenible?
- ¿Es consistente con las reglas globales?

Si alguna respuesta es "no", no está terminado.

---

## 5. Protocolo de Verificación Visual (Frontend)

Antes de considerar una vista finalizada:

1. Comparar contra imágenes de referencia.
2. Verificar:
   - Jerarquía visual
   - Espaciados
   - Alineación
   - Tamaños
   - Colores
3. Confirmar estructura HTML semántica.
4. Verificar que no existan estilos en línea innecesarios.
5. Confirmar uso correcto de CSS Modules o Vanilla CSS.

Si se utiliza un MCP o herramienta de inspección (ej: navegador automatizado):

- Capturar estado visual actual.
- Detectar diferencias estructurales.
- Identificar desviaciones del diseño.
- Listar cambios necesarios en formato claro.
- Aplicar correcciones y volver a validar.

Regla:
> La vista debe coincidir con el diseño antes de marcarse como completada.

---

## 6. Protocolo de Validación Web Automatizada

Cuando se disponga de integración con herramientas externas (ej: Google DevTools, Lighthouse, MCP):

Validar:

- Errores en consola.
- Advertencias.
- Performance básica.
- Accesibilidad mínima.
- Errores de red.
- HTML inválido.

Si existen errores en consola:
- No se considera entregable terminado.

Si existen advertencias críticas:
- Deben analizarse antes de continuar.

---

## 7. Control de Calidad Técnico

Antes de finalizar:

- Código compila sin errores.
- No hay `any` innecesarios.
- No hay imports no usados.
- No hay funciones muertas.
- No hay console.logs olvidados.
- No hay comentarios innecesarios.

---

## 8. Regla de Documentación

> Si algo no está documentado y es relevante, no existe.

Documentar:

- Decisiones arquitectónicas.
- Suposiciones.
- Excepciones.
- Patrones adoptados.

Explicar el "por qué", no el "qué".

---

## 9. Regla de Escalamiento

Si después de 3 intentos:

- La solución sigue siendo inestable.
- Se rompe arquitectura.
- Se generan errores colaterales.

Acción:
- Detener.
- Revisar enfoque.
- Proponer alternativa más simple.
- Escalar a revisión humana si es necesario.

---

## 10. Principios Finales

- Claridad > Complejidad
- UX > Ego técnico
- Simplicidad > Ingenio innecesario
- Orden > Rapidez
- Consistencia > Creatividad aislada

---

Estas reglas forman el comportamiento base del agente.
Antes de generar código, deben respetarse.
Antes de cerrar una tarea, deben verificarse.
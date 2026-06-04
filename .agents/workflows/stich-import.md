---
description: # Workflow: Importación Automática desde Stitch MCP
---

# Workflow: Importación Stitch → Validación → Conversión a React + TypeScript

## Objetivo

Conectarse al MCP de Stitch para importar HTML e imágenes,
validar integridad técnica y visual,
y posteriormente convertir las vistas a React + TypeScript
dentro de `apps/frontend`.

Este flujo prioriza:

- Legibilidad
- Orden
- Fidelidad visual
- Estructura mantenible
- Conversión segura y progresiva

---

# Proyecto

Title: Student Registration and Login
ID: 8088926255099658878

---

# Pantallas a Procesar

1. Requirements Tab  

## Screens:
1. Student Registration and Login
    ID: 08b5e90dfc364aea81580fc27d4c6c06

2. Timed Exam Interface Room
    ID: 13f9a1acb2744d04bc5d88d71a9e34e0

3. AI Study Agent Chat Interface
    ID: 1c99c2d987ad49979bcaa8ecf41ae976

4. Student Dashboard Home
    ID: 3acebc2c2c554ad1b5d2e62b35b65b1e

5. Admin Progress Analytics Dashboard
    ID: 894ba08891b64a41a19463bef3749148

6. Exam Encouragement and Feedback Screen
    ID: 8dcab030230145d3b63d3506382caa84

7. Exam Success Celebration Screen
    ID: 99920ee274714c0aa4a4a53157040072

8. Admin Progress Analytics Dashboard
    ID: a218acb8f521442393efccba9e1c5cb7

9. Subject Exams and Tests
    ID: a2c19862c108478d8880eb4dc1780bbb

10. Virtual Classroom Exam Center
    ID: c57219c796054f4fb21ab78eef1beb20

11. Study Agents Selection
    ID: f6111a56fdbc4243ace65f1d913e8ef6

12. Admin Progress Analytics Dashboard
    ID: fc1760b55334408d9ca1cc4f5db4d521

13. Admin Detailed Evaluation Insights
    ID: fdc30322c29a48c498e320c9e65584f3

Use a utility like `curl -L` to download the hosted URLs.

# Fase 1 — Importación desde Stitch MCP

Para cada pantalla:

## 1. Obtener HTML

- Conectarse al MCP de Stitch.
- Descargar HTML completo.
- Validar que no esté truncado.
- Confirmar estructura válida.
- No modificar clases ni jerarquía.

Reintentar hasta 3 veces si falla.

---

## 2. Descargar Imágenes

Detectar URLs dentro del HTML:

Descargar con:

curl -L <URL> -o <ruta_local>

Guardar en:

stitch-import/images/<screen-name>/

Validar:

- Sin 404
- Tamaño válido
- Archivo no corrupto

Registrar errores sin detener el flujo.

---

## 3. Crear Estructura (donde a,b,c,d son las pantallas)

Generar:

stitch-import/
 <screen-a>.html
 <screen-b>.html
 <screen-c>.html
 ...
 images/
  <screen-a>/
  <screen-b>/
  <screen-c>/


---

## 4. Ajustar Rutas

Reemplazar URLs remotas por rutas locales:

ANTES:
<img src="remote-url">

DESPUÉS:
<img src="./images/<screen-name>/file.png">


No alterar HTML estructural.

---

# Fase 2 — Validación HTML + CSS

Antes de convertir:

## Validación Técnica

- Abrir HTML en navegador.
- Revisar consola:
  - Sin errores JS
  - Sin errores de red
- Verificar que todas las imágenes cargan.
- Confirmar layout visual correcto.

## Validación CSS

- Confirmar que estilos se aplican.
- No hay conflictos visibles.
- Estructura semántica intacta.

Si falla:

1. Corregir rutas o recursos.
2. Revalidar.
3. Documentar ajustes.

No avanzar hasta que la vista sea estable.
Y el usuario confirme para proceder a la FASE 3

---

# Fase 3 — Conversión a NextJs + TypeScript

Solo iniciar cuando HTML esté validado.

Destino:

apps/frontend/

---

## 1. Crear estructura React

Para cada pantalla:

apps/frontend/app/<route-name>/
 page.tsx
 <RouteName>.module.css
 components/
 assets/

Si requiere layout compartido:

apps/frontend/app/<route-name>/layout.tsx

No usar arquitectura basada en features/.
Usar estructura oficial App Router.

---

## 2. Convertir HTML → JSX

Reglas:

   -Mantener jerarquía original.

   -Convertir atributos a JSX (class → className, for → htmlFor).

   -Tipado estricto TypeScript.

   -No reinterpretar diseño.

   -No modificar estructura visual.

   -Eliminar scripts inline.

---

## 3. CSS

- Migrar estilos a CSS Modules.

- Archivo: <RouteName>.module.css

- Mantener nombres claros.

- Evitar estilos inline.

- No alterar fidelidad visual.

---

## 4. Assets

- Reemplazar <img> por el componente next/image.

- Importar correctamente el componente Image.

- Configurar width y height cuando sea necesario.

- Usar rutas relativas hacia assets/.

- Mover imágenes a:

- apps/frontend/app/<route-name>/assets/

- Actualizar rutas correspondientes.

---

## 5. Validación React

- Proyecto compila sin errores TypeScript.

- Sin warnings críticos.

- Vista renderiza igual al HTML original.

- Sin errores en consola.

- Sin errores de hidratación.

- Build exitoso.

---

# Validación Global Final

Checklist obligatorio:

- HTML importado correctamente.

- Imágenes locales verificadas.

- Rutas corregidas.

- Validación visual aprobada.

- Conversión a Next.js exitosa.

- Compilación limpia.

- Tipado correcto.

- Estructura App Router respetada.

- Fidelidad visual preservada.

- Si alguna falla:

- Repetir ciclo correspondiente.

---

# Manejo de Errores

Regla absoluta:

Nunca repetir el mismo error.

Ciclo:

1. Diagnosticar causa raíz.
2. Corregir.
3. Verificar.
4. Documentar si es relevante.

Tras 3 fallos:

- Detener.
- Reportar.
- Escalar.

---

# Alcance del Workflow

Incluye:

- Importación Stitch
- Descarga assets
- Validación HTML/CSS
- Conversión a Next.js + TypeScript (App Router)
- Validación de compilación

No incluye:

- Refactor avanzado
- Optimización arquitectónica
- Cambios de diseño

---

# Regla Fundamental

Fidelidad primero.
Orden siempre.
Conversión segura.
Validación obligatoria.

No avanzar sin estabilidad.

---
name: ceiba-paginas
description: >-
  Cómo usar los skills de diseño guardados en este repo para que las páginas de Ceiba Labs y las de sus
  clientes (lib/templates/clinica.js, src/*.html) se vean hechas a mano y no «hechas por IA». Úsalo antes
  de diseñar, rediseñar, pulir o revisar cualquier página, sección, plantilla, animación o texto de una
  página de Ceiba o de un cliente.
---

# Páginas de Ceiba: qué skill usar y qué cambia para nosotros

Estos skills vienen de repos públicos con licencia MIT (cada carpeta trae su LICENSE). Se guardaron solo los
textos y los recursos de animación; sus scripts de verificación, hooks y fotos de muestra no se copiaron.

| Para | Usa | Lo que más sirve |
|---|---|---|
| Animaciones y micro-interacciones | `design-taste-frontend` → `references/motion.md`, `assets/motion/` (motion.css, motion.js), `references/moments.md` y `assets/moments/` | Entrada del hero una sola vez, capa de hover (tarjeta sube 2px, foto 1.02–1.03, botón 1px), un «momento» por página con fotos; tiempos y curvas exactos; reduced-motion |
| Estructura y secciones de una página de negocio | `design-taste-frontend` → `references/layout-v4.md`, `sections.md`, `cards.md`, `photos.md`, `system.md` | Una sección por pantalla, bordes iguales, fotos reales, sistema de tamaños |
| Que no parezca hecho por IA | `avoid-ai-design` (catálogo de señales), `no-slop-ui` (patrones prohibidos y paletas), `antislop-ui` | Lista de «tells» para auditar: gradientes, glassmorphism, tarjetas iguales, íconos genéricos… |
| Textos | `antislop-copywriting`, `design-taste-frontend` → `references/copy*.md` | Frases concretas, sin muletillas de agencia |
| Celular y accesibilidad | `antislop-layoutmobile`, `antislop-human` (WCAG, contraste; trae un `contrast-check.py` local) | Áreas táctiles, contraste, foco visible |
| Proceso de diseño completo | `design-guide` | Elegir una dirección, fijar un contrato de diseño, construir y revisar (sus scripts de vista previa no se copiaron: presenta el resultado como hagas normalmente) |

## Reglas de Ceiba que mandan sobre los skills

1. **Datos reales del cliente.** Algunos skills piden contactos en `.example`, sin teléfono real ni número de casa: eso es para demos. En las páginas de clientes van su teléfono, WhatsApp, dirección y horario reales. Nunca inventar datos, reseñas ni cifras (igual que la rutina en `ops/rutina-propuesta.md`).
2. **Sin efectos de shader ni escenas 3D** en páginas de negocios locales (clínicas, estéticas, restaurantes): fotos, tipografía y la capa de hover. Coincide con la regla 8 de `design-taste-frontend`.
3. **Ligero.** Las páginas de clientes cargan rápido en celular: nada de librerías pesadas de animación; CSS y el JS mínimo. Solo `transform`, `opacity` (y `clip-path`/`filter` dentro de un momento). Siempre `prefers-reduced-motion`.
4. **Sin animar al hacer scroll** salvo el único momento de la página (nada de tarjetas que aparecen al bajar, parallax de texto ni scroll-jacking).
5. **Español claro, de tú**, como el resto del sitio; nada de palabras de agencia.
6. **La plantilla manda.** Las páginas de clientes salen de `lib/templates/clinica.js` con el JSON de `site_content`: los cambios de diseño se hacen en la plantilla (para todos) y respetan sus temas (`page.theme`).
7. **Antes de entregar**, audita con el catálogo de `avoid-ai-design` y la lista de `no-slop-ui/examples/review-checklist.md`, y revisa a 1440, 768 y 390 px.

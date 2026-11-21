---
name: ceiba-seo
description: Cómo hacer SEO y visibilidad en IA (Google, ChatGPT, Gemini, Perplexity, Claude) en Ceiba Labs, primero en ceibalabs.io y después en las páginas de los clientes por plan (Esencial, Negocio, Avanzado). Úsalo antes de auditar, corregir títulos, escribir textos para buscadores, agregar datos estructurados, armar páginas por servicio o zona, preparar la prueba en IA o el reporte mensual de un cliente, o cuando alguien pregunte «por qué no aparecemos en Google o en ChatGPT». Une los skills seo-roast, seo-title-optimization, unslop-seo, customer-journey, internal-linking y blitz-seo con el código de este repo y con el SEO local de negocios en México y Latinoamérica.
---

# SEO de Ceiba Labs

Los skills que vienen de Illyism/seo-skills (MIT) están pensados para productos de software en Next.js. Este skill los traduce a cómo está hecho Ceiba y a negocios locales. Úsalos como procedimiento y este archivo como mapa.

| Skill | Para qué lo usamos aquí |
|---|---|
| `seo-roast` | Auditoría en orden de impacto: lo que bloquea (FATAL), lo que impide posicionar o convertir (REVENUE), autoridad y visibilidad en IA (COMPOUNDING) y lo cosmético al final. Siempre termina en arreglos, no en una lista. |
| `seo-title-optimization` | Títulos, descripciones y que el H1 diga lo mismo que el título. |
| `unslop-seo` | Que cada sección responda en sus primeras 40 palabras, con encabezados en forma de pregunta del cliente y sin frases de relleno. Es lo que hace que la IA nos cite. |
| `customer-journey` | Las preguntas reales que hace la gente a Google y a la IA en cada etapa. De aquí sale la lista de preguntas para la prueba en IA. |
| `internal-linking` | Enlaces internos de las páginas que reciben visitas hacia las que convierten. |
| `blitz-seo` | Un sprint de 30 días sobre una sola página que importa (la de dinero). |

No usamos `directory-submissions`, `vs-and-alternatives`, `block-ai-scrapers` ni los que dependen de servicios pagados (AI SEO Tracker, Ahrefs, DataForSEO, LinkDR): son para software o van contra lo que queremos (que la IA nos lea).

## Reglas que no se rompen

1. **No inventar datos.** Precios, años, reseñas, calificaciones, horarios, cédulas: solo si existen. Si falta, se omite y se anota. Nunca escribir reseñas ni poner calificación que no venga de Google.
2. **Abiertos a la IA.** `robots.txt` deja pasar a GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Bingbot y los demás. Bing alimenta a ChatGPT y Copilot: no se bloquea nunca.
3. **Un solo dato, una sola fuente.** Si un precio o una cifra aparece en la página, en el JSON-LD y en `llms.txt`, sale del mismo lugar (en Ceiba: `lib/catalog.js`; en clientes: `site_content.page`).
4. **Español claro de México**, de tú, sin «potencia», «eleva», «soluciones integrales». En textos públicos de Ceiba no hablar de «pesos»: los precios salen en la moneda de cada país.
5. **Fatal primero.** No se corrigen textos alternativos mientras haya una página de dinero sin indexar o sin título que diga qué ofrece.

## 1. ceibalabs.io

### Dónde vive cada cosa
- Títulos, descripciones, canónicos, Open Graph y el grafo JSON-LD (Organization, WebSite, WebPage, BreadcrumbList, Service con precios y FAQPage): `site_seo.py` (`PAGES` y `head()`), aplicado por `build.py`.
- `robots.txt`, `sitemap.xml` y `llms.txt`: `site_seo.py` (`robots_txt`, `sitemap_xml`, `llms_txt`). El sitemap lista solo las páginas públicas de `PAGES` más los legales.
- Preguntas frecuentes del JSON-LD: salen de los `<details><summary>` visibles de cada página (`faqs()`). Si se cambia una pregunta en la página, el JSON-LD se actualiza solo.
- Páginas: `src/inicio.html` (/), `src/webs.html` (/webs), `src/ia.html` (/ia), `src/webs-clinicas.html` (/webs/clinicas), `src/empezar.html` (/empezar, `noindex`: es el embudo, no se posiciona).
- Imágenes para compartir: `scripts/og-images.cjs`. Logo para buscadores: `/img/ceiba-icono.png`.
- Rutas limpias: `vercel.json` (rewrites). Una página nueva necesita su rewrite, su entrada en `PAGES` y en el sitemap.

### Páginas de dinero y su conversión
| Página | Busca | Conversión |
|---|---|---|
| `/webs` | «página web para negocio», «páginas web por suscripción», «diseño web [ciudad]» | Caja para empezar → `/empezar` → `/api/lead` (source `empezar`) |
| `/webs/clinicas` (y las que vengan por giro) | «página web para dentista», «página web para restaurante» | Formulario → `/api/lead` |
| `/ia` | «asistente de WhatsApp con IA», «automatizar con IA mi negocio» | Formulario → `/api/lead` (source `ia`) |
| `/` | marca y «estudio digital» | Consultoría → `/api/lead` (source `consultoria`) |

### Procedimiento (seo-roast adaptado)
1. **FATAL:** `python3 build.py` y revisar en `site/`: `robots.txt` abierto, `sitemap.xml` válido y solo con páginas que existen, cada página pública con un solo `<title>`, `<meta name="description">`, `<link rel="canonical">` absoluto y JSON-LD válido; `404.html` responde 404 (Vercel la sirve sola). Ninguna página pública con `noindex` por error.
2. **REVENUE:** el título y el H1 de cada página de dinero dicen qué ofrece y a quién (con «página web», el giro o «IA»); el primer párrafo responde en 40 palabras; hay una pregunta frecuente por cada objeción real (precio, tiempos, cancelar, qué incluye). Los precios del HTML coinciden con `lib/catalog.js`.
3. **COMPOUNDING:** perfiles públicos de Ceiba (Google Business Profile, LinkedIn, Instagram) en `SAME_AS` de `site_seo.py` cuando existan; páginas por giro que respondan búsquedas concretas; enlaces internos entre /, /webs, /ia y las páginas por giro.
4. **FLUFF:** textos alternativos, largo exacto de descripciones, orden de encabezados.
5. Verificar con Playwright en 1366x768 y 390x844 que lo que se corrigió se ve, y volver a correr `build.py`.

### Preguntas para medir a Ceiba en la IA
Con `customer-journey`, armar 10 a 20 preguntas como las haría un dueño de negocio, por etapa y en español: «¿cuánto cuesta una página web para un consultorio en México?», «¿quién hace páginas web para restaurantes en Guadalajara?», «¿qué es mejor, Wix o pagar a alguien?», «¿cómo hago que ChatGPT recomiende mi negocio?». Probarlas en ChatGPT, Gemini, Perplexity y Claude y anotar si aparece Ceiba y a quién recomiendan en su lugar.

## 2. Páginas de los clientes

### Dónde vive cada cosa
- Contenido: `proposals.site_content` (`page` y `pages`). Lo arma la rutina (`ops/rutina-propuesta.md`).
- Plantilla y JSON-LD del negocio: `lib/templates/clinica.js` (`schemaClinica`, `SCHEMA_TYPE` por giro: MedicalClinic, Restaurant con `hasMenu`, Hotel con habitaciones, RealEstateAgent, LegalService).
- Páginas internas por servicio, zona o catálogo, con su `seo.title` y `seo.description`: `lib/site-pages.js`.
- Dominio del cliente: `api/site.js` sirve `/robots.txt`, `/sitemap.xml`, `/llms.txt`, el canónico, Open Graph y el JSON-LD de cada página (`lib/seo.js`). Mientras no está publicada, `robots.txt` bloquea todo.
- Prueba en IA y reportes: `lib/seo-monitor.js` (Claude, Gemini y Perplexity automáticos; ChatGPT lo corre Cowork con `ops/cowork-reporte-mensual.md`). La «Mejora de SEO del mes» la aplica la rutina.

### SEO local (lo que más pesa en negocios)
- **Nombre, dirección y teléfono idénticos** en la página, el JSON-LD, Google Business Profile, Bing Places, Apple Business Connect, Facebook y directorios. Una diferencia («Av.» contra «Avenida» está bien; otro teléfono no) divide la autoridad.
- **Google Business Profile** es la mitad del juego: categoría principal correcta, horario, fotos reales, servicios con precio, respuestas a reseñas y el enlace a la página (con agenda si la hay). Recomendárselo al cliente aunque lo maneje él.
- **Bing Places**: lo leen ChatGPT y Copilot. Casi nadie lo da de alta.
- **Directorios por giro** (solo los que aplican): clínicas en Doctoralia; restaurantes en TripAdvisor, OpenTable o reservas de Google; hoteles en Booking y Google Hotels (con reserva directa en su página); inmobiliarias en Inmuebles24, Lamudi y Vivanuncios; todos en Facebook y Sección Amarilla.
- **Búsquedas con colonia o ciudad**: «dentista en Providencia», «tacos al pastor en Zapopan», «cerca de mí». Van en el título del hero, en `visit.zones` y en las páginas por zona.
- **Reseñas**: pedirlas por WhatsApp después de cada visita es lo que más mueve. La calificación en el JSON-LD solo si viene de una fuente real.

### Versión por plan
| Plan | Qué hacemos | Con qué |
|---|---|---|
| Esencial | SEO base al publicar: título y H1 con servicio y ciudad, descripción, JSON-LD del giro, 5 preguntas frecuentes, sitemap, robots y `llms.txt`. Análisis rápido gratis (puntaje de 0 a 100). | `seo-title-optimization`, `unslop-seo` (primer párrafo y preguntas), revisión FATAL de `seo-roast` |
| Negocio | Lo anterior más análisis completo al lanzar, hasta 4 páginas por servicio o zona, 15 preguntas frecuentes y prueba en ChatGPT, Gemini y Perplexity cada 3 meses. | `customer-journey` para las preguntas de la prueba, `internal-linking` entre portada y páginas internas |
| Avanzado | Lo anterior más reporte mensual (IA y Google) y una mejora de SEO aplicada al mes, hasta 9 páginas por servicio o zona y catálogo. | `blitz-seo` sobre la página que más importa del mes, `seo-roast` completo cada trimestre |

### Cómo elegir la «Mejora de SEO del mes»
En orden: 1) algo FATAL (página sin indexar, sitemap roto, datos de contacto distintos); 2) una pregunta de la prueba en IA donde no aparece y que una página por servicio o zona podría responder (dentro del límite del plan); 3) título y primer párrafo de la página de dinero; 4) preguntas frecuentes que respondan las búsquedas que faltan; 5) textos alternativos y detalles. Una sola mejora, con datos reales del cliente, y explicada en una frase en el reporte.

# SEO y visibilidad en IA de ceibalabs.io

Meta: que Ceiba sea la respuesta cuando alguien le pregunta a Google, ChatGPT, Gemini o Perplexity
por páginas web, WhatsApp con IA o automatización para negocios en español. Vendemos «optimizada
para IA»: nuestra página tiene que ser el mejor ejemplo.

## 1. Ya implementado (técnico)
Todo se genera en `build.py` con `site_seo.py`. Los precios salen de `lib/catalog.js`, así que nunca se desfasan.

| Qué | Dónde |
|---|---|
| Título (≤60) y descripción (≤160) por página, con las búsquedas objetivo | `site_seo.PAGES` |
| Canónico, `robots` con vista previa grande, Open Graph y Twitter con imagen 1200×630 por página | `site_seo.head`, `scripts/og-images.py` → `site/img/og/` |
| Grafo JSON-LD: Organization (logo, qué sabe, catálogo de servicios), WebSite, WebPage, BreadcrumbList, Service con ofertas y precios (pago inicial + mensualidad), FAQPage con las preguntas que la página ya muestra | `site_seo.graph` |
| `robots.txt`: bienvenida explícita a 14 rastreadores de IA y buscadores (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot…), privado lo interno | `site/robots.txt` |
| `sitemap.xml` con imágenes y `llms.txt` (resumen para asistentes con servicios, precios y FAQ reales) | `site/` |
| Redirecciones 301 de duplicados (`/webs.html`, `/ia.html`, `/index.html`, barras finales) | `vercel.json` |
| Página 404 de marca (noindex) | `src/404.html` |
| Imágenes de fondo en WebP: el inicio bajó de 746 KB a 267 KB de imágenes (1.1 MB → 0.6 MB en total) | `site/img/*.webp` |
| Caché larga para `/img`, cabeceras `nosniff` y `Referrer-Policy` | `vercel.json` |
| Páginas de clientes: un solo bloque de datos estructurados (antes duplicado), FAQPage y `llms.txt` propio en su dominio | `api/site.js` |

Lo que ya estaba bien: HTML servido sin JavaScript (los rastreadores de IA ven casi todo el texto y los precios), un H1 por página, `lang="es"`, LCP local < 0.4 s, CLS < 0.05, sin desborde en celular.

## 2. Lo que necesito de ti (cuentas y datos reales)
1. **Google Search Console**: verificar `ceibalabs.io` (registro TXT en el DNS) y enviar `https://www.ceibalabs.io/sitemap.xml`.
2. **Bing Webmaster Tools**: importar desde Search Console. Bing alimenta la búsqueda de ChatGPT y Copilot; muchos lo olvidan.
3. **Perfil de Google Business** de Ceiba como negocio que atiende en una zona (sin dirección pública si no quieres).
4. **Perfiles públicos** (LinkedIn de la empresa, Instagram, etc.): los agrego en `site_seo.SAME_AS` para que Google y la IA conecten a Ceiba como entidad.
5. **Quiénes somos y contacto**: hoy no hay página con nombres, experiencia, ubicación ni un correo o WhatsApp público. Es lo que más pesa para la confianza (E-E-A-T) y para que la IA nos recomiende.
6. **Aviso de privacidad y términos**: en México es obligatorio el aviso de privacidad (LFPDPPP). Necesito razón social, domicilio y correo de contacto. Hoy el pie enlaza a «muy pronto».
7. **Casos y reseñas reales** (con permiso del cliente): un caso con números vale más que cualquier texto.

## 3. Contenido (la mayor palanca para aparecer en la IA)
Los asistentes citan páginas que responden preguntas concretas con datos claros. Plan en orden:
1. **Páginas por industria** (ya anunciadas como «pronto»): restaurantes, inmobiliarias, hoteles, despachos. Cada una responde «página web para [rubro]» con ejemplos, precios y FAQ propias.
2. **Herramienta gratis indexable**: convertir `/diagnostico` (hoy noindex y solo JavaScript) en una página que explique en HTML qué revisa y por qué. Búsquedas: «revisar SEO de mi página gratis», «mi página aparece en ChatGPT».
3. **Guías** en `/guias`:
   - Cómo hacer que tu negocio aparezca en ChatGPT, Gemini y Perplexity.
   - Cuánto cuesta una página web para un negocio (con nuestros precios y qué cambia el costo).
   - Página web o solo redes sociales: qué conviene.
   - Datos estructurados explicados para dueños de negocio.
   - Checklist de SEO local para clínicas y consultorios.
   - Asistente de WhatsApp con IA: qué hace y cuánto cuesta.
4. **Datos propios**: con los diagnósticos que corremos, publicar un estudio («X de cada 10 páginas de clínicas bloquean a los buscadores de IA»). Es contenido que nadie más tiene y que la IA y la prensa citan.

## 4. Medición
- Search Console y Bing: impresiones, clics y consultas (mensual).
- **Prueba de visibilidad en IA de Ceiba**: la misma que venderemos en el plan Negocio, aplicada primero a nosotros. Preguntas como «¿quién hace páginas web optimizadas para IA en México?» o «asistente de WhatsApp con IA para clínicas», en ChatGPT, Gemini y Perplexity, cada mes, guardando si nos mencionan y a quién mencionan.

## 5. Fuera del sitio
Directorios de agencias (Clutch, GoodFirms, Sortlist, DesignRush), reseñas en Google, publicaciones en LinkedIn con los hallazgos de los diagnósticos, y colaboraciones con asociaciones del rubro (por ejemplo, colegios de dentistas).

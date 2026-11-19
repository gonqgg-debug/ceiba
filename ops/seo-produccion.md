# SEO base y optimización para IA · lista de producción

Toda página de cliente sale con esto antes de publicarse. Es lo que prometemos en /webs
(«Optimizada para IA», «SEO base incluido») y lo que mide el análisis de /diagnostico.

## Lo genera el código (`lib/seo.js` y la plantilla)
- [ ] `seoHead(content, { url })` en el `<head>`: título (≤65, qué haces + dónde + marca), descripción (≤160),
      canónica, Open Graph (imagen para WhatsApp) y datos estructurados schema.org.
- [ ] Datos estructurados (`schemaClinica`): tipo de negocio, dirección, teléfono, horario, servicios con precio,
      calificación y preguntas frecuentes (FAQPage). La plantilla los incluye en modo `live`.
- [ ] `robots.txt` con `robotsTxt({ url })`: deja pasar a GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot,
      Google-Extended y al resto, y apunta al sitemap.
- [ ] `sitemap.xml` con `sitemapXml({ url, paths })` con todas las páginas publicadas.

## Lo revisa una persona
- [ ] Un solo H1 por página que diga qué hace el negocio.
- [ ] Todas las fotos con texto alternativo descriptivo.
- [ ] Precios o rangos, horarios, zonas y preguntas frecuentes en texto (no en imágenes).
- [ ] Nombre, dirección, teléfono y horario idénticos al perfil de Google del negocio.
- [ ] La página se lee completa sin JavaScript (lo que leen muchos buscadores de IA).
- [ ] Pasar la página publicada por /diagnostico: el grupo «SEO y visibilidad en la IA» debe quedar en verde.
- [ ] Dar de alta el sitio en Google Search Console y enviar el sitemap.

No prometemos un lugar en Google ni en las respuestas de la IA: prometemos la mejor base para que te recomienden.

# Esquema de una propuesta

Es el JSON que la rutina guarda en `proposals.ai_draft` y que el equipo aprueba en `proposals.content`. Lo leen `lib/render-proposal.js` (página `/p/[slug]`) y `lib/templates/clinica.js` (portada nueva, en `/vista/[slug]` y en el comparador). La propuesta de ejemplo completa está en `lib/demos/clinica-arrayan.js`.

Las columnas de la tabla mandan sobre el JSON para `slug`, `business`, `recommended_plan`, `whatsapp_recommended`, `allowed_plans` y `valid_until`.

```jsonc
{
  "contactName": "Valeria",              // nombre de quien pidió la propuesta (solo el nombre)
  "siteHost": "clinicaarrayan.mx",       // sin https ni www; vacío si no tiene página
  "template": "clinica",                 // única plantilla por ahora
  "lede": "La hicimos con la información de tu página actual y tu perfil de Google.",
  "cmpLede": "Usamos tus servicios, tu horario y tu dirección.",
  "planTitle": "Te recomendamos el Plan Negocio con Asistente de WhatsApp.",   // opcional
  "planLede": "…",                       // opcional: por qué ese plan, en una o dos frases
  "planWhy": { "esencial": "…", "negocio": "…", "avanzado": "…" },             // opcional
  "includes": [ { "title": "Páginas", "items": [ { "b": "Inicio", "t": "…" } ] } ], // opcional, 3 grupos
  "gain": "Lo que gana el negocio, en una frase.",

  "changes": [                           // de 3 a 6, en orden de importancia
    { "section": "cta", "title": "Agendar una cita", "before": "…", "after": "…" }
  ],
  // section: cta | hero | trust | services | team | reviews | visit | chat | whatsapp
  // El número del cambio se dibuja sobre esa sección de la portada nueva.

  "page": {
    "brand":   { "name": "Arrayán", "tagline": "Clínica dental", "fullName": "Clínica Dental Arrayán", "accent": "#1F4FD1" },
    "contact": { "phone": "33 0000 0000", "whatsapp": "523300000000", "address": "…", "mapsUrl": "https://…", "bookingUrl": "https://…" },
    "util":    { "note": "¿Urgencia? Te atendemos hoy", "hours": "Lunes a viernes de 9 a 20 h" },
    "nav":     ["Tratamientos", "Opiniones", "Ubicación"],
    "hero":    { "title": "…", "sub": "…", "ctaTop": "Agenda tu cita", "cta": "Agenda gratis", "ctaWhatsapp": "Agendar por WhatsApp",
                 "callLabel": "Llamar para agendar", "photo": "https://…", "photoAlt": "…", "slots": [] },
    "rating":  { "value": "4.9", "count": 186, "source": "Google" },     // null si no hay dato real
    "trust":   [ { "b": "Más de 15 años", "t": "cuidando sonrisas en Providencia" } ],   // 4
    "services":{ "title": "Nuestros tratamientos", "note": "…",
                 "items": [ { "name": "…", "price": "Desde $700", "desc": "…", "img": "https://…", "imgAlt": "…", "action": "Agendar" } ] },
    "team":    { "title": "…", "text": "…", "bullets": ["…"], "photo": "https://…", "photoAlt": "…" },          // null si no hay datos
    "reviews": { "title": "…", "items": [ { "name": "Mariana G.", "meta": "hace 2 semanas", "text": "…", "stars": 5 } ], "moreUrl": "https://…" }, // null si no hay reseñas reales
    "visit":   { "title": "Visítanos", "photo": "https://…", "rows": [ { "dt": "Lunes a viernes", "dd": "9:00 a 20:00" } ] },
    "chat":    { "title": "…", "subtitle": "…", "greeting": "…", "button": "¿Dudas? Pregúntanos",
                 "faq": [ { "q": "…", "a": "…", "action": "wa" } ] },                 // action: wa | book
    "footer":  { "note": "Propuesta de rediseño de Ceiba Labs" }
  }
}
```

Reglas de datos:
- `whatsapp` va solo con dígitos y lada de país (52…).
- Las imágenes son URLs `https://` (de la página del cliente) o rutas del sitio de Ceiba (`/img/...`).
- Si un dato no existe en la página del cliente, la sección se omite (`null`) o se deja en `notes` como pendiente. No se inventa.

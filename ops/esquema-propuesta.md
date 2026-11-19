# Esquema de una propuesta

Es el JSON que la rutina guarda en `proposals.ai_draft` y que el equipo aprueba en `proposals.content`. Lo leen `lib/render-proposal.js` (página `/p/[slug]`) y `lib/templates/clinica.js` (portada nueva, en `/vista/[slug]` y en el comparador). La propuesta de ejemplo completa está en `lib/demos/clinica-arrayan.js`.

Las columnas de la tabla mandan sobre el JSON para `slug`, `business`, `recommended_plan`, `whatsapp_recommended`, `allowed_plans` y `valid_until`.

```jsonc
{
  "contactName": "Valeria",              // nombre de quien pidió la propuesta (solo el nombre)
  "siteHost": "clinicaarrayan.mx",       // sin https ni www; vacío si no tiene página
  "template": "clinica",                 // única plantilla por ahora
  "vertical": "clínicas dentales",       // «Optimizada para …» en la propuesta y la vista previa
  "prefsSummary": "estilo elegante, fondo oscuro, de usted", // lo que eligió el cliente en el cuestionario
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
    "theme":   { "mode": "light", "hero": "organic", "font": "moderna", "corners": "soft", "buttons": "pill" },
    // mode: light|dark · hero: organic|rounded|square · font: moderna|elegante|geometrica|clasica|amable|sobria
    // corners: soft|sharp · buttons: pill|square|outline. Se cambia en /admin o con la ronda de ajustes del cliente.
    "brand":   { "name": "Arrayán", "tagline": "Clínica dental", "fullName": "Clínica Dental Arrayán", "accent": "#1F4FD1", "logo": "https://…", "logoWide": true, "logoDark": "https://… (opcional, versión clara para fondo oscuro)" },
    "contact": { "phone": "33 0000 0000", "whatsapp": "523300000000", "email": "…", "address": "…", "mapsUrl": "https://…", "bookingUrl": "https://…" },
    "util":    { "note": "¿Urgencia? Te atendemos hoy", "hours": "Lunes a viernes de 9 a 20 h" },
    "nav":     ["Tratamientos", "Opiniones", "Ubicación"],
    "hero":    { "title": "…", "sub": "…", "ctaTop": "Agenda tu cita", "cta": "Agenda gratis", "ctaWhatsapp": "Agendar por WhatsApp",
                 "callLabel": "Llamar para agendar", "photo": "https://…", "photoAlt": "…", "slots": [] },
    "rating":  { "value": "4.9", "count": 186, "source": "Google" },     // null si no hay dato real
    "trust":   [ { "icon": "award", "b": "Más de 15 años", "t": "cuidando sonrisas en Providencia" } ],   // 4; icon opcional
    // icon: tooth calendar clock card shield star chat map car scan sparkle child phone check heart user award bolt globe
    "stats":   [ { "value": "15+", "label": "años en Providencia" } ],          // 3 a 4 cifras reales; null si no hay
    "today":   { "title": "Te atendemos hoy mismo", "text": "…", "bullets": [ { "icon": "bolt", "t": "Urgencias el mismo día" } ] }, // promesas reales; null si no hay
    "services":{ "title": "Nuestros tratamientos", "sub": "…", "note": "…", "more": ["Resinas", "Endodoncia"],
                 "items": [ { "name": "…", "price": "Desde $700", "desc": "…", "img": "https://…", "imgAlt": "…", "action": "Agendar" } ] },
    "prices":  { "title": "…", "note": "…", "rows": [ { "name": "Limpieza", "price": "00" } ] }, // opcional: si falta, se arma con services
    "offers":  { "title": "Paquetes", "sub": "…", "note": "…", "items": [ { "title": "…", "price": ",990", "was": ",500", "desc": "…", "tag": "El más pedido" } ] },
    "assistant": { "title": "…", "sub": "…", "bullets": ["…"] },               // sección del asistente con IA (aparece si hay chat)
    "process": { "title": "Cómo es tu primera visita", "sub": "…", "steps": [ { "t": "Valoración", "d": "…" } ] },   // 3 a 4 pasos
    "team":    { "title": "…", "text": "…", "bullets": ["…"], "photo": "https://…", "photoAlt": "…",
                 "members": [ { "name": "Dra. …", "role": "Ortodoncia", "cedula": "1234567", "photo": "https://…" } ] }, // null si no hay datos
    "tech":    { "title": "…", "text": "…", "photo": "https://…", "items": [ { "icon": "scan", "b": "Radiografía digital", "t": "…" } ] },
    "gallery": { "title": "Conoce la clínica", "text": "…", "images": [ { "img": "https://…", "alt": "…" } ] },      // 3 a 6 fotos reales; si no, null
    "payments":{ "title": "Formas de pago", "text": "…", "methods": ["Efectivo", "3 y 6 MSI"], "insurers": ["GNP"] },
    "faq":     [ { "q": "…", "a": "…" } ],                                    // 4 a 6
    "reviews": { "title": "…", "items": [ { "name": "Mariana G.", "meta": "hace 2 semanas", "text": "…", "stars": 5 } ], "moreUrl": "https://…" }, // null si no hay reseñas reales
    "visit":   { "title": "Visítanos", "photo": "https://…", "zones": "Nos visitan de …", "rows": [ { "dt": "Lunes a viernes", "dd": "9:00 a 20:00" } ] },
    "legal":   { "cofepris": "…", "responsable": "Dra. …, cédula …" },   // solo si aparece en su página
    "chat":    { "title": "…", "subtitle": "…", "greeting": "…", "button": "¿Dudas? Pregúntanos",
                 "payments":{ "title": "Formas de pago", "text": "…", "methods": ["Efectivo", "3 y 6 MSI"], "insurers": ["GNP"] },
    "faq": [ { "q": "…", "a": "…", "action": "wa" } ] },                 // action: wa | book
    "footer":  { "note": "Propuesta de rediseño de Ceiba Labs" }
  }
}
```

Reglas de datos:
- `whatsapp` va solo con dígitos y lada de país (52…).
- Las imágenes son URLs `https://` (de la página del cliente) o rutas del sitio de Ceiba (`/img/...`).
- Si un dato no existe en la página del cliente, la sección se omite (`null`) o se deja en `notes` como pendiente. No se inventa.

La sección «¿Qué necesitas?» y el formulario de cita se arman solos con `services` y el WhatsApp; no llevan datos propios.

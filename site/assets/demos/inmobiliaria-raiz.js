// Propuesta de ejemplo: inmobiliaria (negocio ficticio).
export default {
  slug: 'demo-inmobiliaria', business: 'Raíz Inmobiliaria', contactName: 'Fernanda', siteHost: 'raizinmobiliaria.mx', demo: true,
  recommendedPlan: 'avanzado', whatsappRecommended: true, createdAt: '2026-11-20', validUntil: '2026-12-04', template: 'clinica', vertical: 'inmobiliarias',
  lede: 'La hicimos con tus propiedades publicadas en portales y tu perfil de Google.', cmpLede: 'Tus propiedades con precio, filtro de venta o renta y contacto directo por WhatsApp.',
  planTitle: 'Plan Avanzado + Asistente de WhatsApp', planLede: 'Tu catálogo de propiedades lo actualizas tú y el asistente filtra a los interesados antes de pasártelos.',
  changes: [
    { section: 'services', title: 'Catálogo propio', before: 'Tus propiedades solo están en portales, junto a las de la competencia.', after: 'Catálogo en tu página con precio, zona, medidas y filtro de venta o renta.' },
    { section: 'cta', title: 'Contacto por propiedad', before: 'El formulario no dice qué propiedad le interesa al cliente.', after: '«Me interesa» abre WhatsApp con la propiedad ya escrita.' },
    { section: 'team', title: 'Confianza', before: 'No se sabe quién está detrás de la inmobiliaria.', after: 'Tus asesoras, años en el mercado y operaciones cerradas.' },
  ],
  page: {
    kind: 'inmobiliaria', theme: { style: 'sobria', hero: 'square' },
    brand: { name: 'Raíz', tagline: 'Inmobiliaria', fullName: 'Raíz Inmobiliaria', accent: '#1D4ED8' },
    contact: { phone: '33 0000 0000', whatsapp: '523300000000', email: 'hola@raizinmobiliaria.mx', address: 'Av. Patria 1890, Col. Puerta de Hierro, Zapopan, Jal.' },
    util: { note: 'Te acompañamos en la compra, la venta y la renta', hours: 'Lunes a sábado de 9 a 19 h' },
    hero: { title: 'Encuentra casa en Zapopan con quien conoce cada colonia', sub: 'Casas y departamentos en venta y renta, revisados por nosotras. Te acompañamos desde la visita hasta la firma.', ctaTop: 'Hablar con una asesora', cta: 'Ver propiedades', ctaWhatsapp: 'Escribir por WhatsApp', callLabel: 'O llámanos', photo: '/img/demo/inmo-casa.jpg', photoAlt: 'Casa moderna en venta en Zapopan' },
    rating: { value: '4.9', count: 128, source: 'Google' },
    trust: [
      { icon: 'shield', b: 'Propiedades revisadas', t: 'papeles en orden antes de publicar' },
      { icon: 'user', b: 'Una asesora contigo', t: 'de la visita a la firma' },
      { icon: 'card', b: 'Te ayudamos con el crédito', t: 'Infonavit, Fovissste y bancario' },
      { icon: 'map', b: 'Zapopan y Guadalajara', t: 'conocemos cada colonia' },
    ],
    stats: [{ value: '15', label: 'años en el mercado' }, { value: '640+', label: 'operaciones cerradas' }, { value: '4.9', label: 'en Google' }],
    listings: {
      title: 'Propiedades disponibles', sub: 'Una selección de lo que tenemos hoy. Escríbenos y te mandamos más opciones con lo que buscas.', note: 'Precios de lista; pueden cambiar sin aviso.',
      items: [
        { title: 'Casa en Puerta de Hierro', op: 'venta', price: '$8,900,000', zone: 'Puerta de Hierro, Zapopan', beds: 4, baths: 3.5, m2: 320, parking: 2, img: '/img/demo/inmo-casa.jpg' },
        { title: 'Departamento con vista', op: 'renta', price: '$24,000 / mes', zone: 'Providencia, Guadalajara', beds: 2, baths: 2, m2: 110, parking: 1, img: '/img/demo/inmo-depa.jpg' },
        { title: 'Casa en coto privado', op: 'venta', price: '$4,350,000', zone: 'Valle Real, Zapopan', beds: 3, baths: 2.5, m2: 180, parking: 2, img: '/img/demo/inmo-townhouse.jpg' },
      ],
    },
    services: { title: 'Cómo te ayudamos', sub: 'Si vas a comprar, vender o rentar, te acompañamos en todo el proceso.', items: [
      { name: 'Comprar', desc: 'Te mandamos opciones que sí te sirven, agendamos visitas y revisamos los papeles contigo.' },
      { name: 'Vender', desc: 'Valuamos tu propiedad, la fotografiamos y la promovemos hasta cerrar la venta.' },
      { name: 'Rentar', desc: 'Encontramos inquilinos con investigación y póliza jurídica.' },
    ] },
    team: { title: 'Quién te atiende', text: 'Somos un equipo pequeño: siempre hablas con la misma asesora.', photo: '/img/demo/inmo-asesora.jpg', photoAlt: 'Asesora mostrando un departamento', bullets: ['Asesoras certificadas por AMPI', 'Abogado propio para revisar contratos', 'Te acompañamos al notario'] },
    process: { title: 'Cómo compras con nosotras', steps: [{ t: 'Nos cuentas qué buscas', d: 'Zona, presupuesto y tipo de crédito.' }, { t: 'Visitas', d: 'Agendamos las visitas en un solo día.' }, { t: 'Oferta y papeles', d: 'Negociamos por ti y revisamos todo.' }, { t: 'Firma', d: 'Te acompañamos al notario.' }] },
    faq: [
      { q: '¿Cobran por enseñarme propiedades?', a: 'No, para compradores e inquilinos nuestro servicio no tiene costo.' },
      { q: '¿Me ayudan con el crédito?', a: 'Sí, te orientamos con Infonavit, Fovissste y créditos bancarios.' },
      { q: '¿Cuánto cobran por vender mi casa?', a: 'Una comisión sobre el precio de venta que acordamos desde el inicio, solo si se vende.' },
    ],
    visit: { title: 'Visita nuestra oficina', photo: '/img/demo/inmo-asesora.jpg', photoAlt: 'Asesora con clientes', rows: [{ dt: 'Lunes a viernes', dd: '9:00 a 19:00' }, { dt: 'Sábados', dd: '10:00 a 14:00' }] },
    chat: { title: 'Raíz Inmobiliaria', subtitle: 'Te respondemos aquí o por WhatsApp', greeting: 'Hola 👋 ¿Buscas comprar, rentar o vender?', button: '¿Qué buscas?', faq: [
      { q: '¿Tienen casas en venta en Zapopan?', a: 'Sí. Dime tu presupuesto y cuántas recámaras buscas y te mando opciones.', action: 'wa' },
      { q: '¿Rentan departamentos?', a: 'Sí, en Providencia, Chapultepec y Andares. ¿Para cuándo lo necesitas?', action: 'wa' },
      { q: 'Quiero vender mi casa', a: 'Con gusto la valuamos sin costo. ¿En qué colonia está?', action: 'wa' },
    ] },
    reviews: null, gallery: null, tech: null, prices: null, offers: null, today: null, payments: null,
    footer: { note: 'Demo de Ceiba Labs (negocio ficticio)' },
  },
};

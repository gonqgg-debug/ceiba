// Propuesta de ejemplo: despacho legal y contable (negocio ficticio).
export default {
  slug: 'demo-despacho', business: 'Ortega & Ruiz, abogados y contadores', contactName: 'Laura', siteHost: 'ortegaruiz.mx', demo: true,
  recommendedPlan: 'negocio', whatsappRecommended: false, createdAt: '2026-11-20', validUntil: '2026-12-04', template: 'clinica', vertical: 'despachos',
  lede: 'La hicimos con la información de tu página actual y tu perfil de Google.', cmpLede: 'Tus áreas de práctica claras, tu equipo con cédula y la primera consulta a un clic.',
  planTitle: 'Plan Negocio', planLede: 'Tus clientes llegan buscando en Google un tema concreto; una página por área de práctica te ayuda a aparecer.',
  changes: [
    { section: 'services', title: 'Áreas de práctica', before: 'Una lista larga de servicios sin explicar qué incluye cada uno.', after: 'Cada área explicada en dos líneas, con su propia página para Google.' },
    { section: 'team', title: 'Equipo con cédula', before: 'No aparece quién atiende ni su cédula profesional.', after: 'Socios con foto, especialidad y cédula.' },
    { section: 'cta', title: 'Primera consulta', before: 'Solo hay un correo de contacto.', after: 'Formulario de primera consulta por tema, que llega por WhatsApp.' },
  ],
  page: {
    kind: 'despacho', schemaType: 'LegalService', theme: { style: 'sobria', font: 'elegante', corners: 'sharp', buttons: 'square' },
    brand: { name: 'Ortega & Ruiz', tagline: 'Abogados y contadores', fullName: 'Ortega & Ruiz, abogados y contadores', accent: '#1E3A5F' },
    contact: { phone: '81 0000 0000', whatsapp: '528100000000', email: 'contacto@ortegaruiz.mx', address: 'Av. Lázaro Cárdenas 2400, Valle Oriente, San Pedro Garza García, N.L.' },
    util: { note: 'Primera consulta de 30 minutos sin costo', hours: 'Lunes a viernes de 9 a 18 h' },
    hero: { title: 'Resolvemos tus temas legales y fiscales, con claridad y a tiempo', sub: 'Asesoramos a familias y empresas en Monterrey desde 2004: contratos, sociedades, impuestos y defensa fiscal.', ctaTop: 'Agendar consulta', cta: 'Agenda tu primera consulta', ctaWhatsapp: 'Escribir por WhatsApp', callLabel: 'O llámanos', photo: '/img/demo/desp-oficina.jpg', photoAlt: 'Reunión con clientes en la sala de juntas del despacho' },
    rating: { value: '4.9', count: 74, source: 'Google' },
    trust: [
      { icon: 'award', b: 'Desde 2004', t: 'más de 20 años de experiencia' },
      { icon: 'shield', b: 'Confidencialidad', t: 'tu información protegida' },
      { icon: 'clock', b: 'Respuesta en 24 h', t: 'en días hábiles' },
      { icon: 'card', b: 'Honorarios claros', t: 'cotización antes de empezar' },
    ],
    services: { title: 'Áreas de práctica', sub: 'Te decimos desde la primera consulta qué necesitas y cuánto cuesta.', items: [
      { name: 'Derecho corporativo', desc: 'Constitución de sociedades, actas, contratos entre socios y gobierno corporativo.' },
      { name: 'Contabilidad y nómina', desc: 'Contabilidad mensual, declaraciones y nómina para personas físicas y empresas.' },
      { name: 'Defensa fiscal', desc: 'Auditorías del SAT, recursos de revocación y juicios ante el Tribunal Fiscal.' },
      { name: 'Contratos', desc: 'Arrendamiento, compraventa, prestación de servicios y confidencialidad.' },
      { name: 'Derecho familiar', desc: 'Divorcios, pensiones, sucesiones y testamentos.' },
      { name: 'Laboral', desc: 'Contratos de trabajo, reglamentos y defensa ante demandas.' },
    ] },
    team: { title: 'Socios', text: 'Cada asunto lo lleva un socio de principio a fin.', members: [
      { name: 'Lic. Laura Ortega', role: 'Socia, derecho corporativo y familiar', photo: '/img/demo/desp-abogada.jpg' },
      { name: 'C.P. Ricardo Ruiz', role: 'Socio, contabilidad y defensa fiscal', photo: '/img/demo/desp-contador.jpg' },
    ], note: 'Personas ficticias para el concepto.' },
    process: { title: 'Cómo trabajamos', sub: 'Sin sorpresas en honorarios.', steps: [{ t: 'Primera consulta', d: '30 minutos sin costo, en persona o por videollamada.' }, { t: 'Propuesta por escrito', d: 'Qué haremos, en cuánto tiempo y cuánto cuesta.' }, { t: 'Seguimiento', d: 'Te informamos cada avance por correo o WhatsApp.' }] },
    stats: [{ value: '20+', label: 'años de experiencia' }, { value: '350', label: 'empresas atendidas' }, { value: '24 h', label: 'para responderte' }],
    faq: [
      { q: '¿La primera consulta tiene costo?', a: 'No, los primeros 30 minutos son sin costo.' },
      { q: '¿Atienden en línea?', a: 'Sí, por videollamada para clientes de cualquier ciudad.' },
      { q: '¿Cómo cobran?', a: 'Por proyecto o con una iguala mensual. Siempre con cotización por escrito.' },
      { q: '¿Atienden personas físicas?', a: 'Sí, además de empresas.' },
    ],
    visit: { title: 'Nuestra oficina', photo: '/img/demo/desp-firma.jpg', photoAlt: 'Firma de documentos', rows: [{ dt: 'Lunes a viernes', dd: '9:00 a 18:00' }, { dt: 'Estacionamiento', dd: 'En el edificio' }] },
    chat: { title: 'Ortega & Ruiz', subtitle: 'Te respondemos aquí o por WhatsApp', greeting: 'Hola, ¿en qué tema te podemos ayudar?', button: '¿Tienes una duda legal o fiscal?', faq: [
      { q: '¿La primera consulta cuesta?', a: 'No, los primeros 30 minutos son sin costo. ¿Te agendo?', action: 'book' },
      { q: 'Me llegó una carta del SAT', a: 'Lo vemos en la primera consulta. Trae la carta o mándanos una foto por WhatsApp.', action: 'wa' },
      { q: '¿Hacen contabilidad mensual?', a: 'Sí, para personas físicas y empresas, con iguala mensual.', action: 'wa' },
    ] },
    reviews: null, gallery: null, tech: null, prices: null, offers: null, today: null, payments: null,
    footer: { note: 'Demo de Ceiba Labs (negocio ficticio)' },
  },
};

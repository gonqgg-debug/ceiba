// Propuesta de ejemplo: restaurante (negocio ficticio). Mismo esquema que proposals.content.
export default {
  slug: 'demo-restaurante', business: 'La Milpa, cocina de barrio', contactName: 'Mariana', siteHost: 'lamilpagdl.mx', demo: true,
  recommendedPlan: 'negocio', whatsappRecommended: true, createdAt: '2026-11-20', validUntil: '2026-12-04', template: 'clinica', vertical: 'restaurantes',
  prefsSummary: 'estilo cálido, colorido y enfocado en reservaciones',
  lede: 'La hicimos con tu menú, tu horario y las fotos de tu Instagram.', cmpLede: 'Tu menú con precios, reservaciones por WhatsApp y cómo llegar.',
  planTitle: 'Plan Negocio + Asistente de WhatsApp', planLede: 'Recibes muchas preguntas de horario, menú y reservaciones fuera de horario: el asistente las contesta y aparta la mesa.',
  changes: [
    { section: 'cta', title: 'Reservar mesa', before: 'Para reservar hay que mandar mensaje por Instagram y esperar respuesta.', after: 'Botón «Reserva tu mesa» siempre a la vista: eligen personas, día y hora y te llega por WhatsApp.' },
    { section: 'services', title: 'Menú con precios', before: 'El menú es una foto borrosa en las historias destacadas.', after: 'Menú por categorías con precios, que Google y los asistentes de IA pueden leer.' },
    { section: 'visit', title: 'Cómo llegar', before: 'La dirección no aparece completa en ningún lado.', after: 'Dirección, horario de hoy y un botón para abrir Google Maps.' },
    { section: 'chat', title: 'Respuestas a cualquier hora', before: 'Las preguntas de la noche se contestan al otro día.', after: 'El asistente responde horario, menú y reservaciones al momento.' },
  ],
  page: {
    kind: 'restaurante', theme: { style: 'cercana', hero: 'rounded' },
    brand: { name: 'La Milpa', tagline: 'Cocina de barrio', fullName: 'La Milpa, cocina de barrio', accent: '#C2410C' },
    contact: { phone: '33 0000 0000', whatsapp: '523300000000', email: 'hola@lamilpagdl.mx', address: 'Calle Morelos 812, Col. Americana, Guadalajara' },
    util: { note: 'Tortillas hechas a mano todos los días', hours: 'Martes a domingo de 13 a 23 h' },
    hero: { title: 'Comida de casa, hecha en comal, en la Americana', sub: 'Birria, enchiladas y tortillas a mano desde las 13 h. Reserva tu mesa en un minuto o pide para llevar.', ctaTop: 'Reservar mesa', cta: 'Reserva tu mesa', ctaWhatsapp: 'Pedir para llevar', callLabel: 'O llámanos', photo: '/img/demo/rest-hero.jpg', photoAlt: 'Mesero llevando platillos a una mesa de amigos en La Milpa', slots: ['Hoy 14:00', 'Hoy 20:30', 'Mañana 15:00'] },
    rating: { value: '4.8', count: 412, source: 'Google' },
    trust: [
      { icon: 'heart', b: 'Tortillas a mano', t: 'nixtamal propio, todos los días' },
      { icon: 'calendar', b: 'Reserva en 1 minuto', t: 'te confirmamos por WhatsApp' },
      { icon: 'child', b: 'Para ir con niños', t: 'menú infantil y sillas para bebé' },
      { icon: 'car', b: 'Estacionamiento', t: 'convenio a media cuadra' },
    ],
    menu: {
      title: 'Nuestro menú', sub: 'Lo que más piden, con precios de hoy. Todo se hace al momento.', note: 'Precios en pesos, IVA incluido. Pregunta por el platillo del día.',
      categories: [
        { name: 'Para empezar', items: [
          { name: 'Guacamole de molcajete', desc: 'Con chicharrón de la casa y totopos.', price: '$145', tags: ['Para compartir'] },
          { name: 'Sopes de tinga', desc: 'Tres sopes con crema, queso fresco y salsa roja.', price: '$110' },
          { name: 'Queso fundido', desc: 'Con chorizo de Toluca y tortillas de harina.', price: '$135' },
          { name: 'Tostada de aguachile', desc: 'Camarón, pepino y cebolla morada.', price: '$95', tags: ['Picante'] },
        ] },
        { name: 'Platos fuertes', items: [
          { name: 'Tacos de birria con consomé', desc: 'Tres tacos dorados de res con queso.', price: '$165', tags: ['El más pedido'] },
          { name: 'Enchiladas verdes', desc: 'De pollo, con crema y queso Cotija.', price: '$150' },
          { name: 'Mole poblano', desc: 'Pierna de pollo con arroz rojo y tortillas.', price: '$185' },
          { name: 'Chile en nogada', desc: 'De temporada, de agosto a septiembre.', price: '$245', tags: ['Temporada'] },
          { name: 'Tacos de hongos', desc: 'Hongos al ajillo con epazote.', price: '$140', tags: ['Vegetariano'] },
        ] },
        { name: 'Bebidas', items: [
          { name: 'Agua fresca de jamaica', desc: 'Jarra de un litro.', price: '$75' },
          { name: 'Horchata de la casa', desc: 'Con canela.', price: '$45' },
          { name: 'Café de olla', desc: 'Con piloncillo.', price: '$40' },
          { name: 'Cerveza artesanal de Jalisco', desc: 'Pregunta por la de temporada.', price: '$85' },
        ] },
        { name: 'Postres', items: [
          { name: 'Flan napolitano', desc: 'Receta de la abuela.', price: '$70' },
          { name: 'Churros con chocolate', desc: 'Cuatro piezas con chocolate de mesa.', price: '$85' },
        ] },
      ],
    },
    today: { title: 'Celebra con nosotros', text: 'Apartamos mesa larga para cumpleaños y comidas de oficina, con menú por persona.', bullets: [
      { icon: 'calendar', t: 'Mesas para grupos de hasta 30 personas' },
      { icon: 'heart', t: 'Pastel de cortesía para el cumpleañero' },
      { icon: 'card', t: 'Aceptamos tarjetas y transferencia' },
    ] },
    process: null, team: null, tech: null, stats: null, prices: null, offers: null, services: null,
    gallery: { title: 'Así se vive La Milpa', text: 'Comal encendido desde temprano y terraza en la tarde.', images: [
      { img: '/img/demo/rest-terraza.jpg', alt: 'Terraza de La Milpa al atardecer' },
      { img: '/img/demo/rest-comal.jpg', alt: 'Tortillas a mano en el comal' },
      { img: '/img/demo/rest-platos.jpg', alt: 'Tacos de birria, tostada y enchiladas verdes' },
      { img: '/img/demo/rest-hero.jpg', alt: 'Mesa de amigos comiendo' },
    ] },
    reviews: { title: 'Lo que dicen quienes ya vinieron', items: [
      { name: 'Andrea P.', meta: 'Hace 1 semana', text: 'La birria está buenísima y las tortillas recién hechas hacen toda la diferencia. Reservamos por WhatsApp sin problema.', stars: 5 },
      { name: 'Luis M.', meta: 'Hace 3 semanas', text: 'Fuimos con mis hijos y nos atendieron increíble. El flan es obligatorio.', stars: 5 },
      { name: 'Sofía R.', meta: 'Hace 1 mes', text: 'Celebramos un cumpleaños de 15 personas y todo salió perfecto.', stars: 5 },
    ], note: 'Reseñas de ejemplo para el concepto.' },
    faq: [
      { q: '¿Necesito reservar?', a: 'Entre semana casi siempre hay mesa. Viernes, sábado y domingo te recomendamos reservar.' },
      { q: '¿Tienen opciones vegetarianas?', a: 'Sí: tacos de hongos, quesadillas y sopes de frijol.' },
      { q: '¿Hacen pedidos para llevar?', a: 'Sí, pide por WhatsApp y pasa por él en 20 minutos.' },
      { q: '¿Aceptan tarjeta?', a: 'Sí, todas las tarjetas y transferencia.' },
    ],
    payments: null,
    visit: { title: 'Visítanos en la Americana', photo: '/img/demo/rest-terraza.jpg', photoAlt: 'Fachada y terraza', zones: 'A dos cuadras de avenida Chapultepec.', rows: [{ dt: 'Martes a jueves', dd: '13:00 a 22:00' }, { dt: 'Viernes y sábado', dd: '13:00 a 23:30' }, { dt: 'Domingo', dd: '13:00 a 19:00' }] },
    assistant: { title: 'Reserva o pregunta por el menú a cualquier hora', sub: 'El asistente contesta horario, menú y precios al momento, y aparta tu mesa. Si necesitas algo especial, te pasa con nosotros por WhatsApp.', bullets: ['Horario, menú y precios al momento', 'Aparta tu mesa sin esperar respuesta', 'Pedidos para llevar por WhatsApp', 'Te pasa con el equipo cuando lo necesitas'] },
    chat: { title: 'La Milpa', subtitle: 'Te respondemos aquí o por WhatsApp', greeting: 'Hola 👋 ¿Quieres reservar o ver el menú?', button: '¿Reservamos?', faq: [
      { q: '¿Tienen mesa hoy?', a: 'Casi siempre sí. Dime para cuántas personas y a qué hora y te la aparto.', action: 'book' },
      { q: '¿Qué me recomiendan?', a: 'Los tacos de birria con consomé son los más pedidos 😋 y el flan de postre.', action: 'wa' },
      { q: '¿Tienen opciones vegetarianas?', a: 'Sí: tacos de hongos, quesadillas y sopes de frijol.', action: 'wa' },
    ] },
    footer: { note: 'Demo de Ceiba Labs (negocio ficticio)' },
  },
};

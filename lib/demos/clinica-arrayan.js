// Contenido de la propuesta de ejemplo (negocio ficticio). Mismo esquema que
// proposals.content en Supabase (ver ops/esquema-propuesta.md).
export default {
  slug: 'clinica-arrayan',
  business: 'Clínica Dental Arrayán',
  contactName: 'Valeria',
  siteHost: 'clinicaarrayan.mx',
  demo: true,
  recommendedPlan: 'negocio',
  whatsappRecommended: true,
  createdAt: '2026-11-18',
  validUntil: '2026-12-02',
  template: 'clinica',
  page: {
    brand: { name: 'Arrayán', tagline: 'Clínica dental', fullName: 'Clínica Dental Arrayán', accent: '#1F4FD1' },
    contact: { phone: '33 0000 0000', whatsapp: '523300000000', address: 'Av. Los Arrayanes 1240, local 3, Col. Providencia, Guadalajara' },
    util: { note: '¿Urgencia? Te atendemos hoy', hours: 'Lunes a viernes de 9 a 20 h y sábados de 9 a 14 h' },
    nav: ['Tratamientos', 'Precios', 'Doctora', 'Opiniones', 'Ubicación'],
    hero: {
      title: 'Agenda tu valoración dental sin costo',
      sub: 'Conoce cómo están tus dientes y encías, y sal de tu primera cita con tu presupuesto en la mano. Estamos en Providencia, Guadalajara.',
      ctaTop: 'Agenda tu cita', cta: 'Agenda gratis', ctaWhatsapp: 'Agendar por WhatsApp', callLabel: 'Llamar para agendar',
      photo: '/img/doc.jpg', photoAlt: 'La Dra. Valeria Ríos en su consultorio',
      slots: ['Hoy 18:30', 'Mañana 10:00', 'Mañana 12:30'],
    },
    rating: { value: '4.9', count: 186, source: 'Google' },
    trust: [
      { b: 'Más de 15 años', t: 'cuidando sonrisas en Providencia' },
      { b: 'Cédula profesional', t: '4512378' },
      { b: 'Hasta 6 MSI', t: 'en tratamientos mayores a $1,200' },
      { b: 'Estacionamiento gratis', t: 'frente a la clínica' },
    ],
    services: {
      title: 'Nuestros tratamientos',
      note: '*Los precios pueden cambiar según tu caso y te los confirmamos en tu valoración. Aceptamos efectivo, tarjetas de débito y crédito.',
      items: [
        { name: 'Valoración dental', price: 'Sin costo', desc: 'Revisamos dientes y encías, y te tomamos radiografía. Sales con tu presupuesto.', img: '/img/t-valoracion.jpg', imgAlt: 'La dentista le muestra una radiografía a una paciente' },
        { name: 'Limpieza dental', price: '$700', desc: 'Retira el sarro y la placa que no quita el cepillado. Se recomienda 2 veces al año.', img: '/img/t-limpieza.jpg', imgAlt: 'Limpieza dental a una paciente' },
        { name: 'Alineadores transparentes', price: 'Valoración sin costo', desc: 'Casi no se notan y te los puedes quitar para comer.', img: '/img/t-alineadores.jpg', imgAlt: 'Paciente con un alineador transparente' },
        { name: 'Implantes dentales', price: 'Desde $14,500', desc: 'Reemplaza el diente que te falta con una pieza fija.', img: '/img/t-implantes.jpg', imgAlt: 'Paciente sonriendo después de su tratamiento' },
        { name: 'Blanqueamiento', price: '$3,800', desc: 'Dientes más blancos en dos sesiones.', img: '/img/t-blanqueamiento.jpg', imgAlt: 'Paciente con una sonrisa blanca' },
        { name: 'Urgencias', price: 'Hoy mismo', desc: '¿Dolor, golpe o un diente roto? Llámanos y te hacemos un espacio.', img: '/img/t-urgencias.jpg', imgAlt: 'La dentista atiende a un paciente con dolor de muela', action: 'Llamar' },
      ],
    },
    team: {
      title: 'Tu sonrisa en manos expertas',
      text: 'La Dra. Valeria Ríos es cirujana dentista egresada de la Universidad de Guadalajara y especialista en rehabilitación oral. Lleva más de 15 años atendiendo a familias en Providencia.',
      bullets: ['Cédula profesional 4512378', 'Cédula de especialidad 7718203', 'No trabajamos con pasantes: siempre te atiende una especialista'],
      photo: '/img/room.jpg', photoAlt: 'Consultorio de la clínica', note: 'Personaje ficticio del ejemplo',
    },
    reviews: {
      title: 'Lo que dicen nuestros pacientes',
      note: 'Reseñas de ejemplo para el concepto',
      items: [
        { name: 'Mariana G.', meta: 'Alineadores, hace 2 semanas', text: 'Muy buena atención, la doctora Valeria me explicó todo el tratamiento con calma y el precio desde el principio. Súper recomendable 👍' },
        { name: 'Jorge R.', meta: 'Urgencia, hace 1 mes', text: 'Fui por una urgencia un sábado, no tenía cita pero me hicieron un espacio y ese mismo día se me quitó el dolor. Gracias!!' },
        { name: 'Lucía M.', meta: 'Limpieza, hace 3 meses', text: 'Llevo a mis hijos desde hace años, siempre son puntuales y el consultorio está muy limpio.' },
      ],
    },
    visit: {
      title: 'Visítanos', photo: '/img/facade.jpg', photoAlt: 'Fachada de la clínica',
      rows: [{ dt: 'Lunes a viernes', dd: '9:00 a 20:00' }, { dt: 'Sábados', dd: '9:00 a 14:00' }, { dt: 'Estacionamiento', dd: 'Gratis, frente a la clínica' }],
    },
    chat: {
      title: 'Clínica Arrayán', subtitle: 'Te respondemos aquí o por WhatsApp', greeting: 'Hola 👋 ¿En qué te podemos ayudar?', button: '¿Dudas? Pregúntanos',
      faq: [
        { q: '¿Atienden urgencias hoy?', a: 'Sí, atendemos urgencias el mismo día. Escríbenos por WhatsApp o llámanos y te hacemos un espacio lo antes posible.', action: 'wa' },
        { q: '¿Cuánto cuesta la valoración?', a: 'Es sin costo 😊 Revisamos tus dientes y encías, te tomamos radiografía y te damos tu presupuesto. ¿Te agendo?', action: 'book' },
        { q: '¿Tienen meses sin intereses?', a: 'Sí, hasta 6 MSI con tarjetas participantes en tratamientos mayores a $1,200.', action: 'wa' },
      ],
    },
    footer: { note: 'Ejemplo de rediseño de Ceiba Labs' },
  },
  changes: [
    { section: 'cta', title: 'Agendar una cita', before: 'Tu teléfono está arriba en letra chiquita y no se puede marcar desde el celular.', after: 'El botón «Agenda tu cita» siempre está a la vista. El paciente elige tratamiento y horario.' },
    { section: 'services', title: 'Tratamientos', before: 'Tus servicios están en tres recuadros con «Leer más» y sin precios.', after: 'Seis tratamientos principales, cada uno con foto, precio y su botón para agendar.' },
    { section: 'team', title: 'Quién te atiende', before: 'Un carrusel con foto de banco ocupa la pantalla y no apareces tú.', after: 'Fotos de tu consultorio y de ti, con tu especialidad.' },
    { section: 'visit', title: 'Cómo llegar', before: 'El mapa no carga y el pie de página dice © 2017.', after: 'El horario de hoy arriba, la fachada, la dirección escrita y un botón para abrir el mapa.' },
    { section: 'reviews', title: 'Opiniones de pacientes', before: 'Un recuadro de Facebook con la última publicación de 2019.', after: 'Tu calificación y tus reseñas reales de Google en la portada.' },
    { section: 'chat', title: 'Respuestas de noche y en fin de semana', before: 'Un formulario que promete contestar «a la brevedad».', after: 'Un asistente contesta al momento y pasa a tu WhatsApp lo que necesita recepción. Pruébalo en la vista previa.' },
  ],
  gain: 'Las citas llegan con el tratamiento elegido, sin depender de que alguien conteste el teléfono.',
};

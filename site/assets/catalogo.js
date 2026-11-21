// Catálogo de plantillas por rubro. Cada una se basa en un sitio de referencia
// (ver el documento «Referencias de páginas web por rubro») y es un theme.style propio.
// Lo usan la galería (/plantillas, scripts/plantillas.mjs) y la rutina para elegir diseño.
//   id: theme.style · kind: page.kind · demo: lib/demos/<demo>.js con que se muestra
export const CATALOGO = [
  {
    id: 'estudio', name: 'Estudio', kind: 'clinica', demo: 'clinica-arrayan', estado: 'piloto',
    ref: { name: 'Zen Dental Studio y Tend', url: 'https://www.zen.dentist/' },
    idea: 'Cálida y tranquila: reservar desde el hero, carta de tratamientos con foto, la visita en pasos y calculadora de meses sin intereses.',
  },
  {
    id: 'galeria', name: 'Galería', kind: 'clinica', demo: 'clinica-arrayan',
    ref: { name: 'Grand Street Dental', url: 'https://www.grandstreetdental.com/' },
    idea: 'Como cartel de diseño: medios círculos de colores, serif negrita, opiniones en cuadrícula, la doctora a todo lo ancho y pestaña «Contáctanos».',
  },
];

export const RUBROS = { clinica: 'Clínicas dentales', consultorio: 'Consultorios médicos', restaurante: 'Restaurantes', hotel: 'Hoteles', inmobiliaria: 'Inmobiliarias', despacho: 'Despachos legales' };

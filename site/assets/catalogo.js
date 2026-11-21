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
  {
    id: 'fresca', name: 'Fresca', kind: 'clinica', demo: 'clinica-arrayan', accent: '#2BA59B',
    ref: { name: 'Swish Dental', url: 'https://www.swishsmiles.com/' },
    idea: 'Juguetona y moderna: fotos en arco con bloque de color, destellos, líneas de colores, marco rosa en tratamientos y opiniones en franja festoneada.',
  },
  {
    id: 'capsula', name: "Cápsula", kind: 'clinica', demo: 'clinica-arrayan', accent: '#1E6FD9',
    ref: { name: "Tend", url: 'https://www.hellotend.com/' },
    idea: "Pacientes en fotos de cápsula a los lados del título, menú en cápsula flotante, palomitas en pastillas, banda verde de aseguradoras con formulario.",
  },
  {
    id: 'cine', name: "Cine", kind: 'clinica', demo: 'clinica-arrayan', accent: '#2BB5B0',
    ref: { name: "Wright Dental Center", url: 'https://www.wrightdentalcenter.com/' },
    idea: "Oscura y de cine: hero a pantalla completa con el título en cursiva, especialistas en franjas oscuras con luz de color, historias de pacientes y cuestionario.",
  },
  {
    id: 'estrellas', name: "Estrellas", kind: 'clinica', demo: 'clinica-arrayan', accent: '#A98BC4',
    ref: { name: "The Little Royals", url: 'https://www.thelittleroyalsdentistry.com/' },
    idea: "Para niños: cielo de noche con estrellas que titilan y un diente con corona ilustrado, letra manuscrita, franjas azul cielo y botones amarillos.",
  },
  {
    id: 'glam', name: "Glam", kind: 'clinica', demo: 'clinica-arrayan', accent: '#3CB4AC',
    ref: { name: "TruGLO Modern Dental (antes Glo Modern Dental)", url: 'https://truglobeverlyhillsdentistry.com/' },
    idea: "Lujo de estética dental: barra negra con amarillo, foto del consultorio a todo lo ancho, credenciales como sellos y tratamientos en caja negra sobre collage.",
  },
  {
    id: 'ciudad', name: "Ciudad", kind: 'clinica', demo: 'clinica-arrayan', accent: '#2A57A8',
    ref: { name: "Downtown Dental", url: 'https://www.downtown-dental.com/' },
    idea: "Para una o varias sucursales: foto de la ciudad con capa azul, tarjeta por sucursal con horario y «abierto ahora», cupón de paciente nuevo y por qué elegirnos numerado.",
  },
  {
    id: 'nogal', name: "Nogal", kind: 'clinica', demo: 'clinica-arrayan', accent: '#A86B45',
    ref: { name: "Bates Dental", url: 'https://batesdental.com/' },
    idea: "Cálida en chocolate y cobre: monograma redondo, fotos encimadas sobre madera de nogal, carrusel de tratamientos y franja de contacto en cuatro columnas.",
  },
];

export const RUBROS = { clinica: 'Clínicas dentales', consultorio: 'Consultorios médicos', restaurante: 'Restaurantes', hotel: 'Hoteles', inmobiliaria: 'Inmobiliarias', despacho: 'Despachos legales' };

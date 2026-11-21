// Catálogo de plantillas por rubro. Cada una se basa en un sitio de referencia
// (ver el documento «Referencias de páginas web por rubro») y es un theme.style propio.
// Lo usan la galería (/plantillas, scripts/plantillas.mjs) y la rutina para elegir diseño.
//   id: theme.style · kind: page.kind · demo: lib/demos/<demo>.js con que se muestra
export const CATALOGO = [
  {
    id: 'estudio', name: 'Estudio', kind: 'clinica', demo: 'clinica-arrayan',
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
  {
    id: 'ola', name: "Ola", kind: 'clinica', demo: 'clinica-arrayan', accent: '#5B2A86',
    ref: { name: "St. Clair Dental", url: 'https://granburydental.com/' },
    idea: "Hero verde con borde de olas, títulos morados, tratamientos con íconos de línea, franja morada en tres columnas y horario con cepillos de colores.",
  },
  {
    id: 'abierto', name: "Abierto", kind: 'clinica', demo: 'clinica-arrayan', accent: '#16A096',
    ref: { name: "Grandridge Dental", url: 'https://grandridgedental.net/' },
    idea: "Práctica y de confianza: barra con «abierto ahora» en vivo y calificación de Google, serif de losa, accesos rápidos y tratamientos que se despliegan.",
  },
  {
    id: 'hogar', name: "Hogar", kind: 'clinica', demo: 'clinica-arrayan', accent: '#E07B57',
    ref: { name: "ABC Dental", url: 'https://abcdentaltexas.com/' },
    idea: "Familiar y cálida: video de bienvenida de la doctora, durazno con patrón suave, tarjetas con íconos de línea, testimonios en coral y «Platiquemos».",
  },
  {
    id: 'menta', name: "Menta", kind: 'clinica', demo: 'clinica-arrayan', accent: '#1F9D6B',
    ref: { name: "Mint Dentistry (según la nota del documento; el sitio bloquea visitas automáticas)", url: 'https://mintdentistry.com/' },
    idea: "Un solo verde de marca en todo, letra redondeada y tarjetas de tratamiento que se voltean al tocarlas.",
  },
  {
    id: 'clara', name: "Clara", kind: 'clinica', demo: 'clinica-arrayan', accent: '#1D3D6E',
    ref: { name: "Cox Bond Dental (según la nota del documento; el sitio bloquea visitas automáticas)", url: 'https://www.coxbonddental.com/' },
    idea: "Profesional y limpia: la portada como tablero con todo a la mano (agendar, horario de hoy, llamar, llegar, precios) e índice fijo de secciones.",
  },
  {
    id: 'revista', name: "Revista", kind: 'clinica', demo: 'clinica-arrayan', accent: '#B4432F',
    ref: { name: "Studio Dental (según la nota del documento; el sitio no carga)", url: 'https://home.studiodental.com/' },
    idea: "Como revista: cabecera con el nombre en grande, portada con titular, texto a columnas con letra capital, citas destacadas y tratamientos como artículos.",
  },
];

export const RUBROS = { clinica: 'Clínicas dentales', consultorio: 'Consultorios médicos', restaurante: 'Restaurantes', hotel: 'Hoteles', inmobiliaria: 'Inmobiliarias', despacho: 'Despachos legales' };

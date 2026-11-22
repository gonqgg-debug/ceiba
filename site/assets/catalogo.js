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
  {
    id: 'ahumado', name: "Ahumado", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#D4472B',
    ref: { name: "Warpigs", url: 'https://www.warpigs.dk/' },
    idea: "Nombre en esténcil enorme sobre la comida, logo que se encoge al bajar, bloques alternados en mayúsculas condensadas, franja negra y carta sobre papel kraft.",
  },
  {
    id: 'deli', name: "Deli", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#1F6B45',
    ref: { name: "Lox in a Box", url: 'https://www.loxinabox.com.au/' },
    idea: "Pila de fotos a todo lo ancho con titulares condensados y botones blancos, rótulo retro, cinta de reseñas y la carta como pizarrón de deli.",
  },
  {
    id: 'banquete', name: "Banquete", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#E8A817',
    ref: { name: "Dinner Ladies", url: 'https://www.dinnerladiesltd.com/' },
    idea: "Para eventos y banquetes: crema, letra de display con carácter, mesa servida en grande, franja mostaza y tarjetas con contorno por tipo de evento.",
  },
  {
    id: 'fonda', name: 'Fonda', kind: 'restaurante', demo: 'restaurante-la-milpa',
    ref: { name: 'Bottega Caruso', url: 'https://www.bottegacaruso.com/' },
    idea: 'Bloques de color de pared a pared, títulos en mayúsculas con palabras resaltadas, trazos a mano que se dibujan y la reservación como boleto.',
  },
  {
    id: 'fantasia', name: "Fantasía", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#C0392B',
    ref: { name: "The Fat Duck", url: 'https://www.thefatduck.co.uk/' },
    idea: "De autor: papel con textura y manchas de acuarela, versalitas espaciadas, la carta como lista de experiencias y fotos sueltas como recortes.",
  },
  {
    id: 'bowl', name: "Bowl", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#2F6B4F',
    ref: { name: "The Salad Project", url: 'https://www.saladproject.co.uk/food' },
    idea: "Saludable y para llevar: foto macro gigante, la carta como tienda con filtros y un panel del platillo elegido para pedir por WhatsApp.",
  },
  {
    id: 'helado', name: "Helado", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#C86B5A',
    ref: { name: "Malai", url: 'https://www.malai.co/' },
    idea: "Para postres y cafés: pantalla partida en dos mitades que se deslizan en sentidos contrarios, terracota, rosa, morado y mosaico de estrellas.",
  },
  {
    id: 'trazo', name: "Trazo", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#7A2E2E',
    ref: { name: "Osteria Angelina", url: 'https://angelina.london/osteria/' },
    idea: "Sobria y con aire: menú vertical a la izquierda, nombre firmado, fotos con marco y un panel de reservación a pantalla completa que se desliza.",
  },
  {
    id: 'tienda', name: "Tienda", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#0E6E62',
    ref: { name: "Rebel Cheese", url: 'https://rebelcheese.com/' },
    idea: "Para vender por pedido: titular grueso, franja de beneficios, citas con estrellas, lo más pedido con «Agregar», filtros por etiqueta y carrito que manda el pedido por WhatsApp.",
  },
  {
    id: 'fijo', name: "Fijo", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#E1A224',
    ref: { name: "Bresca", url: 'https://www.brescadc.com/' },
    idea: "Una foto que se queda fija al fondo mientras pasan encima bloques azul marino y ocre; barra de información arriba y scroll tranquilo.",
  },
  {
    id: 'noche', name: "Noche", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#C9A45C',
    ref: { name: "Craft and Kitchen", url: 'https://artsdistrictkitchen.com/' },
    idea: "Para bares y cenas: fondo negro y dorado, título con palabra manuscrita, collages desplazados y carta con categorías en columna.",
  },
  {
    id: 'recreo', name: "Recreo", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#FF5A36',
    ref: { name: "Middle Child", url: 'https://middlechildphilly.com/' },
    idea: "Divertida: texto que corre, un tren de platillos que pasa por la pantalla, logo que parpadea, colores planos y sombras duras.",
  },
  {
    id: 'taberna', name: "Taberna", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#A6814C',
    ref: { name: "Darwin & Wallace (Portobello Pubs)", url: 'https://darwinandwallace.co.uk/' },
    idea: "Para bares con varias sucursales: tarjetas de «qué está pasando» con botón de reservar, tarjeta por sucursal y bloque de recompensas.",
  },
  {
    id: 'fiesta', name: "Fiesta", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#FF3EA5',
    ref: { name: "Simmons Bar", url: 'https://www.simmonsbar.co.uk/' },
    idea: "Retro y maximalista: morado neón, una figura que sigue al cursor, la foto dentro de una tele vieja y el nombre en fichas de letras.",
  },
  {
    id: 'mercado', name: "Mercado", kind: 'restaurante', demo: 'restaurante-la-milpa', accent: '#F2545B',
    ref: { name: "Talat Market", url: 'https://talatmarketatl.com/' },
    idea: "La mesa llena vista desde arriba, el nombre manuscrito de color y reservar como acción principal, con colores de mercado.",
  },
  {
    id: 'spa', name: "Spa", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#2C7A7B',
    ref: { name: "Wellness & Spa Hotel Kaskady", url: 'https://www.resortkaskady.com/' },
    idea: "Para hoteles con spa: hero turquesa con textura de agua y emblema redondo, reserva arriba y amenidades con recuadro blanco sobre la foto.",
  },
  {
    id: 'egeo', name: "Egeo", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#1C4E9C',
    ref: { name: "Amaris Mykonos", url: 'https://www.amarismykonos.com/' },
    idea: "De playa: mar a todo lo ancho, azul intenso, el nombre gigante como marca de agua, calificación a la vista y habitaciones en tarjetas altas.",
  },
  {
    id: 'alpes', name: "Alpes", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#B89B6A',
    ref: { name: "Swiss Deluxe Hotels", url: 'https://www.swissdeluxehotels.com/' },
    idea: "Selector «Elige tu experiencia» (pareja, familia, descanso) que cambia foto, texto y habitación recomendada; hero oscuro y filas sobrias.",
  },
  {
    id: 'archivo', name: "Archivo", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#8C3B3B',
    ref: { name: "Landa", url: 'https://www.landa.as/es/' },
    idea: "Con historia: papel rosado, la historia centrada como carta, separador de cubiertos y fotos en blanco y negro que toman color.",
  },
  {
    id: 'clasico', name: "Clásico", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#A88B67',
    ref: { name: "The Wallace", url: 'https://thewallace.com/' },
    idea: "Urbano y elegante: hero negro con la calificación al centro, logo en versalitas, foto desplazada, bloques arena y el barrio como parte de la estancia.",
  },
  {
    id: 'selva', name: "Selva", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#A5B58C',
    ref: { name: "Samsara Ubud", url: 'https://www.samsaraubud.com/' },
    idea: "En la naturaleza: carbón oscuro, palabras enormes espaciadas como marca de agua, villas alternadas y una sección para presentar a los dueños.",
  },
  {
    id: 'finca', name: "Finca", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#7B5E3B',
    ref: { name: "Kinross House", url: 'https://www.kinrosshouse.com/' },
    idea: "Hacienda o casa exclusiva: bienvenida centrada con ornamento, dos fotos lado a lado, cita grande sobre fondo oscuro y reservar la casa completa.",
  },
  {
    id: 'glamping', name: "Glamping", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#8E2B2B',
    ref: { name: "Teranga Lodges", url: 'https://www.terangalodges.com/' },
    idea: "Glamping y cabañas: bloques rojo vino con la foto al lado, tres razones con íconos, lista de lo que trae cada alojamiento y FAQ completo para primerizos.",
  },
  {
    id: 'rancho', name: "Rancho", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#5C4A32',
    ref: { name: "Gage Hotel", url: 'https://gagehotel.com/' },
    idea: "Campo o desierto: tres palabras sobre la foto, bloques con caja café desplazada, mosaicos de experiencias y reconocimientos en oscuro.",
  },
  {
    id: 'safari', name: "Safari", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#A2834A',
    ref: { name: "Xigera Safari Lodge", url: 'https://xigera.com/' },
    idea: "Lodge o ecohotel: logo dorado grande, narración por capítulos (llegar, mirar, probar, dormir) con fotos altas, escena nocturna y diario.",
  },
  {
    id: 'motel', name: "Motel", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#C0634A',
    ref: { name: "Amigo Motor Lodge", url: 'https://amigomotorlodge.com/' },
    idea: "Motel renovado o hostal con onda: máquina de escribir, reserva sobre la foto, franja rosa, carrusel de cuartos, promoción terracota y fotos tipo Instagram.",
  },
  {
    id: 'calendario', name: "Calendario", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#2F5D8A',
    ref: { name: "Petunia Ibiza (según las notas; la página no cargó)", url: 'https://www.petunia-ibiza.com/' },
    idea: "Casa vacacional o villa: el calendario de disponibilidad hasta arriba; dos clics eligen llegada y salida y mandan la consulta por WhatsApp.",
  },
  {
    id: 'pelicula', name: "Película", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#D9A441',
    ref: { name: "Lewa House (según las notas; la página solo mostró la pantalla de audio)", url: 'https://www.lewahouse.com/' },
    idea: "Hotel de experiencia: abre con un video a todo lo ancho (o las fotos como escenas), franjas de cine, textos como subtítulos y secciones numeradas como escenas.",
  },
  {
    id: 'reloj', name: "Reloj", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#8C6A4F',
    ref: { name: "K11 Artus (según las notas; la página dio error)", url: 'https://www.k11artus.com/' },
    idea: "Hotel urbano de diseño: reloj en vivo con la hora local que sugiere qué hacer en cada momento (desayuno, alberca, terraza, bar) y una línea del día.",
  },
  {
    id: 'verano', name: "Verano", kind: 'hotel', demo: 'hotel-casa-azahar', accent: '#F0567A',
    ref: { name: "The Drifter (según las notas; la página no cargó)", url: 'https://www.thedrifterhotel.com/' },
    idea: "Motel con alberca u hostal juguetón: letra gorda, rosa, verde agua y amarillo, cinta de palabras, cuartos en tarjetas de colores y calcomanías.",
  },
  {
    id: 'arco', name: "Arco", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#B4583A',
    ref: { name: "Village Properties", url: 'https://villagesite.com/' },
    idea: "Ciudad con carácter: fotos recortadas en arco con los colores de la arquitectura local, cifras en tarjetas, filtros y botón de letra grande.",
  },
  {
    id: 'local', name: "Local", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#25483A',
    ref: { name: "Dwelling in Maine", url: 'https://dwellinginmaine.com/' },
    idea: "Independiente y de su ciudad: verde bosque, sello «de aquí», comparación con una franquicia y valuación gratis para vendedores.",
  },
  {
    id: 'brisa', name: "Brisa", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#2E6B4A',
    ref: { name: "The Malibu Life", url: 'https://themalibulife.com/' },
    idea: "Costa o zona residencial: mayúsculas grandes, precio primero, colonias en mosaico y botones para agrandar la letra y escuchar la página.",
  },
  {
    id: 'cartelera', name: "Cartelera", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#3B82F6',
    ref: { name: "eXp Realty", url: 'https://www.exprealty.com/' },
    idea: "Mucho inventario: frases que cambian en lugar del buscador y propiedades en filas que se deslizan, como en una plataforma de video.",
  },
  {
    id: 'lujo', name: "Lujo", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#C8102E',
    ref: { name: "The Oppenheim Group", url: 'https://ogroup.com/' },
    idea: "Propiedades exclusivas: negro y rojo, letra condensada, zonas en la portada, destacadas en mosaico y cifras grandes.",
  },
  {
    id: 'isla', name: "Isla", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#1F5F8B',
    ref: { name: "Sandpiper Realty", url: 'https://www.sandpiperrealty.com/' },
    idea: "Playa o destino: fotos de la costa, guías de cada zona con sus propiedades y banderas náuticas como detalle.",
  },
  {
    id: 'valua', name: "Valúa", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#1A1A1A',
    ref: { name: "Joyce Rey", url: 'https://joycerey.com/' },
    idea: "Para captar vendedores: «¿Cuánto vale tu casa?» en la portada, en una franja y en la barra fija; tarjetas altas y estilos de vida por zona.",
  },
  {
    id: 'asesora', name: "Asesora", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#8A6D4B',
    ref: { name: "Tracy Tutor", url: 'https://tracytutor.com/' },
    idea: "Marca personal: la asesora es la portada, cifras grandes sobre una foto, destacadas, su forma de trabajar y una nota firmada.",
  },
  {
    id: 'mapa', name: "Mapa", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#C82021',
    ref: { name: "Redfin", url: 'https://www.redfin.com/' },
    idea: "Mucho inventario en la ciudad: mapa y lista lado a lado, filtros sin recargar y «Ver en el mapa» por propiedad.",
  },
  {
    id: 'pregunta', name: "Pregunta", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#5EEAD4',
    ref: { name: "Resider", url: 'https://resider.ca' },
    idea: "Búsqueda escrita: «casa de 3 recámaras en Zapopan hasta 5 millones» filtra las propiedades al momento, con ejemplos para tocar.",
  },
  {
    id: 'atardecer', name: "Atardecer", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#E0613A',
    ref: { name: "Costa Sunsets", url: 'https://costasunsets.com/' },
    idea: "Costa o casas vacacionales: degradado de atardecer, muy ligera, y una búsqueda que se lee como frase («Quiero comprar con 3 recámaras»).",
  },
  {
    id: 'torre', name: "Torre", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#C9A86A',
    ref: { name: "Zorge 9", url: 'https://zorge9.estate/' },
    idea: "Desarrollos y edificios: el edificio dibujado piso por piso; cada piso se ilumina y lleva a la ficha de su unidad.",
  },
  {
    id: 'folleto', name: "Folleto", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#7A6243',
    ref: { name: "111 West 57th St", url: 'http://111w57.com' },
    idea: "Desarrollos y preventas: folleto digital con capítulos en numeral romano, fotos a todo lo ancho, cifras técnicas y hoja de disponibilidad.",
  },
  {
    id: 'ruleta', name: "Ruleta", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#C0533F',
    ref: { name: "LET US Ibiza", url: 'https://letusibiza.com/' },
    idea: "Boutique de destino: frase con carácter, rosa empolvado, mapa de la zona en la portada y fichas que se abren en una ventana con foto o video.",
  },
  {
    id: 'cabana', name: "Cabaña", kind: 'inmobiliaria', demo: 'inmobiliaria-raiz', accent: '#8B5E3C',
    ref: { name: "Hutstuf", url: 'https://hutstuf.com' },
    idea: "Cabañas y casas de arquitecto: madera y bosque, navegación mínima, título vertical junto a la fila de casas y la zona con título grande.",
  },
  {
    id: 'monstruo', name: "Monstruo", kind: 'despacho', demo: 'despacho-ortega', accent: '#1D1D1D',
    ref: { name: "Krivitzky", url: 'https://krivitzky.ru/en/' },
    idea: "Explicar sin miedo: cada problema legal es un monstruo con su escena al hacer scroll, y cómo lo vence el despacho.",
  },
  {
    id: 'bosque', name: "Bosque", kind: 'despacho', demo: 'despacho-ortega', accent: '#2F5D46',
    ref: { name: "Jakub Bartoszewicz", url: 'https://prawnikpracodawcow.pl/' },
    idea: "Asesoría con calma: verde bosque, fotos de naturaleza y una base de guías escritas por el despacho.",
  },
  {
    id: 'portada', name: "Portada", kind: 'despacho', demo: 'despacho-ortega', accent: '#D7263D',
    ref: { name: "Iryce Lawyers", url: 'https://www.iryce.fr/' },
    idea: "Equipo fuerte: maqueta de revista con letra enorme sobre las fotos del equipo, índice de áreas y citas grandes.",
  },
  {
    id: 'proceso', name: "Proceso", kind: 'despacho', demo: 'despacho-ortega', accent: '#1E3A5F',
    ref: { name: "Chand & Co", url: 'https://chandsnider.com/' },
    idea: "Litigio y asuntos largos: áreas explicadas a fondo en pestañas y el proceso del caso paso a paso en línea de tiempo.",
  },
  {
    id: 'dorado', name: "Dorado", kind: 'despacho', demo: 'despacho-ortega', accent: '#B8954E',
    ref: { name: "JGA Legal Advisor", url: 'https://jga.com.pl/' },
    idea: "Corporativo: blanco y dorado, frases del despacho que corren en horizontal, áreas numeradas y equipo sobrio.",
  },
  {
    id: 'recuperado', name: "Recuperado", kind: 'despacho', demo: 'despacho-ortega', accent: '#C6F05A',
    ref: { name: "Young Law Group", url: 'https://young-lawgroup.com/' },
    idea: "Defensa y recuperación: el monto recuperado enorme en la portada, medios como prueba social y resultados en tarjetas.",
  },
  {
    id: 'glosario', name: "Glosario", kind: 'despacho', demo: 'despacho-ortega', accent: '#111111',
    ref: { name: "Zachmann Lawyers", url: 'https://zachmann.law/' },
    idea: "Explicar los términos: blanco y negro, el equipo rotando en la portada y un glosario legal de la A a la Z.",
  },
  {
    id: 'familiar', name: "Familiar", kind: 'despacho', demo: 'despacho-ortega', accent: '#B5573B',
    ref: { name: "Barbara Legate", url: 'https://www.legatelaw.ca/' },
    idea: "Familia y personas: cálido y cercano, y un botón de llamada que muestra el teléfono y si están abiertos ahora.",
  },
  {
    id: 'perfil', name: "Perfil", kind: 'despacho', demo: 'despacho-ortega', accent: '#9A7B4F',
    ref: { name: "Marc Hanslin", url: 'https://www.marchanslin.com/' },
    idea: "Marca personal: una página con fotos en blanco y negro, el nombre en grande y la trayectoria en pocas líneas.",
  },
  {
    id: 'resenas', name: "Reseñas", kind: 'despacho', demo: 'despacho-ortega', accent: '#F5B70A',
    ref: { name: "M&Y Personal Injury", url: 'https://mylawcompany.com/' },
    idea: "Clientes satisfechos: calificación grande y muro de opiniones de 5 estrellas desde la portada, y casos destacados.",
  },
  {
    id: 'consulta', name: "Consulta", kind: 'despacho', demo: 'despacho-ortega', accent: '#3156D3',
    ref: { name: "Stanley Tate", url: 'https://www.tateesq.com/' },
    idea: "Sentirse escuchado: la portada simula una primera consulta (tema, urgencia y enviar por WhatsApp) y testimonios en video.",
  },
  {
    id: 'fundadores', name: "Fundadores", kind: 'despacho', demo: 'despacho-ortega', accent: '#B3122E',
    ref: { name: "Roman Austin", url: 'https://romanaustin.com/' },
    idea: "Historia familiar: clásico con acentos rojos, atención en español e inglés y el video de los fundadores.",
  },
  {
    id: 'resultados', name: "Resultados", kind: 'despacho', demo: 'despacho-ortega', accent: '#E0782F',
    ref: { name: "Richard Hollawell", url: 'https://www.richardhollawell.com/' },
    idea: "Litigio con números: menú grande con todas las áreas, resultados en cifras y la consulta gratis en una ventana.",
  },
  {
    id: 'atencion', name: "Atención", kind: 'despacho', demo: 'despacho-ortega', accent: '#0F8B8D',
    ref: { name: "Mission Legal Center", url: 'https://missionlegalcenter.com/' },
    idea: "Mucha gente que atender: video en la portada, el formulario de consulta visible desde el inicio y botón de chat siempre a la mano.",
  },
  {
    id: 'blanco', name: "Blanco", kind: 'despacho', demo: 'despacho-ortega', accent: '#2B5CE6',
    ref: { name: "Bick Law LLP", url: 'https://www.bicklawllp.com/' },
    idea: "Impecable y premiado: minimalista, mucho espacio en blanco, fotografía grande y un solo color de marca.",
  },
  {
    id: 'accesos', name: "Accesos", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#2F7A6B',
    ref: { name: "Anna Family Healthcare", url: 'https://annafamilyhealthcare.com/' },
    idea: "Muchos pacientes recurrentes: accesos rápidos arriba (agendar, resultados, recetas, formularios) y formularios descargables.",
  },
  {
    id: 'portal', name: "Portal", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#1F5AA6',
    ref: { name: "Goodall-Witcher Healthcare", url: 'https://www.gwhealthcare.org/' },
    idea: "Varias especialidades: portal del paciente y agenda en el encabezado, estructura simple y azul institucional.",
  },
  {
    id: 'velo', name: "Velo", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#5B6FB5',
    ref: { name: "Lanham Neuro Psychology", url: 'https://lanhamneuro.com/' },
    idea: "Especialidades difíciles de explicar: imágenes translúcidas en capas y textos narrativos y calmados.",
  },
  {
    id: 'cirugia', name: "Cirugía", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', page: { casesDemo: true }, accent: '#B08D6A',
    ref: { name: "Weber Facial Plastic Surgery", url: 'https://www.weberfacialplasticsurgery.com/' },
    idea: "Cirugía estética y dermatología: antes y después con deslizador (fotos reales con consentimiento) y blog del médico.",
  },
  {
    id: 'paisaje', name: "Paisaje", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#E86A4E',
    ref: { name: "Nudge Psychology", url: 'https://nudgepsychology.com.au/' },
    idea: "Psicología y bienestar: textos cercanos con humor sobre paisajes que cambian del amanecer a la noche.",
  },
  {
    id: 'aire', name: "Aire", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#7C9A92',
    ref: { name: "Hope Therapy Center", url: 'https://www.hope-therapy-center.com/' },
    idea: "Terapia y salud mental: diseño aireado, colores suaves y blog sobre enfoques de terapia.",
  },
  {
    id: 'paso', name: "Paso", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#D9652B',
    ref: { name: "Integrated Podiatry Clinic", url: 'http://integratedpodiatry.com.au/' },
    idea: "Especialidad con trato cálido: tipografía grande, historia en primera persona y servicios organizados en acordeón.",
  },
  {
    id: 'miel', name: "Miel", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#F2B230',
    ref: { name: "TheraHive", url: 'https://www.therahive.com/' },
    idea: "Terapia amigable: amarillo miel, letra redondeada, dibujos de línea (panal y abeja) y navegación fija.",
  },
  {
    id: 'equipo', name: "Equipo", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#C2533A',
    ref: { name: "Deia Health", url: 'https://www.deiahealth.co.uk/' },
    idea: "Varios especialistas: llamados a agendar dentro del texto y biografías del equipo con foto y «agendar con…».",
  },
  {
    id: 'seda', name: "Seda", kind: 'clinica', rubro: 'consultorio', demo: 'consultorio-salvia', accent: '#6E3B5C',
    ref: { name: "Heva Health", url: 'https://www.hevahealth.com/' },
    idea: "Consultorio premium: serif refinada, perla y ciruela, y animaciones sutiles.",
  },
];

export const RUBROS = { clinica: 'Clínicas dentales', consultorio: 'Consultorios médicos', restaurante: 'Restaurantes', hotel: 'Hoteles', inmobiliaria: 'Inmobiliarias', despacho: 'Despachos legales' };

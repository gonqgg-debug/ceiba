// Catálogo de Ceiba Labs: única fuente de planes, módulos y precios.
// Precios por país, con la misma fórmula de la hoja «Precios por país y consultoría de IA»:
//   precio = máx(0, redondear_hacia_arriba(base_MXN / MXN_POR_USD × nivel × moneda_por_USD, paso) − resta)
// Así terminan en 1,490, 79,000, 89… Para cambiar precios: BASE (MXN), TIERS o COUNTRIES.
//
// Cobro: el servidor calcula los montos con este catálogo según el país de la propuesta y se los
// pasa a Stripe (price_data sobre productos fijos). Nunca usa montos que mande el navegador.
// Ceiba (GQG Holdings LLC, EE. UU.) no cobra IVA por ahora: los montos son el precio final.

export const MXN_PER_USD = 18.37; // tipo de cambio de referencia (revisar cada trimestre)
export const FX_DATE = '2026-11-20';

// Precios base en pesos mexicanos (nivel 1)
export const BASE = {
  esencial: { activation: 0, monthly: 1490 },
  negocio: { activation: 2990, monthly: 2490 },
  avanzado: { activation: 5990, monthly: 3990 },
  whatsapp: { activation: 2990, monthly: 1490 },
  negocio_whatsapp: { activation: 4990, monthly: 3490 }, // paquete con descuento
};

// Niveles de precio por país (% del precio base). Nichos turísticos (hoteles, villas,
// inmobiliarias) siempre van en nivel 1, aunque el país sea de otro nivel.
export const TIERS = { 1: 1, 2: 0.8, 3: 0.65 };
export const CONSULTING_TIERS = { 1: 1, 2: 0.9, 3: 0.8 };

export const CURRENCIES = {
  mxn: { code: 'MXN', name: 'pesos mexicanos', symbol: '$', locale: 'es-MX', decimals: 2 },
  usd: { code: 'USD', name: 'dólares', symbol: 'US$', locale: 'en-US', decimals: 2 },
  clp: { code: 'CLP', name: 'pesos chilenos', symbol: '$', locale: 'es-CL', decimals: 0 },
  cop: { code: 'COP', name: 'pesos colombianos', symbol: '$', locale: 'es-CO', decimals: 2 },
  pen: { code: 'PEN', name: 'soles', symbol: 'S/', locale: 'es-PE', decimals: 2 },
  dop: { code: 'DOP', name: 'pesos dominicanos', symbol: 'RD$', locale: 'es-DO', decimals: 2 },
};

// fx: unidades de la moneda por 1 USD. step/sub: redondeo (hacia arriba al paso, menos la resta).
const usd = (tier, name) => ({ name, currency: 'usd', tier, fx: 1, step: 10, sub: 1 });
export const COUNTRIES = {
  MX: { name: 'México', currency: 'mxn', tier: 1, fx: MXN_PER_USD, step: 100, sub: 10 },
  CL: { name: 'Chile', currency: 'clp', tier: 1, fx: 977, step: 10000, sub: 1000 },
  PA: usd(1, 'Panamá'), CR: usd(1, 'Costa Rica'), UY: usd(1, 'Uruguay'), PR: usd(1, 'Puerto Rico'),
  CO: { name: 'Colombia', currency: 'cop', tier: 2, fx: 3246, step: 10000, sub: 1000 },
  PE: { name: 'Perú', currency: 'pen', tier: 2, fx: 3.43, step: 10, sub: 1 },
  DO: { name: 'República Dominicana', currency: 'dop', tier: 2, fx: 64, step: 100, sub: 10 },
  EC: usd(2, 'Ecuador'), GT: usd(2, 'Guatemala'), SV: usd(2, 'El Salvador'), AR: usd(2, 'Argentina'),
  BO: usd(3, 'Bolivia'), PY: usd(3, 'Paraguay'), HN: usd(3, 'Honduras'), NI: usd(3, 'Nicaragua'),
  XX: usd(1, 'Otro país'), // cualquier país que no esté en la lista: dólares, nivel 1
};
export const DEFAULT_COUNTRY = 'MX';
export const countryCode = c => (Object.hasOwn(COUNTRIES, String(c || '').toUpperCase()) ? String(c).toUpperCase() : (c ? 'XX' : DEFAULT_COUNTRY));
export const countryInfo = c => ({ code: countryCode(c), ...COUNTRIES[countryCode(c)] });

export const PLANS = {
  esencial: {
    name: 'Plan Esencial',
    description: 'Hasta 3 páginas pensadas para el celular, con hosting, mantenimiento, SEO base y optimización para IA, formulario y botón de WhatsApp. Sin pago inicial. Hasta 30 minutos de cambios al mes.',
  },
  negocio: {
    name: 'Plan Negocio',
    description: 'Hasta 7 páginas, conectadas con la agenda del negocio, con reporte de cuántas personas te contactan, análisis avanzado de SEO y prueba de visibilidad en IA cada 3 meses. Hasta 60 minutos de cambios al mes.',
  },
  avanzado: {
    name: 'Plan Avanzado',
    description: 'Hasta 12 páginas con catálogo de propiedades, habitaciones o servicios que tú actualizas, reporte mensual de visibilidad en IA y Google y una mejora de SEO aplicada al mes. Hasta 120 minutos de cambios al mes.',
  },
};
export const ADDONS = {
  whatsapp: {
    name: 'Asistente de WhatsApp',
    description: 'Contesta en WhatsApp y en tu página con las respuestas que apruebas, anota los datos para la cita o cotización y te pasa lo que necesita una persona. Un número y una sucursal. Piloto con hasta 300 conversaciones al mes.',
  },
};
export const BUNDLES = {
  negocio_whatsapp: { name: 'Plan Negocio + Asistente de WhatsApp', plan: 'negocio', addon: 'whatsapp' },
};

// Consultoría de IA (se cotiza y factura aparte). Base en MXN; fuera de México, en dólares
// con el nivel de consultoría del país. «show»: cómo se muestra en la web.
export const CONSULTING = {
  descubrimiento: { name: 'Llamada de descubrimiento', amount: 0, show: 'gratis', description: '30 minutos por video, con un formulario previo para conocer tu negocio.' },
  diagnostico_ia: { name: 'Diagnóstico de IA', amount: 9900, show: 'desde', description: 'Dos sesiones, mapa de procesos y plan por etapas con costos y retorno esperado. Se acredita al 100% a la implementación si la contratas en 30 días.' },
  implementacion_chica: { name: 'Implementación', amount: 19900, show: 'desde', description: 'Una automatización o agente: asistente de WhatsApp avanzado, reporte diario o conciliación simple.' },
  implementacion_mediana: { name: 'Implementación mediana', amount: 49900, show: 'no', description: 'Dos a tres procesos conectados a tus sistemas (CRM, facturación, agenda).' },
  implementacion_grande: { name: 'Implementación grande', amount: 99900, show: 'no', description: 'Varias áreas e integraciones a la medida.' },
  operacion_chica: { name: 'Operación mensual', amount: 4990, monthly: true, show: 'desde', description: 'Monitoreo, ajustes y uso de IA incluido para una automatización.' },
  operacion_mediana: { name: 'Operación mensual mediana', amount: 9990, monthly: true, show: 'no', description: 'Hasta 3 automatizaciones, mejoras mensuales y reporte de resultados.' },
  operacion_grande: { name: 'Operación mensual grande', amount: 19990, monthly: true, show: 'no', description: 'Varias áreas, con revisión mensual contigo.' },
};

// ---------- cálculo ----------
const round6 = n => Math.round(n * 1e6) / 1e6; // evita que 1490.0000001 suba un escalón
const ceilTo = (n, step) => Math.ceil(round6(n / step)) * step;
export function priceFor(country, key, phase, { touristic = false } = {}) {
  const c = countryInfo(country);
  const base = BASE[key]?.[phase];
  if (base == null) throw new Error(`Precio desconocido: ${key}.${phase}`);
  if (!base) return 0;
  const tier = TIERS[touristic ? 1 : c.tier];
  return Math.max(0, ceilTo((base / MXN_PER_USD) * tier * c.fx, c.step) - c.sub);
}
export function consultingFor(country, key) {
  const c = countryInfo(country), item = CONSULTING[key];
  if (!item) throw new Error(`Servicio desconocido: ${key}`);
  if (c.currency === 'mxn') return { currency: 'mxn', amount: item.amount };
  const usdBase = Math.round(item.amount / MXN_PER_USD / 10) * 10;
  return { currency: 'usd', amount: Math.round(usdBase * CONSULTING_TIERS[c.tier] / 10) * 10 };
}

// Partes que se cobran por un paquete. Negocio + WhatsApp usa el precio del paquete:
// el asistente se cobra como la diferencia (así Stripe ve los dos productos).
export function packageLines(planId, withWhatsapp, country, opts = {}) {
  if (!PLANS[planId]) throw new Error(`Plan desconocido: ${planId}`);
  const p = phase => priceFor(country, planId, phase, opts);
  const lines = [{ kind: 'web', id: planId, name: PLANS[planId].name, activation: p('activation'), monthly: p('monthly') }];
  if (withWhatsapp) {
    const bundle = Object.entries(BUNDLES).find(([, b]) => b.plan === planId && b.addon === 'whatsapp')?.[0];
    const wa = phase => (bundle ? priceFor(country, bundle, phase, opts) - p(phase) : priceFor(country, 'whatsapp', phase, opts));
    lines.push({ kind: 'modulo', id: 'whatsapp', name: ADDONS.whatsapp.name + (bundle ? ' (precio en paquete)' : ''), activation: wa('activation'), monthly: wa('monthly') });
  }
  return lines;
}
export function packageTotals(planId, withWhatsapp, country, opts = {}) {
  const lines = packageLines(planId, withWhatsapp, country, opts);
  return { activation: lines.reduce((a, l) => a + l.activation, 0), monthly: lines.reduce((a, l) => a + l.monthly, 0), currency: countryInfo(country).currency };
}

// Monto para Stripe (en la unidad mínima de la moneda)
export const stripeAmount = (n, cur) => Math.round(n * (CURRENCIES[cur]?.decimals === 0 ? 1 : 100));
export function formatMoney(n, cur = 'mxn', { code = false } = {}) {
  const c = CURRENCIES[cur] || CURRENCIES.mxn;
  return `${c.symbol}${Number(n).toLocaleString('en-US')}${code ? ` ${c.code}` : ''}`;
}

// Productos fijos en Stripe (los montos van en price_data al cobrar)
export const productId = (kind, id, phase) => `ceiba_${kind}_${id}_${phase}`;
export const TAX_CODES = {
  websiteDesign: 'txcd_10701200', websiteHosting: 'txcd_10701100', saasBusiness: 'txcd_10103001', consulting: 'txcd_20060048',
};

// Precios de un país para mostrar en las páginas (y en llms.txt / datos estructurados)
export function countryPrices(country) {
  const c = countryInfo(country), out = { web: {}, modulo: {}, paquete: {}, consultoria: {} };
  for (const id of Object.keys(PLANS)) out.web[id] = { activation: priceFor(c.code, id, 'activation'), monthly: priceFor(c.code, id, 'monthly') };
  out.modulo.whatsapp = { activation: priceFor(c.code, 'whatsapp', 'activation'), monthly: priceFor(c.code, 'whatsapp', 'monthly') };
  out.paquete.negocio_whatsapp = { activation: priceFor(c.code, 'negocio_whatsapp', 'activation'), monthly: priceFor(c.code, 'negocio_whatsapp', 'monthly') };
  // el asistente dentro del paquete (diferencia contra el Plan Negocio solo)
  out.paquete.whatsapp_en_paquete = { activation: out.paquete.negocio_whatsapp.activation - out.web.negocio.activation, monthly: out.paquete.negocio_whatsapp.monthly - out.web.negocio.monthly };
  for (const [id, item] of Object.entries(CONSULTING)) if (item.show !== 'no') out.consultoria[id] = consultingFor(c.code, id);
  return out;
}

// Catálogo para el navegador (solo montos y nombres, nada secreto)
export function publicCatalog() {
  return {
    default: DEFAULT_COUNTRY,
    currencies: CURRENCIES,
    countries: Object.fromEntries(Object.entries(COUNTRIES).map(([k, v]) => [k, { name: v.name, currency: v.currency }])),
    prices: Object.fromEntries(Object.keys(COUNTRIES).map(k => [k, countryPrices(k)])),
  };
}

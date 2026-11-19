// Catálogo de Ceiba Labs: única fuente de planes, módulos y precios.
// Montos finales por moneda. Ceiba es una empresa de EE. UU. y por ahora no cobra IVA
// mexicano; tax_behavior "inclusive" deja el monto tal cual si algún día se activa Stripe Tax.
// El servidor nunca confía en montos que mande el navegador: busca los
// precios en Stripe por lookup_key y cobra en la moneda guardada en la propuesta.
//
// Multimoneda: cada precio de Stripe tiene la moneda base (MXN) y las demás en
// currency_options. Para abrir un mercado nuevo:
//   1. Agrega la moneda en CURRENCIES y su monto en `prices` de cada plan, módulo y servicio.
//   2. Corre scripts/stripe-setup.mjs (crea los precios nuevos en Stripe).
//   3. Cuando quieras mostrarla en las páginas públicas, pon `public: true`.
// Mientras `public` sea false, ya se puede usar en propuestas desde /admin.

export const CURRENCY = 'mxn'; // moneda base

export const CURRENCIES = {
  mxn: { code: 'MXN', name: 'pesos mexicanos', symbol: '$', locale: 'es-MX', public: true, countries: ['MX'] },
  usd: { code: 'USD', name: 'dólares estadounidenses', symbol: 'US$', locale: 'en-US', public: false, countries: [] }, // por defecto para el resto del mundo
};
export const isCurrency = c => Object.hasOwn(CURRENCIES, c);
export const currencyFor = country => Object.keys(CURRENCIES).find(c => CURRENCIES[c].public && CURRENCIES[c].countries.includes(country)) || (CURRENCIES.usd.public ? 'usd' : CURRENCY);
export function formatMoney(n, cur = CURRENCY, { code = false } = {}) {
  const c = CURRENCIES[cur] || CURRENCIES[CURRENCY];
  return `${c.symbol}${Number(n).toLocaleString('en-US')}${code ? ` ${c.code}` : ''}`;
}

// Códigos fiscales de Stripe Tax (https://docs.stripe.com/tax/tax-codes)
export const TAX_CODES = {
  websiteDesign: 'txcd_10701200', // activación: diseño de la web
  websiteHosting: 'txcd_10701100', // mensualidad: hosting y mantenimiento
  saasBusiness: 'txcd_10103001', // módulo de recepción por WhatsApp
  consulting: 'txcd_20060048', // consultoría de IA
};

export const PLANS = {
  esencial: {
    name: 'Plan Esencial',
    description: 'Hasta 3 páginas pensadas para el celular, con hosting, mantenimiento, SEO base y optimización para IA, formulario y botón de WhatsApp. Hasta 30 minutos de cambios al mes.',
    activation: 3490,
    monthly: 1490,
    prices: { usd: { activation: 199, monthly: 79 } },
  },
  negocio: {
    name: 'Plan Negocio',
    description: 'Hasta 7 páginas, conectadas con la agenda del negocio, con reporte de cuántas personas te contactan, análisis avanzado de SEO y prueba de visibilidad en IA cada 3 meses. Hasta 60 minutos de cambios al mes.',
    activation: 5490,
    monthly: 2490,
    prices: { usd: { activation: 299, monthly: 139 } },
  },
  avanzado: {
    name: 'Plan Avanzado',
    description: 'Hasta 12 páginas con catálogo de propiedades, habitaciones o servicios que tú actualizas, reporte mensual de visibilidad en IA y Google y una mejora de SEO aplicada al mes. Hasta 120 minutos de cambios al mes.',
    activation: 8490,
    monthly: 3990,
    prices: { usd: { activation: 479, monthly: 219 } },
  },
};

export const ADDONS = {
  whatsapp: {
    name: 'Asistente de WhatsApp',
    description: 'Contesta en WhatsApp y en tu página con las respuestas que apruebas, anota los datos para la cita o cotización y te pasa lo que necesita una persona. Un número y una sucursal. Piloto con hasta 300 conversaciones al mes.',
    activation: 3990,
    monthly: 1490,
    prices: { usd: { activation: 219, monthly: 79 } },
  },
};

// Consultoría de IA: se cobra por factura. El piloto se cotiza a medida.
export const CONSULTING = {
  diagnostico_ia: {
    name: 'Diagnóstico de IA',
    description: 'Diagnóstico de procesos de atención, ventas u operación. Su costo se descuenta del proyecto si se contrata.',
    amount: 3900,
    prices: { usd: { amount: 219 } },
  },
};

// Precios mostrados en /ia que se cotizan o facturan aparte (no están en Stripe).
export const QUOTED = {
  piloto_ia: { name: 'Piloto de agentes y automatización', from: 19900, prices: { usd: { from: 1099 } } },
};

// Montos de un concepto en una moneda (la base si no hay otra)
export function amounts(item, cur = CURRENCY) {
  if (cur === CURRENCY || !item.prices?.[cur]) return { activation: item.activation, monthly: item.monthly, amount: item.amount, from: item.from };
  return item.prices[cur];
}
// Monedas con precio para todo el catálogo
export const pricedCurrencies = () => Object.keys(CURRENCIES).filter(c => c === CURRENCY || [...Object.values(PLANS), ...Object.values(ADDONS), ...Object.values(CONSULTING)].every(i => i.prices?.[c]));

// lookup_key estable para cada precio, p. ej. "web_negocio_activacion"
export const lookupKey = (kind, id, phase) => `${kind}_${id}_${phase}`;

// Todos los precios que deben existir en Stripe
export function allPrices() {
  const out = [];
  // Montos en las demás monedas: { usd: 199, ... }
  const other = (item, field) => Object.fromEntries(Object.entries(item.prices || {}).filter(([, v]) => v[field] != null).map(([c, v]) => [c, v[field]]));
  const add = (kind, id, item, taxActivation, taxMonthly) => {
    out.push({ kind, id, item, phase: 'activacion', amount: item.activation, other: other(item, 'activation'), recurring: null, taxCode: taxActivation });
    out.push({ kind, id, item, phase: 'mensual', amount: item.monthly, other: other(item, 'monthly'), recurring: { interval: 'month' }, taxCode: taxMonthly });
  };
  for (const [id, plan] of Object.entries(PLANS)) add('web', id, plan, TAX_CODES.websiteDesign, TAX_CODES.websiteHosting);
  for (const [id, addon] of Object.entries(ADDONS)) add('modulo', id, addon, TAX_CODES.saasBusiness, TAX_CODES.saasBusiness);
  for (const [id, svc] of Object.entries(CONSULTING)) out.push({ kind: 'consultoria', id, item: svc, phase: 'unico', amount: svc.amount, other: other(svc, 'amount'), recurring: null, taxCode: TAX_CODES.consulting });
  return out.map(p => ({ ...p, lookupKey: lookupKey(p.kind, p.id, p.phase), productKey: `${p.kind}_${p.id}` }));
}

// Totales de un paquete (para mostrar y para validar)
export function packageTotals(planId, withWhatsapp, cur = CURRENCY) {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Plan desconocido: ${planId}`);
  const parts = [plan, ...(withWhatsapp ? [ADDONS.whatsapp] : [])].map(p => amounts(p, cur));
  return {
    activation: parts.reduce((a, p) => a + p.activation, 0),
    monthly: parts.reduce((a, p) => a + p.monthly, 0),
  };
}

// Catálogo para el navegador (solo montos y nombres, nada secreto)
export function publicCatalog() {
  const pick = (group, fields) => Object.fromEntries(Object.entries(group).map(([id, it]) => [id, Object.fromEntries(pricedCurrencies().map(c => [c, Object.fromEntries(fields.map(f => [f, amounts(it, c)[f]]))]))]));
  return {
    base: CURRENCY,
    currencies: Object.fromEntries(pricedCurrencies().map(c => [c, CURRENCIES[c]])),
    web: pick(PLANS, ['activation', 'monthly']),
    modulo: pick(ADDONS, ['activation', 'monthly']),
    consultoria: pick(CONSULTING, ['amount']),
    cotizado: pick(QUOTED, ['from']),
  };
}

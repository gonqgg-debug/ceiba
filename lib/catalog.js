// Catálogo de Ceiba Labs: única fuente de planes, módulos y precios.
// Montos finales en MXN. Ceiba es una empresa de EE. UU. y por ahora no cobra IVA
// mexicano; tax_behavior "inclusive" deja el monto tal cual si algún día se activa Stripe Tax.
// El servidor nunca confía en montos que mande el navegador: busca los
// precios en Stripe por lookup_key.

export const CURRENCY = 'mxn';

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
    description: 'Hasta 3 páginas pensadas para el celular, con hosting, mantenimiento, SEO básico, formulario y botón de WhatsApp. Hasta 30 minutos de cambios al mes.',
    activation: 3490,
    monthly: 1490,
  },
  negocio: {
    name: 'Plan Negocio',
    description: 'Hasta 7 páginas, conectadas con la agenda del negocio, con reporte de cuántas personas te contactan. Hasta 60 minutos de cambios al mes.',
    activation: 5490,
    monthly: 2490,
  },
  avanzado: {
    name: 'Plan Avanzado',
    description: 'Hasta 12 páginas con catálogo de propiedades, habitaciones o servicios que tú actualizas. Hasta 120 minutos de cambios al mes.',
    activation: 8490,
    monthly: 3990,
  },
};

export const ADDONS = {
  whatsapp: {
    name: 'Asistente de WhatsApp',
    description: 'Contesta en WhatsApp y en tu página con las respuestas que apruebas, anota los datos para la cita o cotización y te pasa lo que necesita una persona. Un número y una sucursal. Piloto con hasta 300 conversaciones al mes.',
    activation: 3990,
    monthly: 1490,
  },
};

// Consultoría de IA: se cobra por factura. El piloto se cotiza a medida.
export const CONSULTING = {
  diagnostico_ia: {
    name: 'Diagnóstico de IA',
    description: 'Diagnóstico de procesos de atención, ventas u operación. Su costo se descuenta del proyecto si se contrata.',
    amount: 3900,
  },
};

// lookup_key estable para cada precio, p. ej. "web_negocio_activacion"
export const lookupKey = (kind, id, phase) => `${kind}_${id}_${phase}`;

// Todos los precios que deben existir en Stripe
export function allPrices() {
  const out = [];
  const add = (kind, id, item, taxActivation, taxMonthly) => {
    out.push({ kind, id, item, phase: 'activacion', amount: item.activation, recurring: null, taxCode: taxActivation });
    out.push({ kind, id, item, phase: 'mensual', amount: item.monthly, recurring: { interval: 'month' }, taxCode: taxMonthly });
  };
  for (const [id, plan] of Object.entries(PLANS)) add('web', id, plan, TAX_CODES.websiteDesign, TAX_CODES.websiteHosting);
  for (const [id, addon] of Object.entries(ADDONS)) add('modulo', id, addon, TAX_CODES.saasBusiness, TAX_CODES.saasBusiness);
  for (const [id, svc] of Object.entries(CONSULTING)) out.push({ kind: 'consultoria', id, item: svc, phase: 'unico', amount: svc.amount, recurring: null, taxCode: TAX_CODES.consulting });
  return out.map(p => ({ ...p, lookupKey: lookupKey(p.kind, p.id, p.phase), productKey: `${p.kind}_${p.id}` }));
}

// Totales de un paquete (para mostrar y para validar)
export function packageTotals(planId, withWhatsapp) {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Plan desconocido: ${planId}`);
  const parts = [plan, ...(withWhatsapp ? [ADDONS.whatsapp] : [])];
  return {
    activation: parts.reduce((a, p) => a + p.activation, 0),
    monthly: parts.reduce((a, p) => a + p.monthly, 0),
  };
}

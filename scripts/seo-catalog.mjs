// Catálogo (precios de México) para site_seo.py: datos estructurados y llms.txt.
import { PLANS, ADDONS, CONSULTING, COUNTRIES, countryPrices } from '../lib/catalog.js';
const mx = countryPrices('MX');
const out = {
  plans: Object.fromEntries(Object.entries(PLANS).map(([id, p]) => [id, { ...p, ...mx.web[id] }])),
  whatsapp: { ...ADDONS.whatsapp, ...mx.modulo.whatsapp },
  bundle: { name: 'Plan Negocio + Asistente de WhatsApp', ...mx.paquete.negocio_whatsapp },
  diagnostico: { ...CONSULTING.diagnostico_ia, amount: mx.consultoria.diagnostico_ia.amount },
  piloto: { name: CONSULTING.implementacion_chica.name, description: CONSULTING.implementacion_chica.description, from: mx.consultoria.implementacion_chica.amount },
  operacion: { name: CONSULTING.operacion_chica.name, description: CONSULTING.operacion_chica.description, from: mx.consultoria.operacion_chica.amount },
  countries: Object.entries(COUNTRIES).filter(([k]) => k !== 'XX').map(([, c]) => c.name),
};
process.stdout.write(JSON.stringify(out));

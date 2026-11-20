#!/usr/bin/env node
// Crea o actualiza en Stripe el catálogo de Ceiba Labs y el portal de clientes.
// Es idempotente: se puede ejecutar varias veces sin duplicar nada.
//
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
//
// - Un producto por concepto con ID fijo (ceiba_web_negocio_activacion, ...),
//   porque el código fiscal de Stripe Tax va en el producto.
// - Los montos ya no viven en Stripe: el servidor los calcula por país con lib/catalog.js
//   y los manda como price_data al cobrar. Aquí solo se crean los productos.
import { PLANS, ADDONS, CONSULTING, TAX_CODES } from '../lib/catalog.js';
import { stripe } from '../lib/stripe.js';

const s = stripe();
const mode = process.env.STRIPE_SECRET_KEY?.includes('_live_') ? 'PRODUCCIÓN' : 'prueba';
console.log(`Catálogo de Ceiba Labs en modo ${mode}\n`);

async function ensureProduct(key, item, taxCode) {
  const id = `ceiba_${key}`;
  const data = { name: item.name, description: item.description, tax_code: taxCode, metadata: { ceiba_key: key } };
  try {
    const p = await s.products.retrieve(id);
    const changed = p.name !== data.name || p.description !== data.description || p.tax_code !== taxCode || !p.active;
    if (changed) await s.products.update(id, { ...data, active: true });
    console.log(`  producto ${id}${changed ? ' (actualizado)' : ''}`);
    return id;
  } catch (e) {
    if (e.code !== 'resource_missing') throw e;
    await s.products.create({ id, ...data });
    console.log(`  producto ${id} (creado)`);
    return id;
  }
}

async function ensurePortal() {
  const config = {
    business_profile: {
      headline: 'Ceiba Labs · Tu suscripción, pagos y facturas',
      privacy_policy_url: 'https://www.ceibalabs.io/privacidad',
      terms_of_service_url: 'https://www.ceibalabs.io/terminos',
    },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ['email', 'address', 'tax_id', 'name'] },
      // Cancelación y cambio de plan desactivados hasta definir la política de permanencia.
      subscription_cancel: { enabled: false },
      subscription_update: { enabled: false },
    },
    login_page: { enabled: true },
    metadata: { ceiba_key: 'portal_default' },
  };
  const list = await s.billingPortal.configurations.list({ limit: 100 });
  const mine = list.data.find(c => c.metadata?.ceiba_key === 'portal_default');
  const res = mine ? await s.billingPortal.configurations.update(mine.id, config)
                   : await s.billingPortal.configurations.create(config);
  if (!res.is_default) console.log('  (nota: el portal por defecto es otro; Ceiba usa esta configuración explícitamente)');
  console.log(`\nPortal de clientes ${res.id} ${mine ? 'actualizado' : 'creado'}`);
  console.log(`  Enlace de acceso para clientes: ${res.login_page.url || '(se genera al activar el modo en vivo)'}`);
  return res;
}

const PHASE_LABEL = { activacion: 'Pago inicial', mensual: 'Mensualidad' };
const items = [
  ...Object.entries(PLANS).flatMap(([id, it]) => [['web', id, it, 'activacion', TAX_CODES.websiteDesign], ['web', id, it, 'mensual', TAX_CODES.websiteHosting]]),
  ...Object.entries(ADDONS).flatMap(([id, it]) => [['modulo', id, it, 'activacion', TAX_CODES.saasBusiness], ['modulo', id, it, 'mensual', TAX_CODES.saasBusiness]]),
];
for (const [kind, id, it, phase, tax] of items) await ensureProduct(`${kind}_${id}_${phase}`, { name: `${it.name} · ${PHASE_LABEL[phase]}`, description: it.description }, tax);
await ensureProduct('consultoria_diagnostico_ia_unico', { name: CONSULTING.diagnostico_ia.name, description: CONSULTING.diagnostico_ia.description }, TAX_CODES.consulting);
await ensurePortal();
console.log('\nListo.');

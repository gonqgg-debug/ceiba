#!/usr/bin/env node
// Crea o actualiza en Stripe el catálogo de Ceiba Labs y el portal de clientes.
// Es idempotente: se puede ejecutar varias veces sin duplicar nada.
//
//   STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
//
// - Un producto por concepto con ID fijo (ceiba_web_negocio_activacion, ...),
//   porque el código fiscal de Stripe Tax va en el producto.
// - Precios identificados por lookup_key. Si cambia un monto, se crea un precio
//   nuevo y se le transfiere la lookup_key; el anterior queda archivado.
import { allPrices, CURRENCY } from '../lib/catalog.js';
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

async function ensurePrice(p, productId) {
  const unit_amount = p.amount * 100; // centavos
  // Las demás monedas van en currency_options del mismo precio (Checkout y
  // Suscripciones eligen la moneda con el parámetro `currency`).
  const currency_options = Object.fromEntries(Object.entries(p.other || {}).map(([c, amt]) => [c, { unit_amount: amt * 100, tax_behavior: 'inclusive' }]));
  const show = `${p.amount} MXN${Object.entries(p.other || {}).map(([c, a]) => ` / ${a} ${c.toUpperCase()}`).join('')}`;
  const existing = (await s.prices.list({ lookup_keys: [p.lookupKey], limit: 1, expand: ['data.currency_options'] })).data[0];
  const sameOptions = existing && Object.entries(currency_options).every(([c, o]) => existing.currency_options?.[c]?.unit_amount === o.unit_amount)
    && Object.keys(existing.currency_options || {}).filter(c => c !== CURRENCY).length === Object.keys(currency_options).length;
  const same = existing && existing.unit_amount === unit_amount && existing.currency === CURRENCY &&
    existing.product === productId && existing.tax_behavior === 'inclusive' && sameOptions &&
    (existing.recurring?.interval ?? null) === (p.recurring?.interval ?? null);
  if (same) { console.log(`    precio ${p.lookupKey}: ${show} (sin cambios)`); return existing.id; }
  const price = await s.prices.create({
    product: productId,
    currency: CURRENCY,
    unit_amount,
    tax_behavior: 'inclusive', // el monto es el precio final
    ...(Object.keys(currency_options).length ? { currency_options } : {}),
    lookup_key: p.lookupKey,
    transfer_lookup_key: true,
    nickname: `${p.item.name} · ${p.phase}`,
    ...(p.recurring ? { recurring: p.recurring } : {}),
    metadata: { ceiba_key: p.lookupKey },
  });
  if (existing) await s.prices.update(existing.id, { active: false });
  console.log(`    precio ${p.lookupKey}: ${show} (${existing ? 'reemplazado' : 'creado'})`);
  return price.id;
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

const PHASE_LABEL = { activacion: 'Pago inicial', mensual: 'Mensualidad', unico: '' };
for (const p of allPrices()) {
  const label = PHASE_LABEL[p.phase];
  const item = { name: label ? `${p.item.name} · ${label}` : p.item.name, description: p.item.description };
  const productId = await ensureProduct(p.lookupKey, item, p.taxCode);
  await ensurePrice(p, productId);
}
await ensurePortal();
console.log('\nListo.');

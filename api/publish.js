// POST /api/publish  (uso interno del equipo de Ceiba)
// Se llama el día en que se publica la web del cliente: crea la suscripción
// mensual con la tarjeta que guardó al pagar la activación.
//
//   curl -X POST https://www.ceibalabs.io/api/publish \
//     -H "Authorization: Bearer $CEIBA_ADMIN_TOKEN" \
//     -H "Content-Type: application/json" \
//     -d '{"customer":"cus_..."}'
//
// Es idempotente: si el cliente ya tiene su suscripción, la devuelve sin crear otra.
import { timingSafeEqual } from 'node:crypto';
import { json, stripe } from '../lib/stripe.js';
import { PROPOSALS } from '../lib/proposals.js';

function authorized(request) {
  const expected = process.env.CEIBA_ADMIN_TOKEN;
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!expected || !given) return false;
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request) {
  if (!authorized(request)) return json({ error: 'No autorizado.' }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }
  const s = stripe();

  // Acepta el cliente o la sesión de Checkout de la activación.
  let customerId = body?.customer;
  if (!customerId && body?.session_id) customerId = (await s.checkout.sessions.retrieve(body.session_id)).customer;
  if (!customerId) return json({ error: 'Indica "customer" o "session_id".' }, 400);

  const customer = await s.customers.retrieve(customerId);
  const meta = customer.metadata || {};
  if (meta.ceiba_status !== 'activada' && meta.ceiba_status !== 'publicada') {
    return json({ error: 'Este cliente no tiene una activación pagada.' }, 409);
  }

  const existing = await s.subscriptions.list({ customer: customerId, status: 'all', limit: 10 });
  const current = existing.data.find(sub => sub.metadata?.ceiba_proposal === meta.ceiba_proposal && sub.status !== 'canceled');
  if (current) return json({ subscription: current.id, status: current.status, already: true });

  const keys = (meta.ceiba_monthly_keys || '').split(',').filter(Boolean);
  const { data: prices } = await s.prices.list({ lookup_keys: keys, active: true, limit: 10 });
  if (prices.length !== keys.length) return json({ error: 'Faltan precios mensuales en Stripe.' }, 500);

  const business = PROPOSALS[meta.ceiba_proposal]?.business ?? customer.name ?? '';
  const subscription = await s.subscriptions.create({
    customer: customerId,
    items: prices.map(p => ({ price: p.id })),
    default_payment_method: customer.invoice_settings?.default_payment_method || undefined,
    billing_mode: { type: 'flexible' },
    automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
    off_session: true,
    payment_behavior: 'allow_incomplete',
    description: `Mensualidad · ${business}`,
    metadata: {
      ceiba_proposal: meta.ceiba_proposal,
      ceiba_plan: meta.ceiba_plan,
      ceiba_whatsapp: meta.ceiba_whatsapp,
    },
  }, { idempotencyKey: `ceiba-publish-${customerId}-${meta.ceiba_proposal}` });

  await s.customers.update(customerId, { metadata: { ceiba_status: 'publicada', ceiba_published_at: new Date().toISOString() } });
  return json({ subscription: subscription.id, status: subscription.status });
}

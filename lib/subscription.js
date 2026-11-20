// Arranca la mensualidad de un cliente el día que se publica su página, con la tarjeta
// que guardó al pagar el monto inicial. Idempotente: si ya existe, la devuelve.
import { stripe } from './stripe.js';
import { getProposal } from './proposals.js';
import { stripeAmount } from './catalog.js';

export async function startSubscription(customerId) {
  const s = stripe();
  const customer = await s.customers.retrieve(customerId);
  const meta = customer.metadata || {};
  if (meta.ceiba_status !== 'activada' && meta.ceiba_status !== 'publicada') {
    throw Object.assign(new Error('Este cliente no tiene una activación pagada.'), { status: 409 });
  }

  const existing = await s.subscriptions.list({ customer: customerId, status: 'all', limit: 10 });
  const current = existing.data.find(sub => sub.metadata?.ceiba_proposal === meta.ceiba_proposal && sub.status !== 'canceled');
  if (current) return { subscription: current.id, status: current.status, already: true };

  // Partes de la mensualidad guardadas al pagar: "ceiba_web_negocio_mensual=2490,ceiba_modulo_whatsapp_mensual=1000"
  const currency = meta.ceiba_currency || 'mxn';
  const parts = (meta.ceiba_monthly || '').split(',').filter(Boolean).map(x => x.split('=')).map(([product, amount]) => ({ product, amount: Number(amount) }));
  if (!parts.length || parts.some(p => !p.product || !(p.amount > 0))) throw Object.assign(new Error('El cliente no tiene guardada su mensualidad.'), { status: 500 });
  const business = (await getProposal(meta.ceiba_proposal).catch(() => ({}))).proposal?.business ?? customer.name ?? '';
  const subscription = await s.subscriptions.create({
    customer: customerId,
    items: parts.map(p => ({ price_data: { currency, product: p.product, unit_amount: stripeAmount(p.amount, currency), recurring: { interval: 'month' }, tax_behavior: 'inclusive' } })),
    currency, // misma moneda que el pago inicial
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
  return { subscription: subscription.id, status: subscription.status };
}

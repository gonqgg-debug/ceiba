// POST /api/checkout
// Crea una sesión de Stripe Checkout (alojada) para activar la web de una propuesta.
//
// Cuerpo: { "proposal": "clinica-arrayan", "plan": "negocio", "whatsapp": true }
// Respuesta: { "url": "https://checkout.stripe.com/..." }
//
// Hoy se cobra solo la activación y se guarda la tarjeta. La mensualidad se crea
// como suscripción al publicar la web (ver api/publish.js), con esa misma tarjeta.
import { PLANS, countryInfo, formatMoney, packageLines, productId, stripeAmount } from '../lib/catalog.js';
import { getProposal } from '../lib/proposals.js';
import { json, siteUrl, stripe } from '../lib/stripe.js';

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }

  const { proposal: slug, plan, whatsapp } = body ?? {};
  const { proposal, error, status } = await getProposal(slug);
  if (error) return json({ error }, status);
  if (!PLANS[plan] || !(proposal.allowedPlans || Object.keys(PLANS)).includes(plan)) return json({ error: 'Ese plan no está disponible en esta propuesta.' }, 400);
  const withWhatsapp = whatsapp === true;
  // El país (y con él la moneda y los montos) lo fija la propuesta en /admin, nunca el navegador.
  const country = countryInfo(proposal.country), currency = country.currency;
  const money = n => formatMoney(n, currency, { code: true });
  const lines = packageLines(plan, withWhatsapp, country.code, { touristic: !!proposal.touristic });
  const totals = { activation: lines.reduce((a, l) => a + l.activation, 0), monthly: lines.reduce((a, l) => a + l.monthly, 0) };
  const packageName = PLANS[plan].name + (withWhatsapp ? ' + Asistente de WhatsApp' : '');
  const metadata = {
    ceiba_proposal: slug,
    ceiba_plan: plan,
    ceiba_whatsapp: String(withWhatsapp),
    ceiba_country: country.code,
    ceiba_currency: currency,
    // Mensualidad que se crea al publicar: producto=monto en unidades de la moneda
    ceiba_monthly: lines.map(l => `${productId(l.kind, l.id, 'mensual')}=${l.monthly}`).join(','),
  };
  const common = {
    customer_creation: 'always',
    billing_address_collection: 'required',
    tax_id_collection: { enabled: true },
    locale: 'es-419',
    metadata,
    success_url: `${siteUrl()}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}${proposal.page}?pago=cancelado`,
  };

  const s = stripe();
  try {
    let session;
    if (totals.activation > 0) {
      session = await s.checkout.sessions.create({
        ...common,
        mode: 'payment',
        line_items: lines.filter(l => l.activation > 0).map(l => ({
          quantity: 1,
          price_data: { currency, unit_amount: stripeAmount(l.activation, currency), product: productId(l.kind, l.id, 'activacion'), tax_behavior: 'inclusive' },
        })),
        payment_intent_data: { setup_future_usage: 'off_session', description: `Pago inicial · ${packageName} · ${proposal.business}`, metadata },
        invoice_creation: {
          enabled: true,
          invoice_data: {
            description: `Pago inicial de ${packageName} para ${proposal.business}. La mensualidad de ${money(totals.monthly)} empieza el día que publicamos la página.`,
            metadata, custom_fields: [{ name: 'Propuesta', value: slug }],
            footer: 'Ceiba Labs (GQG Holdings LLC) · www.ceibalabs.io',
          },
        },
        automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
        custom_text: { submit: { message: `Hoy pagas solo el monto inicial. La mensualidad de ${money(totals.monthly)} se cobra con esta tarjeta desde el día que publiquemos tu página. Es el precio final.` } },
      });
    } else {
      // Sin pago inicial (Plan Esencial): solo se registra la tarjeta para la mensualidad.
      // En modo setup Checkout no crea el cliente: lo creamos antes para guardarle la tarjeta.
      const { customer_creation, tax_id_collection, ...setupCommon } = common;
      const customer = await s.customers.create({ name: proposal.business, metadata });
      session = await s.checkout.sessions.create({
        ...setupCommon,
        customer: customer.id,
        mode: 'setup',
        currency,
        setup_intent_data: { description: `Registro de tarjeta · ${packageName} · ${proposal.business}`, metadata },
        custom_text: { submit: { message: `Hoy no se te cobra nada. La mensualidad de ${money(totals.monthly)} se cobra con esta tarjeta desde el día que publiquemos tu página.` } },
      });
    }
    return json({ url: session.url });
  } catch (err) {
    console.error('Error al crear Checkout:', err.type, err.message, err.requestId);
    return json({ error: 'No pudimos abrir el pago. Intenta de nuevo en unos minutos.' }, 502);
  }
}

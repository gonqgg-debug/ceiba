// POST /api/checkout
// Crea una sesión de Stripe Checkout (alojada) para activar la web de una propuesta.
//
// Cuerpo: { "proposal": "clinica-arrayan", "plan": "negocio", "whatsapp": true }
// Respuesta: { "url": "https://checkout.stripe.com/..." }
//
// Hoy se cobra solo la activación y se guarda la tarjeta. La mensualidad se crea
// como suscripción al publicar la web (ver api/publish.js), con esa misma tarjeta.
import { ADDONS, CURRENCY, PLANS, formatMoney, isCurrency, lookupKey, packageTotals, pricedCurrencies } from '../lib/catalog.js';
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
  // La moneda la fija la propuesta (en /admin), nunca el navegador.
  const currency = isCurrency(proposal.currency) && pricedCurrencies().includes(proposal.currency) ? proposal.currency : CURRENCY;
  const money = n => formatMoney(n, currency, { code: true });

  const activationKeys = [lookupKey('web', plan, 'activacion'), ...(withWhatsapp ? [lookupKey('modulo', 'whatsapp', 'activacion')] : [])];
  const monthlyKeys = [lookupKey('web', plan, 'mensual'), ...(withWhatsapp ? [lookupKey('modulo', 'whatsapp', 'mensual')] : [])];

  const s = stripe();
  try {
    const { data } = await s.prices.list({ lookup_keys: [...activationKeys, ...monthlyKeys], active: true, limit: 10 });
    const byKey = Object.fromEntries(data.map(p => [p.lookup_key, p]));
    const missing = [...activationKeys, ...monthlyKeys].filter(k => !byKey[k]);
    if (missing.length) {
      console.error('Faltan precios en Stripe:', missing);
      return json({ error: 'No pudimos preparar el pago. Escríbenos y lo resolvemos.' }, 500);
    }

    const totals = packageTotals(plan, withWhatsapp, currency);
    const packageName = PLANS[plan].name + (withWhatsapp ? ` + ${ADDONS.whatsapp.name}` : '');
    const metadata = {
      ceiba_proposal: slug,
      ceiba_plan: plan,
      ceiba_whatsapp: String(withWhatsapp),
      ceiba_monthly_keys: monthlyKeys.join(','),
      ceiba_currency: currency,
    };

    const session = await s.checkout.sessions.create({
      mode: 'payment',
      currency, // usa currency_options del precio si no es la moneda base
      line_items: activationKeys.map(k => ({ price: byKey[k].id, quantity: 1 })),
      // Métodos de pago dinámicos (se eligen en el Dashboard). Como guardamos el
      // método para la mensualidad, Checkout solo muestra los reutilizables.
      customer_creation: 'always',
      payment_intent_data: {
        setup_future_usage: 'off_session',
        description: `Pago inicial · ${packageName} · ${proposal.business}`,
        metadata,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Pago inicial de ${packageName} para ${proposal.business}. La mensualidad de ${money(totals.monthly)} empieza el día que publicamos la página.`,
          metadata,
          custom_fields: [{ name: 'Propuesta', value: slug }],
          footer: 'Ceiba Labs · Estudio digital · www.ceibalabs.io',
        },
      },
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      // Se enciende cuando Stripe Tax tenga domicilio fiscal y registros (ver README).
      automatic_tax: { enabled: process.env.STRIPE_AUTOMATIC_TAX === 'true' },
      locale: 'es-419',
      custom_text: {
        submit: {
          message: `Hoy pagas solo el monto inicial. La mensualidad de ${money(totals.monthly)} se cobra con esta tarjeta desde el día que publiquemos tu página. Es el precio final.`,
        },
      },
      metadata,
      success_url: `${siteUrl()}/gracias.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}${proposal.page}?pago=cancelado`,
    });

    return json({ url: session.url });
  } catch (err) {
    console.error('Error al crear Checkout:', err.type, err.message, err.requestId);
    return json({ error: 'No pudimos abrir el pago. Intenta de nuevo en unos minutos.' }, 502);
  }
}

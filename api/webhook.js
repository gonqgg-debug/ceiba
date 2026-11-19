// POST /api/webhook
// Recibe los eventos de Stripe. Configura el endpoint en el Dashboard
// (Desarrolladores > Webhooks) con estos eventos:
//   checkout.session.completed, checkout.session.async_payment_succeeded,
//   invoice.paid, invoice.payment_failed, customer.subscription.deleted
// y guarda su secreto de firma en STRIPE_WEBHOOK_SECRET.
import { json, stripe } from '../lib/stripe.js';
import { dbReady, update } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';

export async function POST(request) {
  const signature = request.headers.get('stripe-signature');
  const payload = await request.text(); // cuerpo sin procesar: lo exige la verificación de firma
  let event;
  try {
    event = await stripe().webhooks.constructEventAsync(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.warn('Webhook con firma inválida:', err.message);
    return json({ error: 'Firma inválida.' }, 400);
  }

  try {
    await handle(event);
  } catch (err) {
    // 500 hace que Stripe reintente el evento más tarde.
    console.error(`Error procesando ${event.type} ${event.id}:`, err.message);
    return json({ error: 'Error interno.' }, 500);
  }
  return json({ received: true });
}

export async function handle(event) {
  const s = stripe();
  const obj = event.data.object;
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      if (obj.mode !== 'payment' || obj.payment_status !== 'paid' || !obj.metadata?.ceiba_proposal) return;
      // Deja en el cliente lo necesario para crear la mensualidad al publicar.
      const pi = await s.paymentIntents.retrieve(obj.payment_intent);
      await s.customers.update(obj.customer, {
        invoice_settings: { default_payment_method: pi.payment_method },
        metadata: { ...obj.metadata, ceiba_activation_session: obj.id, ceiba_status: 'activada' },
      });
      console.info(`Web activada: ${obj.metadata.ceiba_proposal} · plan ${obj.metadata.ceiba_plan} · cliente ${obj.customer}`);
      const meta = obj.metadata;
      if (dbReady()) {
        await update('proposals', `slug=eq.${encodeURIComponent(meta.ceiba_proposal)}`, {
          status: 'activada', activated_at: new Date().toISOString(), stripe_customer_id: obj.customer,
          recommended_plan: meta.ceiba_plan, whatsapp_recommended: meta.ceiba_whatsapp === 'true',
        });
      }
      if (mailReady() && process.env.CEIBA_NOTIFY_EMAIL) {
        const total = `$${(obj.amount_total / 100).toLocaleString('en-US')} ${obj.currency.toUpperCase()}`;
        const who = obj.customer_details?.email || obj.customer;
        await sendMail({
          to: process.env.CEIBA_NOTIFY_EMAIL.split(','),
          subject: `Pagó: ${meta.ceiba_proposal} (${total})`,
          html: `<p style="font:15px sans-serif">Se activó la propuesta <b>${escHtml(meta.ceiba_proposal)}</b>: ${escHtml(meta.ceiba_plan)}${meta.ceiba_whatsapp === 'true' ? ' + Asistente de WhatsApp' : ''}. Pago inicial: ${total}. Cliente: ${escHtml(who)}.</p><p style="font:15px sans-serif">Siguiente paso: escribirle hoy para pedir textos, fotos y accesos.</p>`,
        }).catch(err => console.error('aviso de pago no enviado', err.message));
      }
      return;
    }
    case 'invoice.paid':
      console.info(`Factura pagada ${obj.number ?? obj.id} · ${obj.amount_paid / 100} ${obj.currency.toUpperCase()} · cliente ${obj.customer}`);
      return;
    case 'invoice.payment_failed':
      // Smart Retries y los correos automáticos de Stripe se encargan del reintento.
      console.warn(`Pago fallido de la factura ${obj.number ?? obj.id} · cliente ${obj.customer}`);
      // Pendiente: avisar al equipo para dar seguimiento personal.
      return;
    case 'customer.subscription.deleted':
      console.warn(`Suscripción terminada ${obj.id} · cliente ${obj.customer}`);
      return;
    default:
      return;
  }
}

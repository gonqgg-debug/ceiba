// POST /api/webhook
// Recibe los eventos de Stripe. Configura el endpoint en el Dashboard
// (Desarrolladores > Webhooks) con estos eventos:
//   checkout.session.completed, checkout.session.async_payment_succeeded,
//   invoice.paid, invoice.payment_failed, customer.subscription.deleted
// y guarda su secreto de firma en STRIPE_WEBHOOK_SECRET.
import { json, stripe } from '../lib/stripe.js';
import { dbReady, select, update } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';
import { chatUrl, ensureChat } from '../lib/client-chat.js';
import { PLANS, planSpec } from '../lib/catalog.js';
import { applyUpgrade } from '../lib/upgrade.js';

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

// Lo que sigue según el plan (sale de la ficha en lib/catalog.js)
function welcomePlan(plan) {
  const s = planSpec(plan);
  const items = [
    `Hasta ${s.pages} páginas${s.servicePages ? `, con hasta ${s.servicePages} por servicio o zona` : ''}`,
    `Tu vista previa en unos ${s.previewDays} días hábiles después de recibir tus materiales, con ${s.rounds} ronda${s.rounds > 1 ? 's' : ''} de ajustes antes de publicar`,
    `${s.changeMinutes} minutos de cambios al mes, con respuesta en ${s.responseDays} día${s.responseDays > 1 ? 's' : ''} hábil${s.responseDays > 1 ? 'es' : ''}`,
    s.seo, s.reports, `Acompañamiento: ${s.support.toLowerCase()}`,
  ].filter(Boolean);
  return `<p>Lo que incluye y lo que sigue:</p><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}

export async function handle(event) {
  const s = stripe();
  const obj = event.data.object;
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      // Subida de plan pagada desde el chat
      if (obj.metadata?.ceiba_upgrade === '1') {
        if (obj.payment_status === 'paid') await applyUpgrade(obj.metadata);
        return;
      }
      // payment: pagó el monto inicial. setup: plan sin pago inicial, solo registró su tarjeta.
      const paid = obj.mode === 'payment' && obj.payment_status === 'paid';
      const setup = obj.mode === 'setup' && obj.status === 'complete';
      if ((!paid && !setup) || !obj.metadata?.ceiba_proposal) return;
      // Deja en el cliente lo necesario para crear la mensualidad al publicar.
      const pm = paid ? (await s.paymentIntents.retrieve(obj.payment_intent)).payment_method : (await s.setupIntents.retrieve(obj.setup_intent)).payment_method;
      await s.customers.update(obj.customer, {
        invoice_settings: { default_payment_method: pm },
        metadata: { ...obj.metadata, ceiba_activation_session: obj.id, ceiba_status: 'activada' },
      });
      console.info(`Web activada: ${obj.metadata.ceiba_proposal} · plan ${obj.metadata.ceiba_plan} · cliente ${obj.customer}`);
      const meta = obj.metadata;
      if (dbReady()) {
        await update('proposals', `slug=eq.${encodeURIComponent(meta.ceiba_proposal)}`, {
          status: 'activada', activated_at: new Date().toISOString(), stripe_customer_id: obj.customer,
          recommended_plan: meta.ceiba_plan, whatsapp_recommended: meta.ceiba_whatsapp === 'true',
        });
        // El agente de IA atiende al cliente desde ahora: se crea su chat y le mandamos el enlace.
        try {
          const prop = (await select('proposals', `slug=eq.${encodeURIComponent(meta.ceiba_proposal)}&select=id,business&limit=1`))?.[0];
          const email = obj.customer_details?.email;
          await ensureChat({ proposalId: prop?.id, slug: meta.ceiba_proposal, business: prop?.business, email, plan: meta.ceiba_plan, whatsapp: meta.ceiba_whatsapp === 'true' });
          if (email && mailReady()) {
            const link = chatUrl(meta.ceiba_proposal);
            await sendMail({
              to: email, subject: 'Empecemos tu página · Ceiba Labs', replyTo: process.env.CEIBA_REPLY_TO || undefined,
              html: `<div style="max-width:560px;font:15px/1.6 sans-serif;color:#0B1514"><p>¡Gracias! ${setup ? 'Ya registramos tu tarjeta' : 'Ya está confirmado tu pago'} de tu <b>${PLANS[meta.ceiba_plan]?.name || 'plan'}${meta.ceiba_whatsapp === 'true' ? ' + Asistente de WhatsApp' : ''}</b>.</p>${welcomePlan(meta.ceiba_plan)}<p>Para construir tu página necesitamos tu logo, ${planSpec(meta.ceiba_plan).photos} fotos, tus colores y algunos datos${planSpec(meta.ceiba_plan).integrations.includes('agenda') ? ', el enlace de tu agenda en línea' : ''}${planSpec(meta.ceiba_plan).integrations.includes('catalogo') ? ' y tu catálogo' : ''}. Te atiende nuestro asistente en un chat privado: puedes hacerlo desde el celular en unos minutos.</p><p><a href="${link}" style="display:inline-block;background:#D6FA52;color:#0B1514;padding:12px 20px;border-radius:10px;font-weight:600;text-decoration:none">Empezar ahora</a></p><p>Guarda este correo: con este mismo enlace vuelves cuando quieras para ver tu avance, pedir cambios o resolver dudas.</p><p>Equipo de Ceiba Labs</p></div>`,
            }).catch(err => console.error('webhook: correo de bienvenida no enviado', err.message));
          }
        } catch (err) { console.error('webhook: no se creó el chat', err.message); }
      }
      if (mailReady() && process.env.CEIBA_NOTIFY_EMAIL) {
        const total = setup ? 'sin pago inicial (registró su tarjeta)' : `${(obj.amount_total / (obj.currency === 'clp' ? 1 : 100)).toLocaleString('en-US')} ${obj.currency.toUpperCase()}`;
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

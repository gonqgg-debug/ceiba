// Subir de plan (o sumar el Asistente de WhatsApp) desde el chat del cliente.
//   quote:   qué cambia y cuánto cuesta en el país y la moneda de su propuesta
//   checkout: paga solo la diferencia del pago inicial; la mensualidad nueva aplica desde
//             su siguiente cobro (o desde que se publique, si todavía no se publica)
//   apply:   al confirmarse el pago (webhook) o si no hay nada que pagar: actualiza propuesta,
//            chat, cliente de Stripe y su suscripción, y avisa al cliente y al equipo.
// Bajar de plan no se hace aquí: lo atiende una persona.
import { select, update } from './db.js';
import { stripe, siteUrl } from './stripe.js';
import { PLANS, countryInfo, formatMoney, packageLines, packageTotals, planSpec, productId, stripeAmount } from './catalog.js';
import { getChat, saveChat, messageClient, chatUrl } from './client-chat.js';
import { escHtml, mailReady, sendMail } from './notify.js';

const ORDER = ['esencial', 'negocio', 'avanzado'];
const fail = (msg, status = 400) => Object.assign(new Error(msg), { user: true, status });

async function context(slug) {
  const p = (await select('proposals', `slug=eq.${encodeURIComponent(slug)}&select=id,slug,business,country,touristic,recommended_plan,whatsapp_recommended,stripe_customer_id,published_at&limit=1`).catch(() => []))?.[0];
  const chat = await getChat(slug);
  if (!p && !chat) throw fail('No encontramos a este cliente.', 404);
  return {
    p, chat,
    plan: chat?.data?.plan || p?.recommended_plan || 'negocio',
    whatsapp: chat?.data?.whatsapp ?? !!p?.whatsapp_recommended,
    country: countryInfo(p?.country), opts: { touristic: !!p?.touristic },
  };
}

export async function upgradeQuote(slug, toPlan, toWhatsapp) {
  const ctx = await context(slug);
  const plan = ORDER.includes(toPlan) ? toPlan : ctx.plan;
  const whatsapp = toWhatsapp == null ? ctx.whatsapp : !!toWhatsapp;
  if (ORDER.indexOf(plan) < ORDER.indexOf(ctx.plan) || (ctx.whatsapp && !whatsapp)) throw fail('Bajar de plan o quitar el asistente lo atiende una persona del equipo.');
  if (plan === ctx.plan && whatsapp === ctx.whatsapp) throw fail('Ese ya es su plan actual.');
  const cur = ctx.country.currency, money = n => formatMoney(n, cur, { code: true });
  const from = packageTotals(ctx.plan, ctx.whatsapp, ctx.country.code, ctx.opts);
  const to = packageTotals(plan, whatsapp, ctx.country.code, ctx.opts);
  const pay = Math.max(0, to.activation - from.activation);
  const s = planSpec(plan), f = planSpec(ctx.plan);
  const gains = [
    s.pages > f.pages && `hasta ${s.pages} páginas (hoy ${f.pages})`,
    s.servicePages > f.servicePages && `hasta ${s.servicePages} páginas por servicio o zona`,
    s.faqs > f.faqs && `${s.faqs} preguntas frecuentes`,
    s.integrations.filter(i => !f.integrations.includes(i)).map(i => ({ agenda: 'tu agenda en línea conectada', catalogo: 'un catálogo que tú actualizas' }[i])).filter(Boolean).join(' y ') || null,
    s.changeMinutes > f.changeMinutes && `${s.changeMinutes} minutos de cambios al mes (hoy ${f.changeMinutes})`,
    s.seo !== f.seo && s.seo,
    whatsapp && !ctx.whatsapp && 'el Asistente de WhatsApp',
  ].filter(Boolean);
  return {
    from: { plan: ctx.plan, whatsapp: ctx.whatsapp, ...from }, to: { plan, whatsapp, ...to },
    pay, currency: cur, published: !!ctx.p?.published_at,
    text: `De ${PLANS[ctx.plan].name}${ctx.whatsapp ? ' + WhatsApp' : ''} a ${PLANS[plan].name}${whatsapp ? ' + WhatsApp' : ''}. Gana: ${gains.join('; ') || 'lo que incluye el plan'}. Paga hoy ${pay ? money(pay) : 'nada'} (diferencia del pago inicial) y su mensualidad pasa de ${money(from.monthly)} a ${money(to.monthly)}${ctx.p?.published_at ? ' desde su siguiente cobro' : ' cuando se publique su página'}.`,
  };
}

// Devuelve { url } para pagar la diferencia, o { applied: true } si no hay nada que pagar.
export async function upgradeCheckout(slug, toPlan, toWhatsapp) {
  const q = await upgradeQuote(slug, toPlan, toWhatsapp);
  const ctx = await context(slug);
  const lines = packageLines(q.to.plan, q.to.whatsapp, ctx.country.code, ctx.opts);
  const metadata = {
    ceiba_upgrade: '1', ceiba_proposal: slug, ceiba_plan: q.to.plan, ceiba_whatsapp: String(q.to.whatsapp),
    ceiba_country: ctx.country.code, ceiba_currency: q.currency,
    ceiba_monthly: lines.map(l => `${productId(l.kind, l.id, 'mensual')}=${l.monthly}`).join(','),
  };
  if (!q.pay || !ctx.p?.stripe_customer_id) { await applyUpgrade(metadata); return { applied: true, quote: q }; }
  const product = q.to.plan !== q.from.plan ? productId('web', q.to.plan, 'activacion') : productId('modulo', 'whatsapp', 'activacion');
  const session = await stripe().checkout.sessions.create({
    mode: 'payment', customer: ctx.p.stripe_customer_id, locale: 'es-419',
    line_items: [{ quantity: 1, price_data: { currency: q.currency, unit_amount: stripeAmount(q.pay, q.currency), product, tax_behavior: 'inclusive' } }],
    payment_intent_data: { setup_future_usage: 'off_session', description: `Cambio de plan · ${ctx.p.business}`, metadata },
    custom_text: { submit: { message: `Pagas la diferencia del pago inicial. Tu mensualidad nueva es de ${formatMoney(q.to.monthly, q.currency, { code: true })}${q.published ? ' desde tu siguiente cobro' : ' desde que publiquemos tu página'}.` } },
    metadata,
    success_url: `${chatUrl(slug)}&plan=ok`,
    cancel_url: chatUrl(slug),
  });
  return { url: session.url, quote: q };
}

// Aplica el plan nuevo (lo llama el webhook al confirmarse el pago).
export async function applyUpgrade(meta) {
  const slug = meta.ceiba_proposal, plan = meta.ceiba_plan, whatsapp = meta.ceiba_whatsapp === 'true';
  const ctx = await context(slug);
  if (ctx.p) await update('proposals', `id=eq.${ctx.p.id}`, { recommended_plan: plan, whatsapp_recommended: whatsapp });
  if (ctx.chat) await saveChat(ctx.chat.id, { data: { ...(ctx.chat.data || {}), plan, whatsapp } });
  // Cliente de Stripe y su mensualidad (si ya está publicada)
  const customerId = ctx.p?.stripe_customer_id;
  if (customerId) {
    const s = stripe();
    await s.customers.update(customerId, { metadata: { ceiba_plan: plan, ceiba_whatsapp: String(whatsapp), ceiba_monthly: meta.ceiba_monthly } });
    const subs = await s.subscriptions.list({ customer: customerId, status: 'active', limit: 5 });
    const sub = subs.data.find(x => x.metadata?.ceiba_proposal === slug);
    if (sub) {
      const currency = meta.ceiba_currency || sub.currency;
      const parts = meta.ceiba_monthly.split(',').map(x => x.split('=')).map(([product, amount]) => ({ product, amount: Number(amount) }));
      await s.subscriptions.update(sub.id, {
        items: [...sub.items.data.map(i => ({ id: i.id, deleted: true })), ...parts.map(p => ({ price_data: { currency, product: p.product, unit_amount: stripeAmount(p.amount, currency), recurring: { interval: 'month' }, tax_behavior: 'inclusive' } }))],
        proration_behavior: 'none', // la mensualidad nueva aplica desde el siguiente cobro
        metadata: { ...sub.metadata, ceiba_plan: plan, ceiba_whatsapp: String(whatsapp) },
      });
    }
  }
  const name = `${PLANS[plan].name}${whatsapp ? ' + Asistente de WhatsApp' : ''}`;
  if (ctx.chat) await messageClient({ ...ctx.chat, data: { ...(ctx.chat.data || {}), plan, whatsapp } }, `¡Listo! Ya tienes el ${name}. Desde ahora tu página puede crecer con lo que incluye; dime qué quieres agregar y lo armamos.`, `Ya tienes el ${name} · Ceiba Labs`);
  if (mailReady() && process.env.CEIBA_NOTIFY_EMAIL) {
    await sendMail({ to: process.env.CEIBA_NOTIFY_EMAIL.split(','), subject: `Subió de plan: ${ctx.p?.business || slug} → ${name}`,
      html: `<p style="font:15px sans-serif">${escHtml(ctx.p?.business || slug)} pasó a <b>${escHtml(name)}</b>. Ya se actualizaron su plan, su chat y su mensualidad en Stripe.</p><p style="font:15px sans-serif"><a href="${siteUrl()}/admin#cliente/${slug}">Abrir en el panel</a></p>` })
      .catch(err => console.error('upgrade: aviso no enviado', err.message));
  }
  return { ok: true, plan, whatsapp };
}

// Para el agente: precios de los planes en el país del cliente
export async function planOptions(slug) {
  const ctx = await context(slug);
  const cur = ctx.country.currency, money = n => formatMoney(n, cur);
  return ORDER.map(id => {
    const t = packageTotals(id, false, ctx.country.code, ctx.opts), w = packageTotals(id, true, ctx.country.code, ctx.opts);
    return `${PLANS[id].name}: ${t.activation ? money(t.activation) + ' inicial + ' : 'sin pago inicial, '}${money(t.monthly)}/mes (con WhatsApp: ${money(w.activation)} + ${money(w.monthly)}/mes)`;
  }).join('; ');
}

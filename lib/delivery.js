// Entrega de la página del cliente: aprobación, dominio y publicación.
//   aprobada  -> el cliente dio el visto bueno a su vista previa (chat o panel)
//   dominio   -> se agrega al proyecto de Vercel y le mandamos los registros DNS
//   listo     -> el DNS ya apunta a Vercel
//   publicada -> se sirve en su dominio, arranca la mensualidad y el chat pasa a soporte
import { select, update } from './db.js';
import { getChat, saveChat, messageClient, chatUrl } from './client-chat.js';
import { connectDomain, dnsRecords, domainReady } from './vercel.js';
import { startSubscription } from './subscription.js';
import { escHtml, mailReady, sendMail } from './notify.js';
import { siteUrl } from './stripe.js';

const COLS = 'id,slug,business,status,stripe_customer_id,site_built_at,site_approved_at,domain,domain_status,domain_dns,published_at';
export const previewUrl = slug => `${siteUrl()}/vista/${slug}?sitio=1`;
export const liveUrl = domain => (domain ? `https://${domain}` : null);
const fail = (msg, status = 400) => Object.assign(new Error(msg), { user: true, status });

export async function siteRow(slug) {
  return (await select('proposals', `slug=eq.${encodeURIComponent(slug)}&select=${COLS}&limit=1`).catch(() => []))?.[0] || null;
}
// ¿El equipo ya le mandó la vista previa? (alguna solicitud aprobada y avisada)
async function shared(slug) {
  return !!(await select('solicitudes', `slug=eq.${encodeURIComponent(slug)}&estado=eq.aplicado&select=id&limit=1`).catch(() => []))?.length;
}
export async function siteState(slug) {
  const r = await siteRow(slug);
  if (!r) return null;
  return {
    built: !!r.site_built_at, shared: !!r.site_built_at && await shared(slug), approved: !!r.site_approved_at, approved_at: r.site_approved_at,
    domain: r.domain, domain_status: r.domain_status, records: r.domain_dns || [], published: !!r.published_at, published_at: r.published_at,
    preview: previewUrl(slug), live: r.published_at ? liveUrl(r.domain) : null, customer: !!r.stripe_customer_id,
  };
}

async function tellTeam(subject, html) {
  if (!mailReady() || !process.env.CEIBA_NOTIFY_EMAIL) return;
  await sendMail({ to: process.env.CEIBA_NOTIFY_EMAIL.split(','), subject, html: `<div style="font:15px/1.6 sans-serif">${html}</div>` })
    .catch(err => console.error('entrega: aviso no enviado', err.message));
}

export async function approveSite(slug, by = 'cliente') {
  const r = await siteRow(slug);
  if (!r?.site_built_at) throw fail('Todavía no hay una página construida para aprobar.');
  if (r.site_approved_at) return { already: true };
  await update('proposals', `id=eq.${r.id}`, { site_approved_at: new Date().toISOString() });
  await tellTeam(`Página aprobada: ${r.business || slug}`, `<p>${by === 'cliente' ? 'El cliente aprobó' : 'El equipo marcó como aprobada'} su página.</p><p>Siguiente paso: conectar su dominio en el panel (<a href="${siteUrl()}/admin#cliente/${slug}">abrir</a>).</p>`);
  return { ok: true };
}

export function cleanDomain(raw) {
  const host = String(raw || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0];
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host)) throw fail('Ese dominio no parece válido (ejemplo: tunegocio.com).');
  if (/(^|\.)ceibalabs\.io$/.test(host) && host.split('.').length < 3) throw fail('Ese es el dominio de Ceiba.');
  return host;
}

export function dnsMessage(host, records, provider) {
  const lines = records.map(r => `• Tipo ${r.tipo}, nombre «${r.nombre}», valor «${r.valor}»`).join('\n');
  return `Ya casi está tu página. Para que se vea en ${host}, entra a ${provider || 'donde compraste tu dominio'}, busca la sección de DNS y agrega estos registros:\n\n${lines}\n\nSi ya hay otros registros A o CNAME con esos mismos nombres, bórralos o reemplázalos. Avísame aquí cuando lo hagas y lo revisamos. Si prefieres, lo hacemos juntos en una llamada corta.`;
}

export async function setDomain(slug, raw) {
  const r = await siteRow(slug);
  if (!r) throw fail('No encontramos la página de este cliente.', 404);
  const host = cleanDomain(raw);
  const taken = (await select('proposals', `domain=eq.${encodeURIComponent(host)}&slug=neq.${encodeURIComponent(slug)}&select=slug&limit=1`).catch(() => []))?.[0];
  if (taken) throw fail(`Ese dominio ya está ligado a ${taken.slug}.`);
  const { records } = await connectDomain(host);
  await update('proposals', `id=eq.${r.id}`, { domain: host, domain_status: 'pendiente', domain_dns: records });
  const chat = await getChat(slug);
  return { domain: host, records, message: dnsMessage(host, records, chat?.data?.dominio_proveedor) };
}

export async function checkSiteDomain(slug) {
  const r = await siteRow(slug);
  if (!r?.domain) throw fail('Primero conecta un dominio.');
  const st = await domainReady(r.domain);
  const status = st.ready ? 'listo' : 'pendiente';
  if (status !== r.domain_status) {
    await update('proposals', `id=eq.${r.id}`, { domain_status: status });
    if (status === 'listo') await tellTeam(`Dominio listo: ${r.business || slug}`, `<p>${escHtml(r.domain)} ya apunta a Vercel. Ya puedes publicar su página desde el panel (<a href="${siteUrl()}/admin#cliente/${slug}">abrir</a>).</p>`);
  }
  if (!st.ready && !r.domain_dns?.length) await update('proposals', `id=eq.${r.id}`, { domain_dns: (await dnsRecords(r.domain)).records }).catch(() => {});
  return { ready: st.ready, verified: st.verified, misconfigured: st.misconfigured, domain: r.domain };
}

export async function publishSite(slug, { force = false } = {}) {
  const r = await siteRow(slug);
  if (!r?.site_built_at) throw fail('Todavía no hay una página construida.');
  if (!r.domain) throw fail('Primero conecta su dominio.');
  if (!force && !r.site_approved_at) throw fail('El cliente todavía no aprueba su página.');
  if (!force && r.domain_status !== 'listo') throw fail('Su dominio todavía no apunta a Vercel. Revisa el DNS primero.');
  let billing = { skipped: 'Sin cliente de Stripe: no se creó la mensualidad.' };
  if (r.stripe_customer_id) billing = await startSubscription(r.stripe_customer_id);
  const now = new Date().toISOString();
  await update('proposals', `id=eq.${r.id}`, { published_at: r.published_at || now });
  const chat = await getChat(slug);
  if (chat) {
    await saveChat(chat.id, { phase: 'soporte' });
    if (!r.published_at) await messageClient({ ...chat, phase: 'soporte' }, `¡Tu página ya está en línea! Ya puedes compartirla: ${liveUrl(r.domain)}\n\nDesde hoy este chat es tu canal de soporte: escríbenos aquí cuando quieras cambiar algo (horarios, precios, fotos, textos) y nos encargamos.`, 'Tu página ya está en línea · Ceiba Labs');
  }
  return { ok: true, live: liveUrl(r.domain), billing };
}

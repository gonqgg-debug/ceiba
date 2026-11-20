// /api/admin: panel interno del equipo (/admin).
//   POST {action:'login', token}           → cookie HttpOnly de sesión
//   POST {action:'logout'}
//   GET  ?action=list                      → solicitudes con su propuesta
//   GET  ?action=get&slug=...              → propuesta + solicitud
//   POST {action:'save', slug, content, plan, whatsapp}
//   POST {action:'approve', slug, validDays}   → publica y avisa al cliente
//   POST {action:'discard', slug}
//   POST {action:'undo_changes', slug}    → vuelve al contenido antes de la ronda de ajustes
//   POST {action:'grant_round', slug}     → le da otra ronda de ajustes al cliente
//   GET  ?action=clients                   → clientes que pagaron (chats) con su avance
//   GET  ?action=client&slug=...           → chat, datos, archivos y solicitudes
//   POST {action:'client_message', slug, mensaje}           → escribirle al cliente
//   POST {action:'client_phase', slug, phase}               → arranque | construccion | soporte
//   POST {action:'request_update', slug, solicitud, estado, mensaje, nota}
import { adminCookie, isAdmin } from '../lib/admin.js';
import { dbReady, select, update } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';
import { PLANS, CURRENCIES, pricedCurrencies } from '../lib/catalog.js';
import { json, siteUrl } from '../lib/stripe.js';
import { validSlug } from '../lib/proposals.js';
import { approveSite, checkSiteDomain, dnsMessage, publishSite, setDomain, siteState } from '../lib/delivery.js';
import { vercelReady } from '../lib/vercel.js';
import { checklist, chatUrl, engineerUpdate, getChat, messageClient, saveChat, signDownload, transcript, SOL_STATES } from '../lib/client-chat.js';

const PHASES = ['arranque', 'construccion', 'soporte'];
async function clientDetail(slug) {
  const chat = await getChat(slug);
  if (!chat) return null;
  const sols = await select('solicitudes', `slug=eq.${encodeURIComponent(slug)}&order=created_at.desc&limit=50`).catch(() => []);
  const sign = async f => ({ ...f, url: await signDownload(f.ruta || f.path, 60 * 60 * 24).catch(() => null) });
  const files = await Promise.all((chat.files || []).map(f => sign({ ...f, ruta: f.path })));
  const solicitudes = await Promise.all((sols || []).map(async r => ({ ...r, archivos: await Promise.all((r.archivos || []).map(sign)) })));
  const prop = (await select('proposals', `slug=eq.${encodeURIComponent(slug)}&select=site_built_at&limit=1`).catch(() => []))?.[0];
  const { encontrado, cambios, ...data } = chat.data || {};
  return {
    slug: chat.slug, business: chat.business, email: chat.email, phase: chat.phase, needs_human: chat.needs_human,
    created_at: chat.created_at, last_client_at: chat.last_client_at, link: chatUrl(chat.slug),
    site: !!prop?.site_built_at, delivery: await siteState(slug).catch(() => null), vercel: vercelReady(), checklist: checklist(chat), data, encontrado: encontrado || null, files, messages: transcript(chat), solicitudes,
  };
}


const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const longDate = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MONTHS[m - 1]}`; };
const todayMx = () => new Date(Date.now() - 6 * 3600e3).toISOString().slice(0, 10);
const addDays = (iso, n) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);

async function getBySlug(slug) {
  const rows = await select('proposals', `slug=eq.${slug}&select=*,leads!leads_proposal_id_fkey(id,name,business,contact,contact_type,site_host,industry,city,social,audit,preferences,created_at,due_at,status)&limit=1`);
  return rows?.[0] || null;
}

export async function GET(request) {
  if (!isAdmin(request)) return json({ error: 'Necesitas entrar al panel.' }, 401);
  if (!dbReady()) return json({ error: 'Supabase no está configurado en el servidor.' }, 500);
  const q = new URL(request.url).searchParams;
  try {
    if (q.get('action') === 'list') {
      const leads = await select('leads', 'select=id,created_at,due_at,status,business,name,contact,contact_type,site_host,has_site,source,notes,proposal:proposals!leads_proposal_id_fkey(slug,status,change_status,recommended_plan,whatsapp_recommended,sent_at,first_viewed_at,activated_at,valid_until,views:proposal_views(count))&order=created_at.desc&limit=100');
      return json({ leads });
    }
    if (q.get('action') === 'get') {
      const slug = q.get('slug');
      if (!validSlug(slug)) return json({ error: 'Slug inválido.' }, 400);
      const p = await getBySlug(slug);
      return p ? json({ proposal: p, currencies: pricedCurrencies().map(c => ({ id: c, code: CURRENCIES[c].code, public: CURRENCIES[c].public })) }) : json({ error: 'No existe.' }, 404);
    }
    if (q.get('action') === 'clients') {
      const chats = await select('client_chats', 'select=id,slug,business,email,phase,needs_human,data,files,created_at,updated_at,last_client_at&order=updated_at.desc&limit=200');
      const open = await select('solicitudes', 'select=slug,estado,urgente&estado=in.(pendiente,construyendo,en_revision,en_proceso,necesita_info)&limit=1000').catch(() => []);
      const clients = (chats || []).map(c => {
        const mine = (open || []).filter(r => r.slug === c.slug);
        const ck = checklist(c);
        return { slug: c.slug, business: c.business, email: c.email, phase: c.phase, needs_human: c.needs_human, created_at: c.created_at, updated_at: c.updated_at, last_client_at: c.last_client_at,
          avance: `${ck.done}/${ck.total}`, revisar: mine.filter(r => r.estado === 'en_revision').length, pendientes: mine.filter(r => r.estado === 'pendiente').length, abiertas: mine.length, urgente: mine.some(r => r.urgente) };
      });
      return json({ clients });
    }
    if (q.get('action') === 'client') {
      const slug = q.get('slug');
      if (!validSlug(slug)) return json({ error: 'Slug inválido.' }, 400);
      const c = await clientDetail(slug);
      return c ? json({ client: c, states: SOL_STATES, phases: PHASES }) : json({ error: 'No existe ese cliente.' }, 404);
    }
    return json({ error: 'Acción desconocida.' }, 400);
  } catch (err) {
    console.error('admin GET', err.message);
    return json({ error: err.message }, 502);
  }
}

export async function POST(request) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }

  if (b.action === 'login') {
    const req = new Request(request.url, { headers: { authorization: `Bearer ${b.token || ''}` } });
    if (!isAdmin(req)) return json({ error: 'Token incorrecto.' }, 401);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json', 'set-cookie': adminCookie(b.token) } });
  }
  if (b.action === 'logout') return new Response('{"ok":true}', { headers: { 'content-type': 'application/json', 'set-cookie': adminCookie('', 0) } });

  if (!isAdmin(request)) return json({ error: 'Necesitas entrar al panel.' }, 401);
  if (!dbReady()) return json({ error: 'Supabase no está configurado en el servidor.' }, 500);
  if (!validSlug(b.slug)) return json({ error: 'Slug inválido.' }, 400);

  try {
    if (['site_approve', 'site_domain', 'site_check', 'site_publish', 'site_dns_message'].includes(b.action)) {
      try {
        if (b.action === 'site_approve') return json(await approveSite(b.slug, 'equipo'));
        if (b.action === 'site_domain') return json(await setDomain(b.slug, b.domain));
        if (b.action === 'site_check') return json(await checkSiteDomain(b.slug));
        if (b.action === 'site_dns_message') { const s = await siteState(b.slug); const chat = await getChat(b.slug); return json({ message: s?.domain ? dnsMessage(s.domain, s.records, chat?.data?.dominio_proveedor) : '' }); }
        return json(await publishSite(b.slug, { force: !!b.force }));
      } catch (err) {
        if (err.user) return json({ error: err.message }, err.status || 400);
        throw err;
      }
    }
    if (['client_message', 'client_phase', 'request_update'].includes(b.action)) {
      const chat = await getChat(b.slug);
      if (!chat) return json({ error: 'No existe ese cliente.' }, 404);
      if (b.action === 'client_message') {
        if (!String(b.mensaje || '').trim()) return json({ error: 'Escribe un mensaje.' }, 400);
        await messageClient(chat, b.mensaje);
        if (chat.needs_human) await saveChat(chat.id, { needs_human: false });
        return json({ ok: true });
      }
      if (b.action === 'client_phase') {
        if (!PHASES.includes(b.phase)) return json({ error: 'Fase inválida.' }, 400);
        await saveChat(chat.id, { phase: b.phase, ...(b.phase !== chat.phase ? { needs_human: false } : {}) });
        return json({ ok: true });
      }
      const sol = (await select('solicitudes', `id=eq.${encodeURIComponent(b.solicitud || '')}&slug=eq.${encodeURIComponent(b.slug)}&select=id&limit=1`))?.[0];
      if (!sol) return json({ error: 'Esa solicitud no es de este cliente.' }, 404);
      const r = await engineerUpdate(b);
      return r.error ? json({ error: r.error }, r.status || 400) : json({ ok: true, estado: r.estado });
    }

    const p = await getBySlug(b.slug);
    if (!p) return json({ error: 'No existe.' }, 404);

    if (b.action === 'save') {
      if (!b.content || typeof b.content !== 'object' || !b.content.page?.hero?.title) return json({ error: 'El contenido debe tener al menos page.hero.title.' }, 400);
      const patch = { content: b.content };
      if (PLANS[b.plan]) patch.recommended_plan = b.plan;
      if (pricedCurrencies().includes(b.currency)) patch.currency = b.currency;
      if (typeof b.whatsapp === 'boolean') patch.whatsapp_recommended = b.whatsapp;
      if (typeof b.business === 'string' && b.business.trim()) patch.business = b.business.trim().slice(0, 160);
      await update('proposals', `id=eq.${p.id}`, patch);
      return json({ ok: true });
    }

    if (b.action === 'undo_changes') {
      if (!p.content_prev) return json({ error: 'No hay una versión anterior guardada.' }, 400);
      await update('proposals', `id=eq.${p.id}`, { content: p.content_prev, content_prev: null, change_status: null, change_note: null });
      return json({ ok: true });
    }
    if (b.action === 'grant_round') {
      await update('proposals', `id=eq.${p.id}`, { change_rounds: 0, change_status: null });
      return json({ ok: true });
    }

    if (b.action === 'discard') {
      await update('proposals', `id=eq.${p.id}`, { status: 'descartada' });
      if (p.leads?.[0]) await update('leads', `id=eq.${p.leads[0].id}`, { status: 'descartado' });
      return json({ ok: true });
    }

    if (b.action === 'approve') {
      const content = p.content || p.ai_draft;
      if (!content?.page?.hero?.title) return json({ error: 'La propuesta no tiene contenido.' }, 400);
      const days = Math.min(30, Math.max(3, Number(b.validDays) || 14));
      const validUntil = addDays(todayMx(), days);
      await update('proposals', `id=eq.${p.id}`, { content, status: 'enviada', sent_at: new Date().toISOString(), valid_until: validUntil });
      const lead = p.leads?.[0];
      if (lead) await update('leads', `id=eq.${lead.id}`, { status: 'propuesta_enviada' });

      const link = `${siteUrl()}/p/${p.slug}`;
      const first = (content.contactName || lead?.name || '').split(/\s+/)[0];
      const message = `Hola${first ? `, ${first}` : ''}. Ya está lista la propuesta para ${p.business}: ${link}\n\nAhí ves cómo quedaría tu nueva página (también en pantalla completa), qué cambia y el precio. Es válida hasta el ${longDate(validUntil)}.`;
      let emailed = false, emailError = null;
      if (lead?.contact_type === 'email' && mailReady()) {
        try {
          await sendMail({
            to: lead.contact,
            subject: `Tu propuesta de página web para ${p.business}`,
            text: `${message}\n\nSi tienes dudas, responde este correo.\n\nEquipo de Ceiba Labs`,
            html: `<div style="max-width:560px;font:15px/1.6 sans-serif;color:#0B1514"><p>Hola${first ? `, ${escHtml(first)}` : ''}.</p><p>Ya está lista la propuesta para <b>${escHtml(p.business)}</b>. Ahí ves cómo quedaría tu nueva página (también en pantalla completa), qué cambia y el precio.</p><p><a href="${link}" style="display:inline-block;background:#D6FA52;color:#0B1514;padding:12px 18px;border-radius:8px;font-weight:600;text-decoration:none">Ver mi propuesta</a></p><p>Es válida hasta el ${longDate(validUntil)}. Si tienes dudas, responde este correo.</p><p>Equipo de Ceiba Labs</p></div>`,
            replyTo: process.env.CEIBA_REPLY_TO || process.env.CEIBA_NOTIFY_EMAIL?.split(',')[0],
          });
          emailed = true;
        } catch (err) { emailError = err.message; console.error('approve: correo no enviado', err.message); }
      }
      let waLink = null;
      if (lead?.contact_type === 'whatsapp') {
        let d = lead.contact.replace(/\D/g, '');
        if (d.length === 10) d = '52' + d;
        waLink = `https://wa.me/${d}?text=${encodeURIComponent(message)}`;
      }
      return json({ ok: true, link, validUntil, emailed, emailError, waLink, message });
    }
    return json({ error: 'Acción desconocida.' }, 400);
  } catch (err) {
    console.error('admin POST', err.message);
    return json({ error: err.message }, 502);
  }
}

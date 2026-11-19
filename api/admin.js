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
import { adminCookie, isAdmin } from '../lib/admin.js';
import { dbReady, select, update } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';
import { PLANS, CURRENCIES, pricedCurrencies } from '../lib/catalog.js';
import { json, siteUrl } from '../lib/stripe.js';
import { validSlug } from '../lib/proposals.js';

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

// /api/changes: la ronda de ajustes que el cliente pide desde su propuesta.
//   GET  ?slug=...            → { status, rounds, note }   (la propuesta lo consulta mientras se aplica)
//   POST { slug, text }       → guarda el pedido, avisa al equipo y dispara la rutina
// Claude aplica los cambios directo, sin revisión. Una ronda por propuesta.
import { dbReady, select, update } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';
import { expiresAt, validSlug } from '../lib/proposals.js';
import { fireRoutine } from '../lib/routine.js';
import { json, siteUrl } from '../lib/stripe.js';

const MAX_ROUNDS = 1;
const get = async slug => (await select('proposals', `slug=eq.${slug}&select=id,slug,business,status,valid_until,change_rounds,change_status,change_note,changes_requested&limit=1`))?.[0];

export async function GET(request) {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!validSlug(slug) || !dbReady()) return json({ error: 'No existe.' }, 404);
  const p = await get(slug).catch(() => null);
  if (!p) return json({ error: 'No existe.' }, 404);
  return json({ status: p.change_status, rounds: p.change_rounds, max: MAX_ROUNDS, note: p.change_note });
}

export async function POST(request) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }
  const text = String(b?.text ?? '').replace(/[\u0000-\u0008\u000b-\u001f]/g, ' ').trim().slice(0, 1500);
  if (b?.slug === 'clinica-arrayan') return json({ error: 'Esta es una propuesta de ejemplo. En tu propuesta, aquí pides tus cambios y en unos minutos ves la portada actualizada.' }, 400);
  if (!validSlug(b?.slug) || !dbReady()) return json({ error: 'No encontramos la propuesta.' }, 404);
  if (text.length < 5) return json({ error: 'Cuéntanos qué te gustaría cambiar.' }, 400);

  const p = await get(b.slug);
  if (!p || !['enviada', 'vista'].includes(p.status)) return json({ error: 'No encontramos la propuesta.' }, 404);
  if (Date.now() > expiresAt({ validUntil: p.valid_until })) return json({ error: 'La propuesta venció. Pide una actualizada.' }, 410);
  if (['pendiente', 'aplicando'].includes(p.change_status)) return json({ error: 'Ya estamos aplicando tus cambios. Tarda unos minutos.' }, 409);
  if (p.change_rounds >= MAX_ROUNDS) return json({ error: 'Ya usaste tu ronda de ajustes. Los demás cambios los vemos juntos cuando actives tu página.' }, 409);

  // Solo cuenta si la ronda sigue disponible (evita dos envíos al mismo tiempo)
  const rows = await update('proposals', `id=eq.${p.id}&change_rounds=lt.${MAX_ROUNDS}`, {
    changes_requested: text, change_status: 'pendiente', change_rounds: p.change_rounds + 1, change_requested_at: new Date().toISOString(), change_note: null,
  });
  if (!rows?.length) return json({ error: 'Ya usaste tu ronda de ajustes.' }, 409);

  await fireRoutine(`change=${p.slug}`).catch(err => console.error('changes: no se disparó la rutina', err.message));
  if (mailReady() && process.env.CEIBA_NOTIFY_EMAIL) {
    await sendMail({
      to: process.env.CEIBA_NOTIFY_EMAIL.split(','),
      subject: `Pidió cambios: ${p.business}`,
      html: `<p style="font:15px sans-serif"><b>${escHtml(p.business)}</b> pidió su ronda de ajustes. Claude la aplica directo y la propuesta se actualiza sola.</p><blockquote style="font:15px/1.5 sans-serif;border-left:3px solid #ccc;margin:0;padding:4px 12px">${escHtml(text).replace(/\n/g, '<br>')}</blockquote><p style="font:15px sans-serif"><a href="${siteUrl()}/admin#${p.slug}">Ver en el panel</a></p>`,
    }).catch(err => console.error('changes: aviso no enviado', err.message));
  }
  return json({ ok: true, status: 'pendiente' });
}

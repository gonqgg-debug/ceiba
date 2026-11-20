// Propuestas privadas: /p/[slug] y su vista previa /vista/[slug].
// La de ejemplo (clinica-arrayan) vive en el código; las reales, en Supabase
// (tabla proposals: columnas de control + `content` con el texto revisado).
import demo from './demos/clinica-arrayan.js';
import { dbReady, select, update, insert } from './db.js';

const PUBLIC_STATUS = ['enviada', 'vista', 'activada'];
const DEMOS = { [demo.slug]: { ...demo, status: 'enviada', allowedPlans: ['esencial', 'negocio', 'avanzado'] } };
export const validSlug = s => typeof s === 'string' && /^[a-z0-9-]{3,80}$/.test(s);

// Fin del día de vigencia, en hora del centro de México (UTC-6)
export const expiresAt = p => (p.validUntil ? Date.parse(`${p.validUntil}T23:59:59-06:00`) : Infinity);

function fromRow(r) {
  const c = r.content || r.ai_draft || {};
  return {
    ...c,
    id: r.id,
    slug: r.slug,
    business: r.business,
    status: r.status,
    recommendedPlan: r.recommended_plan,
    whatsappRecommended: r.whatsapp_recommended,
    allowedPlans: r.allowed_plans,
    country: r.country || 'MX',
    touristic: !!r.touristic,
    site: r.site_content || null,
    validUntil: r.valid_until,
    createdAt: (r.sent_at || r.created_at || '').slice(0, 10),
    isDraft: !r.content,
    changeRounds: r.change_rounds || 0,
    changeStatus: r.change_status,
    changeNote: r.change_note,
  };
}

// { proposal } o { error, status }. admin=true deja ver borradores y vencidas.
export async function loadProposal(slug, { admin = false } = {}) {
  if (!validSlug(slug)) return { error: 'La propuesta no existe.', status: 404 };
  let p = DEMOS[slug];
  if (!p) {
    if (!dbReady()) return { error: 'La propuesta no existe.', status: 404 };
    const rows = await select('proposals', `slug=eq.${slug}&select=*&limit=1`);
    if (!rows?.length) return { error: 'La propuesta no existe.', status: 404 };
    p = fromRow(rows[0]);
  }
  if (!admin && !PUBLIC_STATUS.includes(p.status)) return { error: 'La propuesta no existe.', status: 404 };
  if (!admin && Date.now() > expiresAt(p)) return { proposal: p, expired: true, error: 'La propuesta venció. Pide una actualización.', status: 410 };
  return { proposal: p };
}

// Registra una visita del cliente (no del equipo). Nunca rompe la página.
export async function trackView(p, request, kind) {
  if (!p.id || !dbReady()) return;
  try {
    await insert('proposal_views', { proposal_id: p.id, user_agent: (request.headers.get('user-agent') || '').slice(0, 300), referrer: kind });
    if (p.status === 'enviada') await update('proposals', `id=eq.${p.id}&status=eq.enviada`, { status: 'vista', first_viewed_at: new Date().toISOString() });
  } catch (err) { console.error('trackView', err.message); }
}

// Compatibilidad con api/checkout.js
export async function getProposal(slug) {
  const r = await loadProposal(slug);
  if (r.error) return r;
  return { proposal: { ...r.proposal, page: `/p/${slug}` } };
}

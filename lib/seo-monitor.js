// Lo recurrente de los planes (ficha en lib/catalog.js):
//   Negocio:  análisis avanzado al lanzar + prueba de visibilidad en IA cada 3 meses + contactos del mes
//   Avanzado: lo anterior + reporte mensual de visibilidad y una mejora de SEO aplicada cada mes
// La prueba en IA le pregunta a asistentes con búsqueda web lo que preguntaría un cliente del
// negocio («¿qué clínica dental me recomiendas en Providencia?») y revisa si lo mencionan.
// Automáticas (servidor): Claude con búsqueda web; Gemini con búsqueda de Google si hay GEMINI_API_KEY
// (cuota gratis de Google AI Studio); Perplexity si hay PERPLEXITY_API_KEY.
// En el chat (Claude Cowork, en el navegador del equipo): las que no tienen API, como ChatGPT.
// Se guardan en ai_checks y las hace Cowork en su revisión mensual (ops/cowork-reporte-mensual.md).
import Anthropic from '@anthropic-ai/sdk';
import { insert, select, update } from './db.js';
import { readSite } from './site-reader.js';
import { planSpec, PLANS } from './catalog.js';
import { fireBuild, getChat, messageClient } from './client-chat.js';
import { sitePages } from './site-pages.js';
import { escHtml, mailReady, sendMail } from './notify.js';
import { siteUrl } from './stripe.js';

const MODEL = 'claude-haiku-5-5'; // barato: solo pregunta y lee la respuesta
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return null; } };
const DAY = 864e5;

// ---------- prueba de visibilidad en IA ----------
export function buildPrompts(content = {}) {
  const page = content.page || {}, brand = page.brand || {};
  const parts = String(page.contact?.address || '').split(',').map(s => s.trim()).filter(Boolean);
  const city = parts.slice(-2).join(', ') || parts.at(-1) || '';
  const zone = parts.length > 2 ? parts.at(-3).replace(/^col\.?\s*/i, '') : '';
  const vertical = (brand.tagline || 'negocio').toLowerCase();
  const svc = (page.services?.items || []).map(s => s.name).filter(Boolean);
  const where = city ? ` en ${city}` : '';
  return [
    `¿Qué ${vertical} me recomiendas${where}?`,
    svc[0] && `¿Dónde puedo hacerme ${svc[0].toLowerCase()}${where}? Dame opciones concretas.`,
    `Busco ${vertical} ${zone ? `cerca de ${zone}` : where.trim()} con buenas reseñas, ¿cuáles hay?`.replace(/\s+/g, ' '),
  ].filter(Boolean).slice(0, 3);
}

async function askClaude(q) {
  const client = new Anthropic();
  let messages = [{ role: 'user', content: q }], res;
  for (let i = 0; i < 3; i++) {
    res = await client.messages.create({
      model: MODEL, max_tokens: 2000, output_config: { effort: 'low' },
      system: 'Responde como un asistente que recomienda negocios reales. Busca en la web y menciona negocios concretos por su nombre.',
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3, user_location: { type: 'approximate', country: 'MX' } }],
      messages,
    });
    if (res.stop_reason !== 'pause_turn') break;
    messages = [...messages, { role: 'assistant', content: res.content }];
  }
  const text = res.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
  const urls = new Set();
  for (const b of res.content) {
    if (b.type === 'web_search_tool_result' && Array.isArray(b.content)) b.content.forEach(r => r.url && urls.add(r.url));
    if (b.type === 'text') (b.citations || []).forEach(c => c.url && urls.add(c.url));
  }
  return { text, urls: [...urls] };
}

async function askPerplexity(q) {
  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST', headers: { authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: process.env.PERPLEXITY_MODEL || 'sonar', messages: [{ role: 'user', content: q }] }),
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`perplexity ${res.status}`);
  const d = await res.json();
  return { text: d.choices?.[0]?.message?.content || '', urls: d.citations || d.search_results?.map(r => r.url) || [] };
}

async function askGemini(q) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST', headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: q }] }], tools: [{ google_search: {} }] }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`gemini ${res.status}`);
  const c = (await res.json()).candidates?.[0] || {};
  const text = (c.content?.parts || []).map(p => p.text || '').join('\n');
  // Las fuentes vienen como enlaces de redirección de Google; el título trae el dominio real
  const urls = (c.groundingMetadata?.groundingChunks || []).map(g => g.web?.title && /\./.test(g.web.title) && !/\s/.test(g.web.title) ? `https://${g.web.title}` : g.web?.uri).filter(Boolean);
  return { text, urls };
}

const PROVIDERS = [
  { id: 'claude', name: 'Claude', ready: () => !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN), ask: askClaude },
  { id: 'gemini', name: 'Gemini', ready: () => !!process.env.GEMINI_API_KEY, ask: askGemini },
  { id: 'perplexity', name: 'Perplexity', ready: () => !!process.env.PERPLEXITY_API_KEY, ask: askPerplexity },
];
// Las que Cowork hace en el chat cuando no hay API: ChatGPT siempre; Gemini y Perplexity si falta su llave
const NAMES = { chatgpt: 'ChatGPT', gemini: 'Gemini', perplexity: 'Perplexity', claude: 'Claude' };
export const manualProviders = () => ['chatgpt', ...PROVIDERS.filter(p => p.id !== 'claude' && !p.ready()).map(p => p.id)];
const namesOf = content => [content.page?.brand?.fullName, content.page?.brand?.name].filter(Boolean);

function mentionCheck(answer, { names, domain }) {
  const t = norm(answer.text);
  const byName = names.some(n => n.length > 3 && t.includes(norm(n)));
  const byUrl = !!domain && answer.urls.some(u => hostOf(u) === domain || (hostOf(u) || '').endsWith(`.${domain}`));
  return byName || byUrl;
}

export async function visibilityTest({ content, domain }) {
  const names = namesOf(content);
  const prompts = buildPrompts(content);
  const providers = PROVIDERS.filter(p => p.ready());
  const results = await Promise.all(providers.flatMap(p => prompts.map(async q => {
    try {
      const a = await p.ask(q);
      return { provider: p.name, q, mentioned: mentionCheck(a, { names, domain }), cited: [...new Set(a.urls.map(hostOf).filter(Boolean))].slice(0, 6) };
    } catch (err) { return { provider: p.name, q, error: err.message.slice(0, 120) }; }
  })));
  return tally({ at: new Date().toISOString(), prompts, results });
}

function tally(v) {
  const ok = v.results.filter(r => !r.error);
  return { ...v, providers: [...new Set(ok.map(r => r.provider))], mentions: ok.filter(r => r.mentioned).length, total: ok.length };
}

// Respuesta copiada del chat por Cowork → mismo formato que las automáticas
function checkResult(c, { names, domain }) {
  const provider = NAMES[c.provider] || c.provider;
  if (c.estado !== 'hecho') return { provider, q: c.q, error: c.estado === 'error' ? (c.nota || 'no se pudo') : 'sin hacer', via: 'chat' };
  const urls = c.sources || [];
  return { provider, q: c.q, via: 'chat', mentioned: mentionCheck({ text: c.answer || '', urls }, { names, domain }), cited: [...new Set(urls.map(hostOf).filter(Boolean))].slice(0, 6) };
}

// ---------- análisis técnico del sitio publicado ----------
export async function siteAudit(url) {
  const r = await readSite(url).catch(err => ({ reachable: false, error: err.message }));
  if (!r.reachable) return { url, reachable: false, error: r.error || `respuesta ${r.page?.status || '—'}` };
  const checks = r.review.checks.map(({ id, label, status, detail }) => ({ id, label, status, detail }));
  return { url, reachable: true, seconds: +(r.page.total / 1000).toFixed(1), seoScore: r.review.seoScore, issues: checks.filter(c => c.status !== 'ok'), ok: checks.filter(c => c.status === 'ok').length, total: checks.length };
}

// ---------- contactos desde su página ----------
export async function contactsSince(slug, since) {
  const rows = await select('site_events', `slug=eq.${encodeURIComponent(slug)}&created_at=gte.${since.toISOString()}&select=kind&limit=5000`).catch(() => []);
  const by = {};
  for (const r of rows || []) by[r.kind] = (by[r.kind] || 0) + 1;
  return { since: since.toISOString(), total: (rows || []).length, by };
}

// ---------- reportes ----------
const LABEL = { whatsapp: 'por WhatsApp', llamada: 'por teléfono', formulario: 'con el formulario', agendar: 'para agendar', correo: 'por correo', mapa: 'abrieron el mapa' };
function summary(kind, { audit, visibility, contacts }, business) {
  const lines = [];
  if (kind === 'lanzamiento') lines.push(`Ya revisamos tu página publicada a fondo y le preguntamos a asistentes de IA por tu negocio.`);
  else lines.push(kind === 'mensual' ? `Tu reporte del mes:` : `Tu prueba de visibilidad de este trimestre:`);
  if (contacts) lines.push(`• Contactos desde tu página en los últimos 30 días: ${contacts.total}${contacts.total ? ` (${Object.entries(contacts.by).map(([k, n]) => `${n} ${LABEL[k] || k}`).join(', ')})` : ''}.`);
  if (visibility?.total) lines.push(`• En IA: te mencionaron en ${visibility.mentions} de ${visibility.total} preguntas como «${visibility.prompts[0]}» (${visibility.providers.join(', ').replace(/, ([^,]*)$/, ' y $1')}).${visibility.mentions < visibility.total ? ' Vamos a reforzar lo que falta para que te recomienden más.' : ''}`);
  if (audit?.reachable) lines.push(`• Tu página: ${audit.ok} de ${audit.total} puntos de SEO bien${audit.seoScore != null ? `, calificación ${audit.seoScore}/100` : ''}, carga en ${audit.seconds} s.${audit.issues.length ? ` A mejorar: ${audit.issues.slice(0, 3).map(i => i.label.toLowerCase()).join('; ')}.` : ''}`);
  if (kind === 'mensual' && audit?.issues?.length) lines.push(`Este mes aplicamos una mejora de SEO incluida en tu plan; te avisamos aquí cuando esté.`);
  return lines.join('\n');
}

// Qué le toca a cada cliente publicado hoy (máximo uno por cliente)
export async function dueReports() {
  const rows = await select('proposals', 'published_at=not.is.null&domain=not.is.null&select=slug,business,recommended_plan,domain,site_content,published_at&limit=500').catch(() => []);
  const due = [];
  for (const p of rows || []) {
    const plan = p.recommended_plan;
    if (!['negocio', 'avanzado'].includes(plan)) continue;
    const last = (await select('seo_reports', `slug=eq.${encodeURIComponent(p.slug)}&select=kind,created_at&order=created_at.desc&limit=10`).catch(() => [])) || [];
    const since = kind => last.filter(r => !kind || r.kind === kind).map(r => Date.parse(r.created_at))[0];
    const published = Date.parse(p.published_at);
    if (!last.some(r => r.kind === 'lanzamiento')) { if (Date.now() - published > DAY) due.push({ ...p, kind: 'lanzamiento' }); continue; }
    if (plan === 'avanzado' && Date.now() - (since('mensual') || since('lanzamiento')) > 30 * DAY) { due.push({ ...p, kind: 'mensual' }); continue; }
    if (plan === 'negocio') {
      if (Date.now() - (since('trimestral') || since('lanzamiento')) > 90 * DAY) due.push({ ...p, kind: 'trimestral' });
      else if (Date.now() - (since('mensual') || since('lanzamiento')) > 30 * DAY) due.push({ ...p, kind: 'mensual' }); // contactos del mes
    }
  }
  return due;
}

// Arma el reporte. El que lleva revisión (lanzamiento, trimestral, mensual de Avanzado) queda
// «para_cowork»: Claude Cowork lo revisa a fondo y lo redacta (ops/cowork-reporte-mensual.md)
// y el equipo lo manda desde el panel. Los contactos del mes de Negocio salen solos.
export async function runReport(p, kind, { notify = true } = {}) {
  const url = `https://${p.domain}/`;
  const plan = p.recommended_plan;
  const cowork = kind !== 'mensual' || plan === 'avanzado';
  const [audit, visibility, contacts] = await Promise.all([
    cowork ? siteAudit(url) : null,
    cowork ? visibilityTest({ content: p.site_content || {}, domain: p.domain }) : null,
    kind === 'lanzamiento' ? null : contactsSince(p.slug, new Date(Date.now() - 30 * DAY)),
  ]);
  const data = { audit, visibility, contacts, plan, pending: cowork, notify };
  const text = summary(kind, data, p.business);
  const row = await insert('seo_reports', { slug: p.slug, kind, data, summary: text, estado: cowork ? 'para_cowork' : 'enviado' });
  if (cowork && row?.id) {
    const manual = manualProviders();
    if (manual.length) await insert('ai_checks', manual.flatMap(provider => visibility.prompts.map(q => ({ report_id: row.id, slug: p.slug, provider, q }))));
    return { id: row.id, kind, summary: text, waiting: `la revisión de Cowork (con ${manual.length * visibility.prompts.length} preguntas en ${manual.map(m => NAMES[m]).join(', ')})` };
  }
  return closeReport({ ...row, data, kind, slug: p.slug }, p);
}

// Resultados automáticos + los que Cowork copió del chat
export async function mergedVisibility(row, p) {
  const v = row.data?.visibility;
  if (!v || !row.data?.pending) return v;
  const checks = (await select('ai_checks', `report_id=eq.${row.id}&select=provider,q,estado,answer,sources,nota&order=provider`).catch(() => [])) || [];
  const ctx = { names: namesOf(p.site_content || {}), domain: p.domain };
  return tally({ ...v, results: [...v.results, ...checks.map(c => checkResult(c, ctx))] });
}

// Manda el reporte al cliente y (Avanzado) pide la mejora de SEO del mes
async function closeReport(row, p, { text: override } = {}) {
  const { audit, plan, notify = true } = row.data;
  const visibility = await mergedVisibility(row, p);
  const data = { ...row.data, visibility, pending: false };
  const kind = row.kind;
  const text = (override || row.cowork_report || summary(kind, data, p.business)).trim();
  await update('seo_reports', `id=eq.${row.id}`, { data, summary: text, estado: 'enviado', reviewed_at: new Date().toISOString() }).catch(() => {});
  const chat = await getChat(p.slug);
  if (notify && chat) {
    await messageClient(chat, text, kind === 'mensual' ? `Tu reporte del mes · Ceiba Labs` : kind === 'trimestral' ? 'Tu reporte de visibilidad · Ceiba Labs' : 'El análisis de tu página · Ceiba Labs');
    await update('seo_reports', `id=eq.${row.id}`, { sent_at: new Date().toISOString() }).catch(() => {});
  }
  // Avanzado: una mejora de SEO incluida cada mes (no descuenta minutos)
  if (plan === 'avanzado' && kind !== 'trimestral' && chat) {
    const misses = (visibility?.results || []).filter(r => !r.error && !r.mentioned).map(r => r.q);
    const issue = audit?.issues?.[0];
    const pages = sitePages(p.site_content || {}, plan).length;
    const instruccion = row.mejora ? [
      'Aplica esta mejora de SEO incluida en su plan (la propuso la revisión del mes):',
      row.mejora,
      'Solo con datos reales del negocio. Explica en resultado qué aplicaste.',
    ].join('\n') : [
      'Aplica UNA mejora de SEO incluida en su plan, la de mayor impacto:',
      issue && `- Punto técnico pendiente: ${issue.label} (${issue.detail}).`,
      misses.length && `- No apareció en IA para: «${misses.slice(0, 2).join('», «')}». Considera reforzar con preguntas frecuentes que respondan eso${pages < planSpec(plan).pages ? ' o una página de servicio o zona nueva' : ''}.`,
      'Solo con datos reales del negocio. Explica en resultado qué mejora aplicaste y por qué.',
    ].filter(Boolean).join('\n');
    const sol = await insert('solicitudes', { chat_id: chat.id, slug: p.slug, business: p.business, tipo: 'cambio', plan, seccion: 'Mejora de SEO del mes', instruccion, minutos: 0 }).catch(() => null);
    if (sol) await fireBuild(sol.id);
  }
  return { id: row.id, kind, summary: text };
}

// Desde el panel: mandar (con el texto de Cowork o el editado) o descartar
export async function sendReport(id, { text } = {}) {
  const row = (await select('seo_reports', `id=eq.${encodeURIComponent(id)}&select=*&limit=1`))?.[0];
  if (!row) throw Object.assign(new Error('No existe ese reporte.'), { user: true });
  if (row.estado === 'enviado') throw Object.assign(new Error('Ese reporte ya se mandó.'), { user: true });
  const p = (await select('proposals', `slug=eq.${encodeURIComponent(row.slug)}&select=slug,business,recommended_plan,domain,site_content&limit=1`))?.[0];
  return closeReport({ ...row, data: { ...row.data, notify: true } }, p || { slug: row.slug }, { text });
}
export const discardReport = id => update('seo_reports', `id=eq.${encodeURIComponent(id)}`, { estado: 'descartado', reviewed_at: new Date().toISOString() });

// Corre lo que toque hoy (lo llama el cron diario). Uno por corrida para no pasar el tiempo límite.
export async function runDue({ max = 1 } = {}) {
  const due = (await dueReports()).slice(0, max);
  const done = [];
  for (const p of due) done.push(await runReport(p, p.kind).catch(err => ({ slug: p.slug, error: err.message })));
  const ready = await notifyReady().catch(err => ({ error: err.message }));
  return { due: due.length, done, ready };
}

// Avisa al equipo de los reportes que Cowork ya redactó (una vez por reporte)
async function notifyReady() {
  const rows = (await select('seo_reports', 'estado=eq.por_revisar&data->>avisado=is.null&select=id,slug,kind,data&limit=50')) || [];
  if (!rows.length || !mailReady() || !process.env.CEIBA_NOTIFY_EMAIL) return 0;
  const items = rows.map(r => `<li><a href="${siteUrl()}/admin#cliente/${r.slug}">${escHtml(r.slug)}</a> · ${r.kind}</li>`).join('');
  await sendMail({ to: process.env.CEIBA_NOTIFY_EMAIL.split(','), subject: `${rows.length} reporte${rows.length > 1 ? 's' : ''} de clientes listo${rows.length > 1 ? 's' : ''} para revisar`,
    html: `<p style="font:15px sans-serif">Claude Cowork terminó estos reportes. Revísalos y mándalos desde el panel:</p><ul style="font:15px sans-serif">${items}</ul>` });
  for (const r of rows) await update('seo_reports', `id=eq.${r.id}`, { data: { ...r.data, avisado: new Date().toISOString() } }).catch(() => {});
  return rows.length;
}

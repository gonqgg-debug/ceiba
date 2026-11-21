import { countryInfo } from '../lib/catalog.js';
// POST /api/lead
// Guarda una solicitud de propuesta en Supabase y avisa al equipo por correo.
// Promesa al cliente: propuesta en 24 horas hábiles (ver lib/business-hours.js).
import { dueDate, dueLabel } from '../lib/business-hours.js';
import { dbReady, insert } from '../lib/db.js';
import { escHtml, mailReady, sendMail } from '../lib/notify.js';
import { json, siteUrl } from '../lib/stripe.js';
import { parseSite } from '../lib/url.js';
import { readSite } from '../lib/site-reader.js';
import { fireRoutine } from '../lib/routine.js';

const INDUSTRIES = ['Clínica o consultorio', 'Restaurante o café', 'Inmobiliaria', 'Hotel u hospedaje', 'Despacho contable o legal', 'Otro'];
const SOURCES = ['home', 'diagnostico', 'clinicas', 'webs', 'ia', 'consultoria', 'empezar'];
const INTERESTS = { web: 'Página web', asistente: 'Asistente de WhatsApp', agentes: 'Agentes y automatización', datos: 'Datos y reportes', todo: 'Todo / no sé por dónde empezar' };
const SLOTS = { manana: 'mañanas', tarde: 'tardes', cualquiera: 'cualquier horario' };
const isTeam = m => m === 'ia' || m === 'consultoria';
const PREF = {
  style: ['moderno', 'elegante', 'calido', 'tecnologico'], mode: ['light', 'dark', 'any'], tone: ['tu', 'usted'],
  goals: ['citas', 'estetica', 'urgencias', 'google', 'zonas', 'confianza', 'reservas', 'pedidos', 'cotizaciones', 'visitas', 'whatsapp'],
  // Lo que se arma en /empezar: giro de la plantilla y estilo de la página
  kind: ['clinica', 'restaurante', 'hotel', 'inmobiliaria', 'despacho', 'otro'], pageStyle: ['sobria', 'expresiva', 'cercana', 'fonda'],
};
const PREF_LABEL = {
  style: { moderno: 'Moderno y limpio', elegante: 'Elegante y premium', calido: 'Cálido y familiar', tecnologico: 'Clínico y tecnológico' },
  mode: { light: 'Fondo claro', dark: 'Fondo oscuro', any: 'Que elija Ceiba' }, tone: { tu: 'De tú', usted: 'De usted' },
  pageStyle: { sobria: 'Sobria', expresiva: 'Expresiva', cercana: 'Cercana', fonda: 'Fonda' },
  goals: { reservas: 'Recibir reservaciones', pedidos: 'Recibir pedidos', cotizaciones: 'Recibir cotizaciones', visitas: 'Agendar visitas', whatsapp: 'Más mensajes por WhatsApp', citas: 'Más citas de valoración', estetica: 'Vender tratamientos estéticos', urgencias: 'Atender urgencias', google: 'Que lo encuentren en Google', zonas: 'Pacientes de otras zonas', confianza: 'Transmitir más confianza' },
};
function cleanPrefs(p) {
  if (!p || typeof p !== 'object') return null;
  const out = {};
  for (const k of ['style', 'mode', 'tone', 'kind', 'pageStyle']) if (PREF[k].includes(p[k])) out[k] = p[k];
  // Texto libre de /empezar: a qué se dedica y sus servicios, platillos o habitaciones (datos del cliente, no instrucciones)
  const about = clean(p.about, 800); if (about) out.about = about;
  const services = clean(p.services, 800); if (services) out.services = services;
  if (p.color === 'logo' || /^#[0-9a-f]{6}$/i.test(p.color || '')) out.color = p.color;
  if (Array.isArray(p.goals)) out.goals = p.goals.filter(g => PREF.goals.includes(g)).slice(0, 6);
  const ref = clean(p.ref, 200); if (ref) out.ref = ref;
  return Object.keys(out).length ? out : null;
}
const prefsText = p => !p ? '' : [
  p.style && PREF_LABEL.style[p.style], p.mode && PREF_LABEL.mode[p.mode], p.color && (p.color === 'logo' ? 'Color de su logo' : `Color ${p.color}`),
  p.tone && PREF_LABEL.tone[p.tone], p.goals?.length && `Quiere: ${p.goals.map(g => PREF_LABEL.goals[g]).join(', ')}`, p.ref && `Le gusta: ${p.ref}`,
  p.pageStyle && `Estilo de página: ${PREF_LABEL.pageStyle[p.pageStyle]}`, p.about && `Su negocio: ${p.about}`, p.services && `Servicios: ${p.services}`,
].filter(Boolean).join(' · ');
const clean = (v, max = 200) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

function validate(b) {
  const errors = {};
  // Solicitud de IA o de consultoría: sin página; basta con lo que quiere resolver
  if (isTeam(b.mode)) {
    const name = clean(b.name, 120), business = clean(b.biz, 160), contact = clean(b.contact, 160), message = clean(b.message, 1500);
    if (name.length < 2) errors.name = 'Escribe tu nombre.';
    if (business.length < 2) errors.biz = 'Escribe el nombre de tu negocio.';
    const interests = (Array.isArray(b.interests) ? b.interests : []).filter(k => INTERESTS[k]).slice(0, 5);
    const slot = SLOTS[b.slot] ? b.slot : null;
    if (message.length < 5 && !(b.mode === 'consultoria' && interests.length)) errors.message = b.mode === 'consultoria' ? 'Cuéntanos un poco de tu negocio.' : 'Cuéntanos qué te gustaría resolver.';
    let contactType = null;
    if (contact.includes('@')) { if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) contactType = 'email'; }
    else { const d = contact.replace(/\D/g, ''); if (/^[+\d\s().-]+$/.test(contact) && d.length >= 8 && d.length <= 15) contactType = 'whatsapp'; }
    if (!contactType) errors.contact = 'Revisa tu WhatsApp o correo.';
    return { errors, row: { has_site: false, site_host: parseSite(b.site)?.host ?? null, industry: clean(b.industry, 60) || null, city: null, social: null, name, business, contact, contact_type: contactType, notes: b.mode === 'consultoria' ? `Consultoría: ${[interests.length && `Le interesa: ${interests.map(k => INTERESTS[k]).join(', ')}.`, slot && `Prefiere ${SLOTS[slot]}.`, message].filter(Boolean).join(' ')}` : `IA: ${message}`, status: 'en_revision' } };
  }
  const hasSite = b.mode !== 'noweb';
  const site = hasSite ? parseSite(b.site) : null;
  if (hasSite && !site) errors.site = 'Revisa la dirección de tu página.';
  const industry = clean(b.industry, 60), city = clean(b.city, 80), social = clean(b.social, 300);
  if (!hasSite) {
    if (industry && !INDUSTRIES.includes(industry)) errors.industry = 'Elige un rubro de la lista.';
    if (city.length < 2) errors.city = 'Escribe la ciudad.';
  }
  const name = clean(b.name, 120), business = clean(b.biz, 160), contact = clean(b.contact, 160);
  if (name.length < 2) errors.name = 'Escribe tu nombre.';
  if (business.length < 2) errors.biz = 'Escribe el nombre de tu negocio.';
  let contactType = null;
  if (contact.includes('@')) { if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) contactType = 'email'; }
  else { const d = contact.replace(/\D/g, ''); if (/^[+\d\s().-]+$/.test(contact) && d.length >= 8 && d.length <= 15) contactType = 'whatsapp'; }
  if (!contactType) errors.contact = 'Revisa tu WhatsApp o correo.';
  return { errors, row: { has_site: hasSite, site_host: site?.host ?? null, industry: industry || null, city: city || null, social: social || null, name, business, contact, contact_type: contactType } };
}

// Solo guardamos el resumen de la revisión (lo mandó el navegador; es contexto, no dato confiable).
function auditSummary(a) {
  if (!a || typeof a !== 'object') return null;
  const checks = Array.isArray(a.checks) ? a.checks.slice(0, 30).map(c => ({ id: clean(c.id, 20), status: clean(c.status, 5), detail: clean(c.detail, 300) })) : [];
  return { reachable: !!a.reachable, reason: clean(a.reason, 200) || undefined, title: clean(a.title, 120) || undefined, seconds: Number(a.seconds) || undefined, checks };
}

function teamEmail(lead, due) {
  const rows = [
    ['Negocio', lead.business], ['Nombre', lead.name], ['Contacto', `${lead.contact} (${lead.contact_type === 'email' ? 'correo' : 'WhatsApp'})`],
    ['Página', lead.site_host ? `https://${lead.site_host}` : 'No tiene'],
    ...(lead.has_site ? [] : [['Rubro', lead.industry || '—'], ['Ciudad', lead.city], ['Perfil', lead.social]]),
    ...(lead.preferences ? [['Preferencias', prefsText(lead.preferences)]] : []),
    ...(lead.notes ? [['Mensaje', lead.notes]] : []),
    ['Origen', lead.source], ['Entregar', `${due.day}, ${due.time} (${due.tz})`],
  ];
  const checks = lead.audit?.checks?.length
    ? `<h3 style="margin:24px 0 8px;font:600 15px sans-serif">Revisión automática</h3><ul style="padding-left:18px;font:14px/1.5 sans-serif">${lead.audit.checks.map(c => `<li><b>${{ ok: 'Bien', warn: 'Mejorable', bad: 'Falta' }[c.status] || c.status}:</b> ${escHtml(c.detail)}</li>`).join('')}</ul>`
    : lead.audit?.reason ? `<p style="font:14px sans-serif">Revisión automática: ${escHtml(lead.audit.reason)}</p>` : '';
  const html = `<div style="max-width:620px">
<p style="font:15px sans-serif">Nueva solicitud de propuesta. Hay que entregarla <b>${escHtml(due.day)}, ${escHtml(due.time)}</b>.</p>
<table style="border-collapse:collapse;font:14px/1.5 sans-serif">${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top">${k}</td><td style="padding:4px 0">${escHtml(v)}</td></tr>`).join('')}</table>
${checks}</div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  return { html, text };
}

function clientEmail(lead, due) {
  const first = lead.name.split(/\s+/)[0];
  const text = `Hola, ${first}:

${lead.notes?.startsWith('Consultoría:') ? `Recibimos tu solicitud de consultoría para ${lead.business}. Te escribimos ${due.day}, ${due.time} (${due.tz}), a más tardar, para confirmar el día y la hora de tu sesión.` : lead.notes?.startsWith('IA:') ? `Recibimos tu solicitud para ${lead.business}. Vamos a revisar lo que nos contaste y te escribimos ${due.day}, ${due.time} (${due.tz}), a más tardar, para agendar tu diagnóstico de IA.` : `Recibimos tu solicitud para ${lead.business}. Vamos a revisar ${lead.site_host ? `tu página (${lead.site_host})` : 'tu perfil'} y a preparar cómo quedaría tu nueva página web, el plan que te conviene y el precio.

Te mandamos el enlace privado a tu propuesta ${due.day}, ${due.time} (${due.tz}), a más tardar.`}

Si quieres agregar algo, como fotos, servicios o lo que no te gusta de tu página actual, solo responde este correo.

Equipo de Ceiba Labs
${siteUrl()}`;
  const html = `<div style="max-width:560px;font:15px/1.6 sans-serif;color:#0B1514">${text.split('\n\n').map(p => `<p>${escHtml(p).replace(/\n/g, '<br>')}</p>`).join('')}</div>`;
  return { text, html };
}

// GET /api/geo (vercel.json -> /api/lead?geo=1)  ->  { country: "MX", currency: "mxn" }
// País del visitante según Vercel, para mostrar precios en su moneda. No guarda nada.
// Vive aquí para no pasar el límite de funciones del plan de Vercel.
export async function GET(request) {
  const country = (request.headers.get('x-vercel-ip-country') || '').toUpperCase().slice(0, 2) || null;
  const c = countryInfo(country);
  return new Response(JSON.stringify({ country: c.code, name: c.name, currency: c.currency }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=3600', vary: 'x-vercel-ip-country' },
  });
}

export async function POST(request) {
  let b; try { b = await request.json(); } catch { return json({ error: 'Solicitud inválida.' }, 400); }
  if (clean(b?.company_url)) return json({ ok: true, due: null }); // campo trampa para bots
  const { errors, row } = validate(b ?? {});
  if (Object.keys(errors).length) return json({ error: 'Revisa los datos marcados.', fields: errors }, 400);

  const now = new Date(), due = dueDate(now), label = dueLabel(due);

  // Leemos la página del cliente para que la rutina tenga su contenido.
  // La revisión del servidor reemplaza a la que mandó el navegador.
  let snapshot = null, serverAudit = null;
  if (row.has_site && !isTeam(b.mode)) {
    try {
      const r = await readSite(parseSite(b.site).href);
      if (r.reachable) { snapshot = r.content; serverAudit = { reachable: true, title: r.review.title, seconds: +(r.page.total / 1000).toFixed(1), checks: r.review.checks.map(({ id, status, detail }) => ({ id, status, detail })) }; }
    } catch (err) { console.warn('lead: no se pudo leer la página', row.site_host, err.message); }
  }
  const lead = {
    ...row,
    source: SOURCES.includes(b.source) ? b.source : 'home',
    // País por IP (encabezado de Vercel): define los precios de su propuesta
    country: request.headers.get('x-vercel-ip-country') ? countryInfo(request.headers.get('x-vercel-ip-country')).code : null,
    audit: serverAudit || auditSummary(b.audit),
    preferences: cleanPrefs(b.preferences),
    page_snapshot: snapshot,
    due_at: due.toISOString(),
    utm: b.utm && typeof b.utm === 'object' ? Object.fromEntries(Object.entries(b.utm).slice(0, 6).map(([k, v]) => [clean(k, 30), clean(v, 120)])) : null,
    user_agent: clean(request.headers.get('user-agent'), 300),
  };

  let saved = false, notified = false, emailed = false;
  if (dbReady()) {
    try { lead.id = (await insert('leads', lead)).id; saved = true; }
    catch (err) { console.error('lead: no se guardó en Supabase', err.message); }
  } else console.warn('lead: Supabase no está configurado');

  if (mailReady() && process.env.CEIBA_NOTIFY_EMAIL) {
    const tasks = [sendMail({ to: process.env.CEIBA_NOTIFY_EMAIL.split(','), subject: b.mode === 'consultoria' ? `Consultoría: ${lead.business}` : b.mode === 'ia' ? `IA: ${lead.business}` : `Propuesta para ${lead.business}${lead.site_host ? ` (${lead.site_host})` : ''}`, ...teamEmail(lead, label), replyTo: lead.contact_type === 'email' ? lead.contact : undefined })];
    if (lead.contact_type === 'email') tasks.push(sendMail({ to: lead.contact, subject: `Recibimos tu solicitud, ${lead.name.split(/\s+/)[0]}`, ...clientEmail(lead, label), replyTo: process.env.CEIBA_REPLY_TO || process.env.CEIBA_NOTIFY_EMAIL.split(',')[0] }));
    const [team, client] = await Promise.allSettled(tasks);
    notified = team.status === 'fulfilled';
    if (!notified) console.error('lead: no salió el aviso al equipo', team.reason?.message);
    emailed = client?.status === 'fulfilled';
    if (client?.status === 'rejected') console.error('lead: no salió la confirmación al cliente', client.reason?.message);
  } else console.warn('lead: correo no configurado');

  // Dispara la rutina de Claude que arma el borrador (si está configurada).
  // Las solicitudes de IA las atiende el equipo; no pasan por la rutina de propuestas de página.
  if (saved && !isTeam(b.mode)) await fireRoutine(lead).catch(err => console.error('lead: no se disparó la rutina', err.message));

  // Si no quedó registro en ningún lado, el cliente debe saberlo y escribirnos.
  if (!saved && !notified) return json({ error: 'No pudimos registrar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.' }, 502);
  return json({ ok: true, due: due.toISOString(), dueDay: label.day, dueTime: label.time, tz: label.tz, emailed, channel: lead.contact_type });
}

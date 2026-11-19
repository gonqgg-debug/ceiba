// Arma el HTML de /p/[slug] a partir de la plantilla (generada por build.py
// desde src/propuesta.html) y los datos de la propuesta.
import { PROPOSAL_HTML, TEMPLATES } from './generated/shared.js';
import { ADDONS, PLANS } from './catalog.js';
import { fontHref, renderClinica } from './templates/clinica.js';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mxn = n => '$' + n.toLocaleString('en-US');
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const dateLong = iso => { const [y, m, d] = iso.split('-').map(Number); return `${d} de ${MONTHS[m - 1]} de ${y}`; };
const dateShort = iso => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1].slice(0, 3)}`; };
const TEMPLATE_RENDERERS = { clinica: renderClinica };

// Texto de cada plan. `content.planWhy` puede ajustar el «por qué» por propuesta.
const PLAN_COPY = {
  esencial: { why: 'Una página clara para que te encuentren y te escriban, mientras sigues atendiendo por teléfono o WhatsApp.', items: ['Hasta 3 páginas', 'Formulario y botón de WhatsApp', 'Hasta 30 minutos de cambios al mes'] },
  negocio: { why: 'Todo lo que viste en esta propuesta, con citas o solicitudes directo a tu agenda.', items: ['Hasta 7 páginas', 'Conectada con la agenda que ya usas', 'Te decimos cuántas personas te contactaron', 'Hasta 60 minutos de cambios al mes'] },
  avanzado: { why: 'Si tienes muchos servicios y quieres una página para cada uno, que tú mismo actualizas.', items: ['Hasta 12 páginas, con todo lo de Negocio', 'Catálogo de servicios que tú actualizas', 'Hasta 120 minutos de cambios al mes'] },
};
const DEFAULT_INCLUDES = [
  { title: 'Páginas', items: [{ b: 'Inicio', t: 'La portada que acabas de ver.' }, { b: 'Una página por servicio principal', t: 'Qué es, cuánto cuesta o cuánto dura, y su botón para agendar o cotizar.' }, { b: 'Quiénes somos y cómo llegar', t: 'Tu equipo, dirección, horario y estacionamiento.' }] },
  { title: 'Para tu negocio', items: [{ b: 'Citas y mensajes en un solo lugar', t: 'Cada solicitud llega con nombre, teléfono y lo que necesita.' }, { b: 'Cuántas personas te contactan', t: 'Te decimos cuántos te escribieron, llamaron o agendaron desde la página.' }, { b: 'Cambios cada mes', t: 'Nos escribes un horario, un precio o una foto nueva y lo actualizamos.' }, { b: 'Mantenimiento', t: 'Hosting, seguridad, respaldos y actualizaciones, cada mes.' }] },
  { title: 'Para aparecer en Google', items: [{ b: 'Una página por servicio', t: 'Pensada para lo que la gente busca en tu zona.' }, { b: 'Datos que Google entiende', t: 'Horario, dirección y teléfono marcados para buscadores.' }, { b: 'Tu ficha conectada', t: 'Tu página y tu perfil de Google muestran la misma información.' }, { b: 'Rápida en el celular', t: 'Fotos optimizadas y sin nada que retrase la carga.' }] },
];

// Captura de la página actual del cliente (lado «Antes»), hecha por Microlink
const shot = (host, mobile) => `https://api.microlink.io/?url=${encodeURIComponent(`https://${host}`)}&screenshot=true&meta=false&embed=screenshot.url&screenshot.fullPage=true&waitForTimeout=1500&viewport.width=${mobile ? 390 : 1280}&viewport.height=${mobile ? 844 : 800}${mobile ? '&viewport.isMobile=true&viewport.deviceScaleFactor=2' : ''}`;

export function renderProposal(p, { siteUrl = '' } = {}) {
  const plan = PLANS[p.recommendedPlan] ? p.recommendedPlan : 'negocio';
  const wa = !!p.whatsappRecommended;
  const allowed = p.allowedPlans?.length ? p.allowedPlans : Object.keys(PLANS);
  const changes = (p.changes || []).slice(0, 6);
  const marks = Object.fromEntries(changes.map((c, i) => [c.section, i + 1]));
  const render = TEMPLATE_RENDERERS[p.template || 'clinica'] || renderClinica;
  const host = p.siteHost || '';
  const validUntil = p.validUntil || new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10);
  const first = (p.contactName || '').split(/\s+/)[0];
  const vista = `/vista/${p.slug}`;

  const layerOld = p.demo ? '' : host
    ? `<div class="shot"><img class="shot-desk" src="${esc(shot(host, false))}" alt="Captura de ${esc(host)} hoy, en computadora" loading="lazy"><img class="shot-mob" src="${esc(shot(host, true))}" alt="Captura de ${esc(host)} hoy, en celular" loading="lazy"></div>`
    : '<div class="shot shot--none"><p>Hoy no tienes página web. Así es como te encuentran tus clientes: solo por redes sociales o Google Maps.</p></div>';

  const values = {
    '{{P_TITLE}}': `Propuesta para ${esc(p.business)} · Ceiba Labs`,
    '{{P_BUSINESS}}': esc(p.business),
    '{{P_H1}}': `${first ? `${esc(first)}, así` : 'Así'} podría verse la página de <span class="soft">${esc(p.business)}.</span>`,
    '{{P_LEDE}}': esc(p.lede || (host ? 'La hicimos con la información de tu página actual y tu perfil de Google.' : 'La hicimos con la información de tus redes y tu perfil de Google.')),
    '{{P_VISTA}}': vista,
    '{{P_META}}': [
      first && `<div><dt>Preparada para</dt><dd>${esc(p.contactName)}</dd></div>`,
      host && `<div><dt>Página revisada</dt><dd>${esc(host)}</dd></div>`,
      p.createdAt && `<div><dt>Fecha</dt><dd>${dateLong(p.createdAt)}</dd></div>`,
      `<div><dt>Válida hasta</dt><dd>${dateLong(validUntil)} · <span class="left" id="days-left"></span></dd></div>`,
    ].filter(Boolean).join(''),
    '{{P_CMP_LEDE}}': esc(p.cmpLede || 'Usamos tus servicios, tu horario y tu dirección.'),
    '{{P_HOST}}': esc(host || `${(p.slug || '').replace(/-[a-z0-9]{4}$/, '')}.com`),
    '{{P_OLD_ATTR}}': p.demo ? ' data-tpl="old"' : '',
    '{{P_LAYER_OLD}}': layerOld,
    '{{P_LAYER_NEW}}': render(p.page || {}, { mode: 'mock', marks }),
    '{{P_CHANGES}}': changes.map((c, i) => `
          <li data-change="${i + 1}"><button type="button" aria-label="Cambio ${i + 1}: ${esc(c.title)}. Mostrar en la página">
            <span class="n" aria-hidden="true">${i + 1}</span><h3>${esc(c.title)}</h3>
            <span class="txt"><span class="before"><span>Antes</span>${esc(c.before)}</span><span class="after"><span>Después</span>${esc(c.after)}</span></span>
          </button></li>`).join(''),
    '{{P_GAIN}}': esc(p.gain || 'Más personas te contactan desde su celular, sin depender de que alguien conteste el teléfono.'),
    '{{P_INCLUDES}}': (p.includes?.length ? p.includes : DEFAULT_INCLUDES).map(g => `
      <div class="mej"><h3>${esc(g.title)}</h3><ul>${g.items.map(it => `<li><b>${esc(it.b)}</b><span>${esc(it.t)}</span></li>`).join('')}</ul></div>`).join(''),
    '{{P_PLAN_H2}}': esc(p.planTitle || `Te recomendamos el ${PLANS[plan].name}${wa ? ' con Asistente de WhatsApp' : ''}.`),
    '{{P_PLAN_LEDE}}': esc(p.planLede || 'Puedes cambiar de plan o sumar el asistente, y el total se actualiza.'),
    '{{P_PLANS}}': allowed.filter(id => PLANS[id]).map(id => {
      const on = id === plan, c = PLAN_COPY[id], why = p.planWhy?.[id] || c.why;
      return `
            <button class="pl" type="button" role="radio" data-plan="${id}" aria-checked="${on}" tabindex="${on ? 0 : -1}"><span class="radio" aria-hidden="true"></span><h3>${esc(PLANS[id].name.replace('Plan ', ''))} <span class="pl-price">${mxn(PLANS[id].activation)} + ${mxn(PLANS[id].monthly)}/mes</span>${on ? '<small>Recomendado para tu negocio</small>' : ''}</h3><p class="why">${esc(why)}</p><ul>${c.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></button>`;
    }).join(''),
    '{{P_ADDON_CHECKED}}': wa ? ' checked' : '',
    '{{P_VALID_LONG}}': dateLong(validUntil),
    '{{P_VALID_SHORT}}': dateShort(validUntil),
    '{{P_JSON}}': JSON.stringify({ slug: p.slug, plan, validUntil, validShort: dateShort(validUntil), changes: { rounds: p.changeRounds || 0, max: 1, status: p.changeStatus || null, note: p.changeNote || '', demo: !!p.demo }, wa: { activation: ADDONS.whatsapp.activation, monthly: ADDONS.whatsapp.monthly } }).replace(/</g, '\\u003c'),
    '{{P_FONTS}}': `<link rel="stylesheet" href="${fontHref(p.page)}">`,
    '{{P_TEMPLATES}}': p.demo ? TEMPLATES : '',
  };
  let out = PROPOSAL_HTML;
  for (const [k, v] of Object.entries(values)) out = out.split(k).join(v);
  return out;
}

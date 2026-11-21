// Diseño «Consulta» para despachos que quieren que el cliente se sienta escuchado desde el inicio
// (theme.style = 'consulta'), basado en Stanley Tate (Estados Unidos): la portada simula una
// primera consulta. El abogado pregunta de qué se trata y qué tan urgente es; con dos toques el
// cliente ve qué le recomiendan y manda su caso por WhatsApp. Debajo, testimonios en tarjetas
// de video (o foto) y las áreas.
import { base, esc, url, ICON } from './base.js';

export const CONSULTA_FONTS = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600&display=swap';

export function renderConsulta(c = {}, opts = {}) {
  const b = base(c, opts, '#3156D3'), { a, photo, hero, contact, name } = b;
  const host = b.members[0] || { name, photo: hero.photo, role: '' };
  const S = b.services.slice(0, 6);
  const urg = ['Esta semana', 'Este mes', 'Solo quiero informarme'];
  const out = [`<link rel="stylesheet" href="/assets/t-consulta.css">`,
    `<div class="cx cs2${b.live ? '' : ' cs2-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];
  out.push(`<header class="cq-top"><b class="cq-logo">${esc(b.brand.name || name)}</b><nav aria-label="Secciones">${[['cq-areas', 'Áreas'], ['cq-testimonios', 'Testimonios'], ['cq-oficina', 'Oficina']].map(b.navLink).join('')}</nav>${a('cq-btn', '#cq-sala', esc(b.ctaTop), b.mk('cta'))}</header>`);
  out.push(`<section class="cq-hero" id="cq-sala"${b.mk('hero')}><div class="cq-intro"><h1>${esc(hero.title)}</h1><p>${esc(hero.sub || '')}</p></div>
    <form class="cq-room" data-t-form data-intro="Hola, quiero una consulta con"${b.live ? '' : ' inert'}><div class="cq-cam">${photo(host.photo, host.name, 'cq-cam-img')}<span class="cq-live">● En consulta</span><span class="cq-who">${esc(host.name)}</span></div>
      <div class="cq-chat"><p class="cq-msg">Hola, soy ${esc(String(host.name).replace(/^(Lic\.|Mtro\.|Mtra\.|Dr\.|Dra\.|C\.P\.)\s*/, ''))}. ¿De qué se trata tu caso?</p><fieldset class="cq-opts"><legend class="t-sr">Tema</legend>${S.map((s, i) => `<label><input type="radio" name="t" data-l="Tema" value="${esc(s.name)}"${i ? '' : ''}><span>${esc(s.name)}</span></label>`).join('')}</fieldset>
      <div class="cq-step2"><p class="cq-msg">Entendido. ¿Qué tan urgente es?</p><fieldset class="cq-opts"><legend class="t-sr">Urgencia</legend>${urg.map(u => `<label><input type="radio" name="u" data-l="Urgencia" value="${esc(u)}"><span>${esc(u)}</span></label>`).join('')}</fieldset></div>
      <div class="cq-step3"><p class="cq-msg">Gracias. Escríbenos tu caso por WhatsApp y lo revisamos hoy. ${esc(c.util?.note || '')}</p><button type="submit">Enviar mi caso por WhatsApp</button></div></div></form></section>`);
  if (S.length) out.push(`<section class="cq-areas" id="cq-areas"${b.mk('services')}><h2>${esc(c.services?.title || 'Áreas')}</h2><div>${b.services.map(s => `<article><h3>${esc(s.name)}</h3><p>${esc(s.desc || '')}</p>${a('cq-link', b.serviceHref(s), `Consultar ${ICON.arrow('')}`)}</article>`).join('')}</div></section>`);
  if (b.reviews.length) out.push(`<section class="cq-testi" id="cq-testimonios"${b.mk('reviews')}><h2>Testimonios</h2><div>${b.reviews.slice(0, 3).map((r, i) => `<article>${url(r.video) ? `<video src="${esc(url(r.video))}" controls playsinline preload="none"></video>` : `<div class="cq-tv">${photo(b.gallery[i]?.img || hero.photo, '', 'cq-tv-img')}<span class="cq-play">${ICON.play}</span></div>`}<p>“${esc(r.text)}”</p><cite>${esc(r.name)}</cite></article>`).join('')}</div></section>`);
  if (b.steps.length) out.push(`<section class="cq-steps"><h2>${esc(c.process?.title || 'Cómo trabajamos')}</h2><ol>${b.steps.map(s => `<li><b>${esc(s.t)}</b><span>${esc(s.d || '')}</span></li>`).join('')}</ol></section>`);
  if (b.faq.length) out.push(`<section class="cq-faq"><h2>Preguntas</h2>${b.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);
  out.push(`<footer class="cq-foot" id="cq-oficina"${b.mk('visit')}><div><b class="cq-logo">${esc(b.brand.name || name)}</b><p>${esc(contact.address || '')}</p></div><div><p>${b.rows.map(r => `${esc(r.dt)}: ${esc(r.dd)}`).join('<br>')}</p></div><div><p>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</p>${b.mapsHref ? `<p>${a('', b.mapsHref, 'Cómo llegar')}</p>` : ''}</div><div class="cq-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="cq-sticky">${a('cq-btn', '#cq-sala', esc(b.ctaTop))}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}

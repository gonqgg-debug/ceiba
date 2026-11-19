// Plantilla «clínica»: la portada nueva que ve el cliente en su propuesta.
// Es un módulo ES sin dependencias: lo usan el servidor (/vista/[slug]) y el
// navegador (comparador de /p/[slug]; build.py lo copia a site/assets/).
//
//   renderClinica(content, { mode: 'live' | 'mock', marks: { services: 2, ... } })
//
// mode 'live': enlaces reales (tel:, WhatsApp, mapas) para la vista previa completa.
// mode 'mock': los botones no navegan, para mostrarla dentro del comparador.
// Esquema de `content`: ver ops/esquema-propuesta.md

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#1F4FD1');
const digits = s => String(s ?? '').replace(/\D/g, '');
const WA = '<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';
const ARROW_L = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW_R = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const stars = n => '★★★★★'.slice(0, Math.max(1, Math.min(5, Math.round(Number(n) || 5))));

export function renderClinica(c = {}, { mode = 'live', marks = {} } = {}) {
  const live = mode === 'live';
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const waNum = digits(contact.whatsapp);
  const telNum = digits(contact.phone);
  const waHref = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(`Hola, quiero agendar una cita en ${brand.fullName || brand.name || 'la clínica'}`)}` : '';
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const bookHref = url(contact.bookingUrl) || waHref || (telNum ? `tel:${telNum}` : '');
  const mk = sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`;
  // Botón o enlace según el modo. Los enlaces externos abren en otra pestaña.
  const act = (cls, href, inner, extra = '') => live && href
    ? `<a class="${cls}" href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ''}${extra}>${inner}</a>`
    : `<span class="${cls}"${extra}>${inner}</span>`;
  const page = label => live ? `<a href="#" data-page="${esc(label)}">${esc(label)}</a>` : `<span>${esc(label)}</span>`;
  const bg = (u, extra = '') => (url(u) ? ` style="background-image:url('${url(u)}')${extra}"` : '');

  const nav = (c.nav?.length ? c.nav : ['Tratamientos', 'Opiniones', 'Ubicación']).slice(0, 6);
  const rating = c.rating && c.rating.value ? c.rating : null;
  const ratingHtml = r => r ? `<b>${esc(r.value)}</b><span class="mn-stars" aria-hidden="true">${stars(r.value)}</span><span>${esc(r.count)} reseñas en ${esc(r.source || 'Google')}</span>` : '';
  const services = c.services?.items?.length ? c.services : null;
  const team = c.team?.text ? c.team : null;
  const reviews = c.reviews?.items?.length ? c.reviews : null;
  const visit = c.visit || {};
  const chat = c.chat?.faq?.length ? c.chat : null;

  return `<div class="mk-new" style="--c-accent:${hex(brand.accent)}">
  <div class="mn-util">${c.util?.note ? `<span>${esc(c.util.note)}</span>` : ''}${c.util?.hours ? `<span>${esc(c.util.hours)}</span>` : ''}${waNum ? act('mn-util-wa', waHref, `${WA}${esc(contact.whatsappLabel || contact.phone || '')}`, mk('whatsapp')) : ''}</div>
  <div class="mn-top"><div class="mn-brand"><b>${esc(brand.name)}</b>${brand.tagline ? `<span>${esc(brand.tagline)}</span>` : ''}</div><nav>${nav.map(page).join('')}</nav>${waNum ? act('mn-wa-btn', waHref, WA, ' title="WhatsApp"') : ''}${act('mn-btn', bookHref, esc(hero.ctaTop || 'Agenda tu cita'), mk('cta'))}</div>
  <div class="mn-hero"${mk('hero')}>
    <div class="mn-copy">
      <h3>${esc(hero.title)}</h3>
      ${hero.sub ? `<p class="sub">${esc(hero.sub)}</p>` : ''}
      <div class="mn-ctas">${act('mn-btn', bookHref, esc(hero.cta || 'Agenda tu cita'))}${waNum ? act('mn-ghost mn-ghost--wa', waHref, `${WA}${esc(hero.ctaWhatsapp || 'Escríbenos por WhatsApp')}`) : ''}</div>
      ${telNum ? `<p class="mn-call">${esc(hero.callLabel || 'Llamar para agendar')}: ${live ? `<a href="tel:${telNum}"><b>${esc(contact.phone)}</b></a>` : `<b>${esc(contact.phone)}</b>`}</p>` : ''}
      ${rating ? `<p class="mn-rating">${ratingHtml(rating)}</p>` : ''}
    </div>
    <div class="mn-photo-wrap">
      <div class="mn-photo" role="img" aria-label="${esc(hero.photoAlt || brand.fullName || '')}"${bg(hero.photo)}></div>
      ${hero.slots?.length ? `<div class="mn-slots"><b>Horarios disponibles</b><div>${hero.slots.slice(0, 3).map(s => `<span>${esc(s)}</span>`).join('')}</div><em>Ver más horarios</em></div>` : ''}
    </div>
  </div>
  ${c.trust?.length ? `<ul class="mn-trust"${mk('trust')}>${c.trust.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b>${esc(t.t)}</li>`).join('')}</ul>` : ''}
  ${services ? `<div class="mn-treat"${mk('services')}><div class="mn-treat-head"><h4>${esc(services.title || 'Nuestros servicios')}</h4><div class="mn-car-nav"><button type="button" data-car="prev" aria-label="Anterior">${ARROW_L}</button><button type="button" data-car="next" aria-label="Siguiente">${ARROW_R}</button></div></div>
    <ul class="mn-car" tabindex="0" aria-label="${esc(services.title || 'Servicios')}, desliza para ver más">${services.items.slice(0, 8).map(s => {
      const call = s.action === 'Llamar' && telNum;
      return `<li class="mn-tc"><div class="mn-tc-img" role="img" aria-label="${esc(s.imgAlt || s.name)}"${bg(s.img)}></div><div class="mn-tc-body"><b>${esc(s.name)}</b>${s.price ? `<i>${esc(s.price)}</i>` : ''}<span>${esc(s.desc)}</span>${live && (call || bookHref) ? `<a href="${esc(call ? `tel:${telNum}` : bookHref)}" style="display:contents"${!call && /^https?:/.test(bookHref) ? ' target="_blank" rel="noopener"' : ''}><em>${esc(s.action || 'Agendar')}</em></a>` : `<em>${esc(s.action || 'Agendar')}</em>`}</div></li>`;
    }).join('')}</ul>
    ${services.note ? `<p class="mn-note">${esc(services.note)}</p>` : ''}
  </div>` : ''}
  ${team ? `<div class="mn-team"${mk('team')}><div class="mn-portrait" role="img" aria-label="${esc(team.photoAlt || '')}"${bg(team.photo)}></div><div class="mn-cred"><h4>${esc(team.title)}</h4><p>${esc(team.text)}</p>${team.bullets?.length ? `<ul>${team.bullets.slice(0, 4).map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}${team.note ? `<small>${esc(team.note)}</small>` : ''}</div></div>` : ''}
  ${reviews ? `<div class="mn-reviews"${mk('reviews')}>
    <div class="mn-rev-head"><h4>${esc(reviews.title || 'Lo que dicen nuestros clientes')}</h4>${rating ? `<p><b>${esc(rating.value)} de 5</b><span class="mn-stars" aria-hidden="true">${stars(rating.value)}</span><span>${esc(rating.count)} reseñas en ${esc(rating.source || 'Google')}</span></p>` : ''}</div>
    <div class="mn-rev-list">${reviews.items.slice(0, 3).map(r => `<figure class="mn-rev"><span class="mn-stars" aria-label="${esc(r.stars || 5)} de 5">${stars(r.stars || 5)}</span><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b>${r.meta ? `<span>${esc(r.meta)}</span>` : ''}</figcaption></figure>`).join('')}</div>
    <p class="mn-rev-more">${live && url(reviews.moreUrl) ? `<a href="${esc(url(reviews.moreUrl))}" target="_blank" rel="noopener">Ver todas las reseñas en Google</a>` : 'Ver todas las reseñas en Google'}${reviews.note ? `<small>${esc(reviews.note)}</small>` : ''}</p>
  </div>` : ''}
  <div class="mn-visit"${mk('visit')}><div class="mn-facade" role="img" aria-label="${esc(visit.photoAlt || 'Fachada')}"${bg(visit.photo)}></div><div><h4>${esc(visit.title || 'Visítanos')}</h4><dl>${contact.address ? `<dt>Dirección</dt><dd>${esc(contact.address)}</dd>` : ''}${(visit.rows || []).slice(0, 5).map(r => `<dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd>`).join('')}</dl><p class="mn-visit-acts">${mapsHref ? act('mn-ghost', mapsHref, 'Abrir en Google Maps') : ''}${waNum ? act('mn-ghost mn-ghost--wa', waHref, `${WA}${esc(hero.ctaWhatsapp || 'Escríbenos por WhatsApp')}`) : ''}</p></div></div>
  <div class="mn-foot"><span>${esc(brand.fullName || brand.name)}</span><span>Aviso de privacidad</span>${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</div>
  ${chat ? `<div class="mn-float">
    <div class="mn-ai" role="region" aria-label="Chat de ${esc(brand.fullName || brand.name)}">
      <div class="mn-ai-top"><div><b>${esc(chat.title || brand.fullName || brand.name)}</b><span>${esc(chat.subtitle || 'Te respondemos aquí o por WhatsApp')}</span></div><button type="button" class="mn-ai-x" data-ai="toggle" aria-label="Cerrar chat">×</button></div>
      <div class="mn-ai-log"><p class="mn-ai-msg bot">${esc(chat.greeting || 'Hola 👋 ¿En qué te podemos ayudar?')}</p></div>
      <div class="mn-ai-sug">${chat.faq.slice(0, 4).map(f => `<button type="button" data-ai="faq" data-a="${esc(f.a)}" data-act="${f.action === 'book' ? 'book' : 'wa'}">${esc(f.q)}</button>`).join('')}</div>
    </div>
    <button type="button" class="mn-ai-btn" data-ai="toggle" aria-expanded="false"${mk('chat')}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>${esc(chat.button || '¿Dudas? Pregúntanos')}</button>
  </div>` : ''}
  <div class="mn-sticky">${act('mn-btn', bookHref, esc(hero.ctaTop || 'Agenda tu cita'))}${waNum ? act('mn-ghost mn-ghost--wa', waHref, `${WA}WhatsApp`) : ''}</div>
</div>`;
}

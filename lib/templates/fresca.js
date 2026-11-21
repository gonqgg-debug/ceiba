// Diseño «Fresca» para clínicas (theme.style = 'fresca'), basado en Swish Dental:
// juguetona y moderna. Fotos en arco asimétrico con un bloque de color que asoma, tres
// destellos sobre el título con la última línea en color, líneas de colores entre secciones,
// un marco rosa alrededor de los tratamientos, franja oscura de opiniones con borde
// festoneado y tarjetas de formas de pago. Mismo JSON que «clinica». Estilos: /assets/t-fresca.css.
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = u => (typeof u === 'string' && (/^https:\/\//i.test(u) || /^\/[^/]/.test(u)) ? u.replace(/["'()\\\s]/g, ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0')) : '');
const list = a => (Array.isArray(a) ? a.filter(Boolean) : []);
const digits = s => String(s ?? '').replace(/\D/g, '');
const hex = c => (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#2BA59B');
const WA = '<svg class="fr-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';
const ARROW = '<svg class="fr-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/></svg>';

export const FRESCA_FONTS = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';

// Título con la última línea en color: parte el título en su último tercio de palabras
const splitTitle = t => { const w = String(t || '').split(/\s+/).filter(Boolean); const k = Math.max(1, Math.round(w.length * 0.35)); return [w.slice(0, -k).join(' '), w.slice(-k).join(' ')]; };

export function renderFresca(c = {}, { mode = 'live', marks = {}, fontVars = '' } = {}) {
  const live = mode === 'live';
  const brand = c.brand || {}, contact = c.contact || {}, hero = c.hero || {};
  const name = brand.fullName || brand.name || '';
  const waNum = digits(contact.whatsapp), telNum = digits(contact.phone);
  const waMsg = t => `https://wa.me/${waNum}?text=${encodeURIComponent(t)}`;
  const waHref = waNum ? waMsg(`Hola, quiero agendar una cita en ${name || 'la clínica'}`) : '';
  const mapsHref = url(contact.mapsUrl) || (contact.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}` : '');
  const bookHref = url(contact.bookingUrl) || waHref || (telNum ? `tel:${telNum}` : '');
  const mk = sec => (marks[sec] ? ` data-mark="${marks[sec]}"` : '') + ` data-sec="${sec}"`;
  const ext = h => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '');
  const a = (cls, href, inner, extra = '') => (live && href ? `<a class="${cls}" href="${esc(href)}"${ext(href)}${extra}>${inner}</a>` : `<span class="${cls}"${extra}>${inner}</span>`);
  const photo = (u, alt, cls) => (url(u) ? `<div class="${cls}" role="img" aria-label="${esc(alt || '')}" style="background-image:url('${url(u)}')"></div>` : `<div class="${cls} fr-noimg" aria-hidden="true"></div>`);
  const lines = '<div class="fr-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>';

  const services = list(c.services?.items).slice(0, 6);
  const reviews = list(c.reviews?.items).slice(0, 6);
  const rating = c.rating?.value ? c.rating : null;
  const members = list(c.team?.members).slice(0, 4), lead = members[0];
  const faq = (list(c.faq).length ? list(c.faq) : list(c.chat?.faq)).filter(f => f.q && f.a).slice(0, 6);
  const visit = c.visit || {};
  const rows = list(visit.rows).filter(r => !(contact.address && /^direcci/i.test(r.dt || '')));
  const pay = list(c.payments?.methods), insurers = list(c.payments?.insurers);
  const offers = list(c.offers?.items).slice(0, 3);
  const instagram = list(c.social).map(String).find(s => /instagram/i.test(s)) || '';
  const igHandle = instagram ? '@' + instagram.replace(/\/+$/, '').split('/').pop() : '';
  const ctaTop = hero.ctaTop || 'Agenda tu cita';
  const [t1, t2] = splitTitle(hero.title);
  const nav = [services.length && ['fr-trat', 'Tratamientos'], (pay.length || offers.length) && ['fr-pagos', 'Pagos'], lead && ['fr-equipo', 'Equipo'], ['fr-llegar', 'Contacto']].filter(Boolean);
  const kb = { name, wa: waNum, book: live ? bookHref : '', services: services.map(s => [s.name, s.price || '', s.desc || '']) };

  const out = [`<link rel="stylesheet" href="/assets/t-fresca.css">`];
  out.push(`<div class="cx fr${live ? '' : ' fr-still'}" style="--a:${hex(brand.accent)};${fontVars}" data-name="${esc(name)}" data-wa="${esc(waNum)}">`);

  const logo = url(brand.logo) ? `<img src="${url(brand.logo)}" alt="${esc(name)}">` : `<b>${esc(brand.name || name)}</b>`;
  out.push(`<header class="fr-top">${live ? `<a class="fr-logo" href="#fr-inicio">${logo}</a>` : `<span class="fr-logo">${logo}</span>`}
    <nav class="fr-nav" aria-label="Secciones">${nav.map(([id, l]) => (live ? `<a href="#${id}">${esc(l)}</a>` : `<span>${esc(l)}</span>`)).join('')}</nav>
    <div class="fr-top-acts">${telNum ? a('fr-tel', `tel:${telNum}`, esc(contact.phone)) : ''}${a('fr-btn', bookHref, esc(ctaTop), mk('cta'))}</div></header>${lines}`);

  // Hero: destellos, título con la última línea en color y la foto en arco
  out.push(`<section class="fr-hero" id="fr-inicio"${mk('hero')}><div class="fr-hero-copy">
      <p class="fr-spark" aria-hidden="true">${SPARK.repeat(3)}</p>
      <h1>${esc(t1)} <em>${esc(t2)}</em></h1>
      ${hero.sub ? `<p class="fr-lede">${esc(hero.sub)}</p>` : ''}
      <div class="fr-ctas">${a('fr-btn fr-btn--lg', bookHref, esc(hero.cta || ctaTop))}${waNum ? a('fr-btn fr-btn--lg fr-btn--line', waHref, `${WA}${esc(hero.ctaWhatsapp || 'Escríbenos')}`) : ''}</div>
      ${rating ? `<p class="fr-rating"><span aria-hidden="true">${STAR.repeat(5)}</span><b>${esc(rating.value)}</b> en ${esc(rating.source || 'Google')} · ${esc(rating.count)} reseñas</p>` : ''}</div>
    <div class="fr-arch fr-arch--hero">${photo(hero.photo, hero.photoAlt || name, 'fr-arch-img')}</div></section>${lines}`);

  // Quiénes somos: foto en arco a la izquierda y texto
  if (c.team?.text || c.today?.text) out.push(`<section class="fr-about"><div class="fr-arch fr-arch--left">${photo(c.team?.photo || lead?.photo || hero.photo, c.team?.photoAlt || '', 'fr-arch-img')}</div>
    <div class="fr-about-copy"><p class="fr-kicker">${esc(c.team?.kicker || 'Así te atendemos')}</p><h2>${esc(c.today?.title || c.team?.title || 'Una visita que sí da gusto')}</h2>
      ${[c.today?.text, c.team?.text].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}${a('fr-btn', bookHref, esc(ctaTop))}</div></section>${lines}`);

  // Tratamientos dentro del marco rosa
  if (services.length) out.push(`<section class="fr-frame" id="fr-trat"${mk('services')}><div class="fr-frame-in">
      <p class="fr-kicker fr-center">${esc(c.services.kicker || 'Tratamientos')}</p><h2 class="fr-center">${esc(c.services.title || 'Nuestros tratamientos')}</h2>${c.services.sub ? `<p class="fr-sub">${esc(c.services.sub)}</p>` : ''}
      <ul class="fr-cards">${services.map(s => { const go = waNum && !contact.bookingUrl ? waMsg(`Hola, me interesa: ${s.name}`) : bookHref; return `<li class="fr-card">${photo(s.img, s.imgAlt || s.name, 'fr-card-img')}<h3>${esc(s.name)}${s.price ? `<small>${esc(s.price)}</small>` : ''}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${a('fr-more', go, `Agendar${ARROW}`)}</li>`; }).join('')}</ul>
      ${c.services.note ? `<p class="fr-note fr-center">${esc(c.services.note)}</p>` : ''}</div></section>`);

  // Opiniones: franja oscura con borde festoneado
  if (reviews.length) out.push(`<section class="fr-reviews"${mk('reviews')}><div class="fr-scallop" aria-hidden="true"></div>
    <p class="fr-kicker fr-center">${rating ? `${esc(rating.value)} de 5 en ${esc(rating.source || 'Google')}` : 'Opiniones'}</p><h2 class="fr-center">${esc(c.reviews.title || 'Lo que dicen nuestros pacientes')}</h2>
    <div class="fr-rev-track" tabindex="0" aria-label="Opiniones, desliza para ver más">${reviews.map(r => `<figure class="fr-rev"><span class="fr-q" aria-hidden="true">“</span><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b>${r.meta ? `<span>${esc(r.meta)}</span>` : ''}</figcaption></figure>`).join('')}</div>
    ${c.reviews.note ? `<p class="fr-note fr-center">${esc(c.reviews.note)}</p>` : ''}<div class="fr-scallop fr-scallop--b" aria-hidden="true"></div></section>`);

  // Equipo: arco con bloque de color a la derecha
  if (lead) out.push(`<section class="fr-team" id="fr-equipo"${mk('team')}><div class="fr-team-copy"><p class="fr-kicker">Quién te atiende</p><h2>${esc(c.team?.title || 'Nuestro equipo')}</h2>
      <ul class="fr-checks">${members.map(m => `<li><b>${esc(m.name)}</b>${m.role ? ` · ${esc(m.role)}` : ''}${m.cedula ? `<small>Cédula ${esc(m.cedula)}</small>` : ''}</li>`).join('')}</ul>
      ${c.team?.note ? `<p class="fr-note">${esc(c.team.note)}</p>` : ''}</div><div class="fr-arch fr-arch--right">${photo(lead.photo, lead.name, 'fr-arch-img')}</div></section>${lines}`);

  // Formas de pago y paquetes: tarjetas con borde de color
  const payCards = [
    pay.length && { t: c.payments?.title || 'Paga como te acomode', d: c.payments?.text || pay.join(' · '), extra: pay.join(' · ') },
    insurers.length && { t: 'Aseguradoras', d: `Trabajamos con ${insurers.join(', ')}.` },
    ...offers.map(o => ({ t: o.title, d: o.desc, price: o.price, was: o.was })),
  ].filter(Boolean).slice(0, 3);
  if (payCards.length) out.push(`<section class="fr-pay" id="fr-pagos"><p class="fr-kicker fr-center">Precios claros</p><h2 class="fr-center">${esc(c.offers?.title || 'Opciones para cada bolsillo')}</h2>
    <ul class="fr-pay-list">${payCards.map((p, i) => `<li style="--c:var(${['--a', '--pink', '--gold'][i]})"><h3>${esc(p.t)}</h3><p>${esc(p.d)}</p>${p.price ? `<p class="fr-price">${p.was ? `<s>${esc(p.was)}</s>` : ''}<b>${esc(p.price)}</b></p>` : ''}${p.extra && p.extra !== p.d ? `<small>${esc(p.extra)}</small>` : ''}</li>`).join('')}</ul>
    <div class="fr-ctas fr-center">${a('fr-btn fr-btn--lg', bookHref, esc(ctaTop))}</div></section>${lines}`);

  // Preguntas
  if (faq.length) out.push(`<section class="fr-faq"><h2 class="fr-center">Preguntas frecuentes</h2><div class="fr-qa">${faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  // Contacto
  out.push(`<section class="fr-end" id="fr-llegar"${mk('visit')}><div class="fr-end-card"><div><p class="fr-kicker">Visítanos</p><h2>${esc(contact.address ? 'Aquí te esperamos' : 'Escríbenos')}</h2>
      ${contact.address ? `<p>${esc(contact.address)}</p>` : ''}${rows.length ? `<dl>${rows.slice(0, 4).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl>` : ''}
      <div class="fr-ctas">${a('fr-btn', bookHref, esc(ctaTop))}${mapsHref ? a('fr-btn fr-btn--line', mapsHref, 'Cómo llegar') : ''}</div></div>
      ${igHandle ? `<p class="fr-ig">Síguenos ${a('', instagram, esc(igHandle))}</p>` : ''}</div></section>
    <footer class="fr-foot">${lines}<div><span>© ${new Date().getFullYear()} ${esc(name)}</span>${telNum ? a('', `tel:${telNum}`, esc(contact.phone)) : ''}<span>Aviso de privacidad</span>${c.legal?.cofepris ? `<span>COFEPRIS ${esc(c.legal.cofepris)}</span>` : ''}${c.footer?.note ? `<span>${esc(c.footer.note)}</span>` : ''}</div></footer>`);
  if (waNum) out.push(`<div class="fr-fab">${a('fr-wa-fab', waHref, WA, ' aria-label="Escríbenos por WhatsApp"')}</div>`);
  out.push(`<div class="fr-sticky">${a('fr-btn', bookHref, esc(ctaTop))}${waNum ? a('fr-btn fr-btn--line', waHref, `${WA}WhatsApp`) : ''}</div>`);
  out.push(`<script type="application/json" class="fr-kb">${JSON.stringify(kb).replace(/</g, '\\u003c')}</script></div>`);
  return out.join('\n');
}

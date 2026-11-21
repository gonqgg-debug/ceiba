// Diseño «Ciudad» para clínicas con una o varias sucursales (theme.style = 'ciudad'), basado en
// Downtown Dental: foto de la ciudad con capa azul y título grande y delgado, tarjetas por
// sucursal (foto, nombre de la zona, servicios, horario y contacto) montadas sobre el hero,
// tratamientos en cuadrícula, un cupón de paciente nuevo con borde punteado, el equipo a lo
// ancho, «por qué elegirnos» numerado y aseguradoras.
// Sucursales: c.locations = [{ name, zone, streets, text, address, phone, photo, rows: [{dt, dd}] }]; si no hay, se arma una con contact y visit.
import { base, esc, list, url, schedule, ICON } from './base.js';

export const CIUDAD_FONTS = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Roboto:wght@400;500;700&display=swap';
const TOOTH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.4 2.6.8 6 2.5 6 1.6 0 1.7-3.5 2.4-5.5.3-1 .6-1.5 2.1-1.5s1.8.5 2.1 1.5c.7 2 .8 5.5 2.4 5.5 1.7 0 2.1-3.4 2.5-6 .5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3Z"/></svg>';

export function renderCiudad(c = {}, opts = {}) {
  const b = base(c, opts, '#2A57A8'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 6), trust = b.trust.slice(0, 5), offer = b.offers[1] || b.offers[0];
  const locs = (list(c.locations).length ? list(c.locations) : [{
    name: b.brand.name || name, zone: (String(contact.address || '').match(/col\.?\s*([^,]+)/i) || [])[1] || b.brand.tagline || 'Nuestra clínica',
    streets: String(contact.address || '').split(',')[0], text: c.team?.text || hero.sub, address: contact.address, phone: contact.phone, photo: b.visit.photo, rows: b.rows,
  }]).slice(0, 3);
  const nav = [['cd-sucursales', locs.length > 1 ? 'Sucursales' : 'Ubicación'], services.length && ['cd-trat', 'Tratamientos'], b.members.length && ['cd-equipo', 'Equipo'], trust.length && ['cd-porque', 'Por qué elegirnos']].filter(Boolean);

  const out = [`<link rel="stylesheet" href="/assets/t-ciudad.css">`,
    `<div class="cx cd${b.live ? '' : ' cd-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  out.push(`<section class="cd-hero"${b.mk('hero')}>${photo(c.hero?.cityPhoto || hero.photo, hero.photoAlt || '', 'cd-hero-img')}<div class="cd-tint" aria-hidden="true"></div>
    <div class="cd-util">${locs.filter(l => l.phone).map(l => `<span>${locs.length > 1 ? `${esc(l.zone)} ` : 'Llámanos '}${a('', `tel:${String(l.phone).replace(/\D/g, '')}`, `<b>${esc(l.phone)}</b>`)}</span>`).join('')}</div>
    <header class="cd-top"><span class="cd-logo">${url(b.brand.logo) ? `<img src="${url(b.brand.logo)}" alt="${esc(name)}">` : `<b>${esc(b.brand.name || name)}</b>`}<svg class="cd-swash" viewBox="0 0 200 14" aria-hidden="true"><path d="M2 9c40-8 80 6 120-2s60-4 76-1"/></svg></span>
      <nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav>${a('cd-pill cd-pill--teal', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>
    <div class="cd-hero-copy"><h1>${esc(hero.title)}</h1>${a('cd-pill', b.bookHref, esc(hero.cta || b.ctaTop))}</div>
    ${trust[0] ? `<div class="cd-pledge"><span class="cd-badge" aria-hidden="true">${TOOTH}</span><div><b>${esc(trust[0].b)}</b><p>${esc(trust[0].t)}</p></div></div>` : ''}</section>`);

  // Tarjetas por sucursal, montadas sobre el hero
  out.push(`<section class="cd-locs" id="cd-sucursales"${b.mk('visit')}>${locs.map(l => {
    const tel = String(l.phone || '').replace(/\D/g, ''), maps = l.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.address)}` : '';
    const sch = schedule(l.rows);
    return `<article class="cd-loc">${photo(l.photo, `Fachada de ${l.name}`, 'cd-loc-img')}<div class="cd-loc-in"><p class="cd-kick">${esc(l.name)}</p><h2>${esc(l.zone)}</h2>${l.streets ? `<p class="cd-streets">${esc(l.streets)}</p>` : ''}
      ${sch.length ? `<p class="cd-open" data-t-open='${JSON.stringify(sch)}'>Consulta el horario</p>` : ''}
      ${l.text ? `<p>${esc(l.text)}</p>` : ''}${services.length ? `<ul class="cd-svc">${services.map(s => `<li>${TOOTH}${esc(s.name)}</li>`).join('')}</ul>` : ''}
      ${a('cd-pill cd-pill--teal', b.waNum ? b.waMsg(`Hola, quiero agendar en ${l.zone}`) : b.bookHref, esc(b.ctaTop))}
      <div class="cd-loc-foot">${list(l.rows).length ? `<div><h3>Horario</h3><dl>${list(l.rows).slice(0, 7).map(r => `<div><dt>${esc(r.dt)}</dt><dd>${esc(r.dd)}</dd></div>`).join('')}</dl></div>` : ''}
        <div><h3>Contacto</h3>${l.address ? `<p>${esc(l.address)}</p>` : ''}${tel ? a('cd-link', `tel:${tel}`, esc(l.phone)) : ''}${maps ? a('cd-link', maps, 'Cómo llegar') : ''}</div></div></div></article>`;
  }).join('')}</section>`);

  // Tratamientos
  if (services.length) out.push(`<section class="cd-trat" id="cd-trat"${b.mk('services')}><h2 class="cd-big">${esc(c.services.title || 'Nuestros tratamientos')}</h2>${c.services.sub ? `<p class="cd-sub">${esc(c.services.sub)}</p>` : ''}
    <ul>${services.map(s => `<li>${photo(s.img, s.imgAlt || s.name, 'cd-trat-img')}<h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<p class="cd-price">${esc(s.price)}</p>` : ''}${a('cd-pill cd-pill--teal cd-pill--sm', b.serviceHref(s), 'Agendar')}</li>`).join('')}</ul></section>`);

  // Cupón de paciente nuevo y segunda oferta
  if (offer) out.push(`<section class="cd-promos">${b.offers.length > 1 ? `<article class="cd-promo">${photo(b.services[4]?.img || hero.photo, '', 'cd-promo-img')}<h3>${esc(b.offers[0].title)}</h3><p>${esc(b.offers[0].desc || '')}</p></article>` : ''}
    <article class="cd-promo"><div class="cd-coupon"><div class="cd-coupon-top"><b>${esc(offer.price || '')}</b><span>${esc(offer.tag || 'Paciente nuevo')}</span></div><p class="cd-coupon-t">${esc(offer.title)}</p>${offer.desc ? `<p>${esc(offer.desc)}</p>` : ''}<span class="cd-stars" aria-hidden="true">${ICON.star.repeat(5)}</span></div>
      <h3>${esc(offer.title)}${offer.was ? ` <s>${esc(offer.was)}</s>` : ''}</h3>${a('cd-link', b.waNum ? b.waMsg(`Hola, quiero la promoción: ${offer.title}`) : b.bookHref, 'Quiero esta promoción')}</article></section>`);

  // Equipo a lo ancho
  if (b.members.length) out.push(`<section class="cd-team" id="cd-equipo"${b.mk('team')}>${photo(c.team?.groupPhoto || b.gallery[2]?.img || b.members[0].photo, 'Nuestro equipo', 'cd-team-img')}<div class="cd-team-names">${b.members.slice(0, 6).map(m => `<span><b>${esc(m.name)}</b>${m.role ? ` · ${esc(m.role)}` : ''}</span>`).join('')}</div></section>`);

  // Por qué elegirnos, numerado
  if (trust.length) out.push(`<section class="cd-why" id="cd-porque"${b.mk('trust')}><h2 class="cd-big">¿Por qué elegirnos?</h2><ol>${trust.map(t => `<li><h3>${esc(t.b)}</h3><p>${esc(t.t)}</p></li>`).join('')}</ol></section>`);

  // Aseguradoras y formas de pago
  if (b.insurers.length || b.pay.length) out.push(`<section class="cd-ins"><h3>${b.insurers.length ? 'Aceptamos tu seguro' : 'Formas de pago'}</h3><ul>${[...b.insurers, ...b.pay].map(x => `<li>${esc(x)}</li>`).join('')}</ul>${a('cd-pill cd-pill--teal cd-pill--sm', b.waNum ? b.waMsg('Hola, ¿aceptan mi seguro?') : b.bookHref, 'Pregunta por el tuyo')}</section>`);

  if (b.faq.length) out.push(`<section class="cd-faq"><h2 class="cd-big">Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>`);

  out.push(`<footer class="cd-foot"><span class="cd-logo cd-logo--w"><b>${esc(b.brand.name || name)}</b></span><div>${b.legal()}</div></footer>`);
  out.push(`<div class="cd-sticky">${a('cd-pill cd-pill--teal', b.bookHref, esc(b.ctaTop))}${b.telNum ? a('cd-pill', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}

// Diseño «Nogal» para clínicas (theme.style = 'nogal'), basado en Bates Dental: cálido,
// chocolate y cobre. Barra café con monograma redondo, hero de personas sonriendo con el
// título al centro y «síguenos» al pie, fotos encimadas sobre bloques de madera de nogal,
// franjas beige, carrusel de tratamientos, la doctora sobre madera, opiniones con estrellas
// cobre y una franja de contacto en cuatro columnas.
import { base, esc, url, ICON } from './base.js';

export const NOGAL_FONTS = 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Karla:wght@400;500;700&display=swap';

export function renderNogal(c = {}, opts = {}) {
  const b = base(c, opts, '#A86B45'), { a, photo, hero, contact, name } = b;
  const services = b.services.slice(0, 8), lead = b.members[0], reviews = b.reviews.slice(0, 3);
  const initials = String(b.brand.name || name).split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const social = (c.social || []).map(String).filter(s => /instagram|facebook|google|tiktok/i.test(s)).slice(0, 4);
  const nav = [lead && ['ng-equipo', 'Equipo'], services.length && ['ng-trat', 'Tratamientos'], reviews.length && ['ng-opiniones', 'Opiniones'], ['ng-contacto', 'Contacto']].filter(Boolean);
  const city = String(contact.address || '').split(',').slice(-1)[0].trim();

  const out = [`<link rel="stylesheet" href="/assets/t-nogal.css">`,
    `<div class="cx ng${b.live ? '' : ' ng-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  out.push(`<header class="ng-top"><span class="ng-mono">${url(b.brand.logo) ? `<img src="${url(b.brand.logo)}" alt="${esc(name)}">` : `<i>${esc(initials)}</i><small>${esc(b.brand.name || name)}</small>`}</span>
    <nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav>${b.telNum ? a('ng-phone', `tel:${b.telNum}`, esc(contact.phone), b.mk('cta')) : a('ng-phone', b.bookHref, esc(b.ctaTop), b.mk('cta'))}</header>`);

  out.push(`<section class="ng-hero"${b.mk('hero')}>${photo(hero.photo, hero.photoAlt || name, 'ng-hero-img')}<div class="ng-hero-copy"><p class="ng-kick">${esc(b.brand.tagline || 'Odontología')}${city ? `  |  ${esc(city)}` : ''}</p><h1>${esc(hero.title)}</h1>${a('ng-btn', b.bookHref, esc(hero.cta || b.ctaTop))}</div>
    <div class="ng-follow"><span>Síguenos</span><span class="ng-soc">${social.length ? social.map(s => a('', s, /instagram/i.test(s) ? 'IG' : /facebook/i.test(s) ? 'FB' : /google/i.test(s) ? 'G' : 'TT', ` aria-label="${esc(s)}"`)).join('') : (b.waNum ? a('', b.waHref, 'WhatsApp') : '')}</span></div></section>`);

  // Bienvenida: foto encimada sobre madera
  out.push(`<section class="ng-welcome"><div class="ng-stack"><i class="ng-wood" aria-hidden="true"></i>${photo(b.gallery[1]?.img || services[0]?.img || hero.photo, b.gallery[1]?.alt || '', 'ng-stack-img')}</div>
    <div class="ng-copy"><p class="ng-kick ng-kick--c">Bienvenido a ${esc(b.brand.name || name)}</p><h2>${esc(c.today?.title || 'Tu sonrisa es nuestra pasión')}</h2>${[c.team?.text, c.today?.text].filter(Boolean).map(t => `<p>${esc(t)}</p>`).join('')}
      <div class="ng-ctas">${b.telNum ? a('ng-btn', `tel:${b.telNum}`, 'Llámanos') : ''}${b.waNum ? a('ng-btn', b.waHref, 'Escríbenos') : ''}</div></div></section>`);

  // Tecnología: franja beige con foto
  if (c.tech?.items?.length || b.gallery.length) out.push(`<section class="ng-split"><div class="ng-split-copy"><p class="ng-kick ng-kick--c">Pensado para tu comodidad</p><h2>${esc(c.tech?.title || 'Tecnología y buen trato')}</h2>${c.tech?.text ? `<p>${esc(c.tech.text)}</p>` : ''}${(c.tech?.items || []).length ? `<ul>${c.tech.items.slice(0, 4).map(t => `<li><b>${esc(t.b)}</b> ${esc(t.t)}</li>`).join('')}</ul>` : ''}${a('ng-btn', b.bookHref, 'Conoce el consultorio')}</div>${photo(c.tech?.photo || b.gallery[0]?.img, c.tech?.photoAlt || '', 'ng-split-img')}</section>`);

  // Tratamientos en carrusel
  if (services.length) out.push(`<section class="ng-trat" id="ng-trat"${b.mk('services')}><div class="ng-trat-head"><div><p class="ng-kick ng-kick--c">Tratamientos</p><h2>${esc(c.services.title || 'Dedicados a tu sonrisa')}</h2></div>${a('ng-btn', b.bookHref, esc(b.ctaTop))}</div>
    <ul class="ng-car" tabindex="0" aria-label="Tratamientos, desliza para ver más">${services.map(s => `<li>${photo(s.img, s.imgAlt || s.name, 'ng-car-img')}<h3>${esc(s.name)}</h3>${s.desc ? `<p>${esc(s.desc)}</p>` : ''}${s.price ? `<p class="ng-price">${esc(s.price)}</p>` : ''}${a('ng-more', b.serviceHref(s), 'Agendar')}</li>`).join('')}</ul></section>`);

  // La doctora sobre madera
  if (lead) out.push(`<section class="ng-doc" id="ng-equipo"${b.mk('team')}><div class="ng-copy"><p class="ng-kick ng-kick--c">Conoce a tu dentista</p><h2>${esc(lead.name)}</h2>${lead.role ? `<p class="ng-role">${esc(lead.role)}${lead.cedula ? ` · Cédula ${esc(lead.cedula)}` : ''}</p>` : ''}${c.team?.text ? `<p>${esc(c.team.text)}</p>` : ''}
      ${b.members.length > 1 ? `<p class="ng-others">También te atienden: ${b.members.slice(1).map(m => `${esc(m.name)}${m.role ? ` (${esc(m.role)})` : ''}`).join(', ')}.</p>` : ''}${a('ng-btn', b.bookHref, esc(b.ctaTop))}</div>
    <div class="ng-doc-art"><i class="ng-wood" aria-hidden="true"></i>${photo(lead.photo, lead.name, 'ng-doc-img')}</div></section>`);

  if (reviews.length) out.push(`<section class="ng-revs" id="ng-opiniones"${b.mk('reviews')}><p class="ng-kick ng-kick--c">Lo que dicen nuestros pacientes</p><h2>Nuestros pacientes, nuestra pasión</h2>${b.rating ? a('ng-btn', b.mapsHref || b.bookHref, `${esc(b.rating.value)} en ${esc(b.rating.source || 'Google')} · ${esc(b.rating.count)} reseñas`) : ''}
    <div>${reviews.map(r => `<figure><span aria-label="${esc(r.stars || 5)} de 5">${ICON.star.repeat(r.stars || 5)}</span><blockquote>${esc(r.text)}</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join('')}</div>${c.reviews?.note ? `<p class="ng-note">${esc(c.reviews.note)}</p>` : ''}</section>`);

  if (b.faq.length) out.push(`<section class="ng-faq"><div class="ng-faq-l">${photo(b.gallery[3]?.img || hero.photo, '', 'ng-faq-img')}</div><div><p class="ng-kick ng-kick--c">Resolvemos tus dudas</p><h2>Preguntas frecuentes</h2>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  out.push(`<section class="ng-help" id="ng-contacto"${b.mk('visit')}><p class="ng-kick ng-kick--c">¿Dudas?</p><h2>Estamos para ayudarte</h2>
    <ul><li><b>Llama o escribe</b>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${b.waNum ? a('', b.waHref, 'WhatsApp') : ''}</li>${contact.address ? `<li><b>Dirección</b>${a('', b.mapsHref, esc(contact.address))}</li>` : ''}${contact.email ? `<li><b>Correo</b>${a('', `mailto:${contact.email}`, esc(contact.email))}</li>` : ''}${b.rows.length ? `<li><b>Horario</b>${b.rows.slice(0, 3).map(r => `<span>${esc(r.dt)}: ${esc(r.dd)}</span>`).join('')}</li>` : ''}</ul></section>
  <footer class="ng-foot"><span class="ng-mono"><i>${esc(initials)}</i><small>${esc(b.brand.name || name)}</small></span><div>${b.legal()}</div></footer>`);
  out.push(`<div class="ng-sticky">${a('ng-btn', b.bookHref, esc(b.ctaTop))}${b.telNum ? a('ng-btn ng-btn--line', `tel:${b.telNum}`, 'Llamar') : ''}</div>`, b.kb({}), '</div>');
  return out.join('\n');
}

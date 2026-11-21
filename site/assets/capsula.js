// Diseño «Cápsula» para clínicas (theme.style = 'capsula'), basado en Tend:
// barra superior lima, menú en una cápsula flotante, hero con dos fotos de pacientes en
// cápsula a los lados del título en serif verde salvia, «la diferencia» con palomitas en
// pastillas, banda verde oscuro de aseguradoras con formulario y el equipo entre cápsulas.
import { base, esc, list, url, ICON } from './base.js';

export const CAPSULA_FONTS = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Figtree:wght@400;500;600;700&display=swap';

export function renderCapsula(c = {}, opts = {}) {
  const b = base(c, opts, '#1E6FD9'), { a, photo, hero, contact, name } = b;
  const trust = b.trust.slice(0, 4), services = b.services.slice(0, 8), lead = b.members[0];
  // Dos fotos de personas para las cápsulas del hero (las que haya: hero, equipo, tratamientos)
  const people = [hero.photo, ...b.members.map(m => m.photo), ...services.map(s => s.img)].filter(u => url(u));
  const left = people[0], right = people.find((p, i) => i > 0 && p !== left) || left;
  const checks = [...trust.map(t => t.b), ...list(c.today?.bullets).map(x => x.t || x), ...b.pay.slice(0, 2)].filter(Boolean).slice(0, 8);
  const nav = [services.length && ['cp-trat', 'Tratamientos'], ['cp-dif', 'Por qué nosotros'], b.insurers.length && ['cp-seguro', 'Aseguradoras'], ['cp-llegar', 'Ubicación']].filter(Boolean);

  const out = [`<link rel="stylesheet" href="/assets/t-capsula.css">`,
    `<div class="cx cp${b.live ? '' : ' cp-still'}" style="--a:${b.accent};${opts.fontVars || ''}" data-name="${esc(name)}" data-wa="${esc(b.waNum)}">`];

  out.push(`<div class="cp-bar"><span>${esc(c.util?.note || 'Te atendemos sin juzgarte')}</span>${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}</div>
  <header class="cp-top"><div class="cp-pill">${url(b.brand.logo) ? `<img src="${url(b.brand.logo)}" alt="${esc(name)}">` : `<b>${esc(b.brand.name || name)}</b>`}<nav aria-label="Secciones">${nav.map(b.navLink).join('')}</nav></div>
    <div class="cp-pill cp-pill--act">${contact.address ? `<span class="cp-where">${ICON.pin}${esc(String(contact.address).split(',').slice(-2).join(',').trim())}</span>` : ''}${a('cp-btn', b.bookHref, esc(b.ctaTop), b.mk('cta'))}${b.telNum ? a('cp-round', `tel:${b.telNum}`, ICON.phone, ' aria-label="Llamar"') : ''}</div></header>`);

  out.push(`<section class="cp-hero"${b.mk('hero')}><div class="cp-cap cp-cap--l">${photo(left, hero.photoAlt || name, 'cp-cap-img')}</div>
    <div class="cp-hero-copy"><h1>${esc(hero.title)}</h1>${hero.sub ? `<p>${esc(hero.sub)}</p>` : ''}
      <div class="cp-ctas">${a('cp-btn cp-btn--lg', b.bookHref, esc(hero.cta || b.ctaTop))}${b.telNum ? a('cp-btn cp-btn--lg cp-btn--line', `tel:${b.telNum}`, esc(contact.phone)) : ''}</div>
      ${services.length ? `<p class="cp-also">${esc(c.services?.title || 'Tratamientos')} para <b>todo lo que necesitas</b></p>` : ''}</div>
    <div class="cp-cap cp-cap--r">${photo(right, '', 'cp-cap-img')}</div></section>`);

  // Tratamientos: pastillas que llevan a WhatsApp
  if (services.length) out.push(`<section class="cp-trat" id="cp-trat"${b.mk('services')}><ul>${services.map(s => `<li>${a('cp-chip', b.serviceHref(s), `${esc(s.name)}${s.price ? `<small>${esc(s.price)}</small>` : ''}`)}</li>`).join('')}</ul></section>`);

  // La diferencia: foto, texto, estrellas y palomitas en pastillas
  out.push(`<section class="cp-dif" id="cp-dif"${b.mk('trust')}>${photo(c.gallery?.images?.[0]?.img || b.visit.photo || hero.photo, c.gallery?.images?.[0]?.alt || '', 'cp-dif-img')}
    <div class="cp-dif-copy"><h2>${esc(c.today?.title || `La diferencia ${b.brand.name ? `de ${b.brand.name}` : ''}`)}</h2>${c.team?.text || c.today?.text ? `<p>${esc(c.team?.text || c.today?.text)}</p>` : ''}
      ${b.rating ? `<p class="cp-stars">${esc(b.rating.count)} reseñas de 5 estrellas <span aria-hidden="true">${ICON.star.repeat(5)}</span></p>` : ''}
      ${a('cp-btn', b.bookHref, esc(b.ctaTop))}
      ${checks.length ? `<ul class="cp-checks">${checks.map(t => `<li><i aria-hidden="true">${ICON.check}</i>${esc(t)}</li>`).join('')}</ul>` : ''}</div></section>`);

  // Ubicación con mapa
  out.push(`<section class="cp-loc" id="cp-llegar"${b.mk('visit')}><div class="cp-loc-copy"><h2>${esc(b.visit.title && !/^vis[ií]tanos$/i.test(b.visit.title) ? b.visit.title : 'Un consultorio cerca de ti')}</h2>${b.visit.zones ? `<p>${esc(b.visit.zones)}</p>` : ''}
      <ul class="cp-rows">${contact.address ? `<li><span>${esc(contact.address)}</span>${b.mapsHref ? a('cp-tag', b.mapsHref, 'Cómo llegar') : ''}</li>` : ''}${b.rows.slice(0, 4).map(r => `<li><span>${esc(r.dt)}</span><b class="cp-tag cp-tag--soft">${esc(r.dd)}</b></li>`).join('')}</ul></div>
    ${b.live && contact.address ? `<div class="cp-map"><iframe title="Mapa de ${esc(name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&amp;output=embed"></iframe></div>` : photo(b.visit.photo, 'Fachada', 'cp-map')}</section>`);

  // Banda verde: aseguradoras y formulario
  if (b.insurers.length || b.pay.length) out.push(`<section class="cp-ins" id="cp-seguro"><h2>${esc(c.payments?.title || 'Aseguradoras y formas de pago')}</h2>${c.payments?.text ? `<p class="cp-ins-lede">${esc(c.payments.text)}</p>` : ''}
    <div class="cp-ins-in"><div><h3>${b.insurers.length ? 'Trabajamos con' : 'Formas de pago'}</h3><ul>${(b.insurers.length ? [...b.insurers, ...b.pay] : b.pay).map(x => `<li>${ICON.check}${esc(x)}</li>`).join('')}</ul></div>
      ${b.waNum ? `<form class="cp-form" data-t-form data-intro="Hola, quiero saber si mi seguro aplica en"${b.live ? '' : ' inert'}><h3>¿Te cubre tu seguro?</h3><p>Déjanos tus datos y te respondemos por WhatsApp.</p>
        <label><span>Tu nombre</span><input name="n" data-l="Nombre" autocomplete="name" required></label>
        ${b.insurers.length ? `<label><span>Tu aseguradora</span><select name="s" data-l="Aseguradora"><option value="">Elige una opción</option>${b.insurers.map(x => `<option>${esc(x)}</option>`).join('')}<option>Otra</option></select></label>` : ''}
        <button class="cp-btn" type="submit">Revisar mi seguro</button></form>` : ''}</div></section>`);

  // Equipo entre cápsulas
  if (lead || trust.length) out.push(`<section class="cp-team"${b.mk('team')}>${(b.members[2] || lead) ? `<div class="cp-cap cp-cap--team">${photo((b.members[2] || lead).photo, (b.members[2] || lead).name, 'cp-cap-img')}</div>` : ''}
    <div class="cp-team-copy"><h2>${esc(c.team?.title || 'Un equipo que te cuida')}</h2>${lead ? `<p>${esc(lead.name)}${lead.role ? `, ${esc(lead.role)}` : ''}${lead.cedula ? ` · Cédula ${esc(lead.cedula)}` : ''}</p>` : ''}
      ${trust.length ? `<ul class="cp-cards">${trust.map(t => `<li><i aria-hidden="true">${ICON.check}</i><b>${esc(t.b)}</b><span>${esc(t.t)}</span></li>`).join('')}</ul>` : ''}</div>
    ${people.filter(p => p !== left && p !== right)[0] ? `<div class="cp-cap cp-cap--team2">${photo(people.filter(p => p !== left && p !== right).slice(-1)[0], '', 'cp-cap-img')}</div>` : ''}</section>`);

  // Preguntas
  if (b.faq.length) out.push(`<section class="cp-faq"><h2>Preguntas frecuentes</h2><div>${b.faq.slice(0, 6).map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);

  // Cierre y pie verde
  out.push(`<footer class="cp-foot"><div class="cp-end"><h2>${esc(c.closing || 'Ir al dentista no tiene por qué doler. Puede hasta gustarte.')}</h2>${a('cp-btn cp-btn--lg', b.bookHref, esc(b.ctaTop))}</div>
    <div class="cp-foot-in"><b>${esc(name)}</b>${contact.address ? `<span>${esc(contact.address)}</span>` : ''}${b.telNum ? a('', `tel:${b.telNum}`, esc(contact.phone)) : ''}${contact.email ? a('', `mailto:${contact.email}`, esc(contact.email)) : ''}</div><div class="cp-legal">${b.legal()}</div></footer>`);
  out.push(`<div class="cp-sticky">${a('cp-btn', b.bookHref, esc(b.ctaTop))}${b.waNum ? a('cp-btn cp-btn--line', b.waHref, `${ICON.wa('cp-wa')}WhatsApp`) : ''}</div>`);
  out.push(b.kb({}), '</div>');
  return out.join('\n');
}

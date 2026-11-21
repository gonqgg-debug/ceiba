// Interacción de la plantilla «clínica» v2 (.cx). Funciona en la vista previa
// completa y dentro del comparador de la propuesta.
(() => {
  if (window.__cx) return; window.__cx = true;

  // Contactos para el reporte del cliente: solo en su propio dominio (no en vistas previas de Ceiba)
  if (!/(^|\.)ceibalabs\.io$|vercel\.app$|^localhost$/.test(location.hostname)) {
    const track = kind => { try { navigator.sendBeacon('/api/site', JSON.stringify({ host: location.hostname, kind, page: location.pathname })); } catch {} };
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]'); if (!a) return;
      const h = a.getAttribute('href');
      if (/wa\.me|whatsapp\.com/.test(h)) track('whatsapp');
      else if (/^tel:/.test(h)) track('llamada');
      else if (/^mailto:/.test(h)) track('correo');
      else if (/google\.[^/]+\/maps|maps\.app/.test(h)) track('mapa');
      else if (/calendly|doctoralia|agendapro|simplybook|setmore|booksy|fresha|cal\.com/.test(h)) track('agendar');
    }, true);
    document.addEventListener('submit', e => { if (e.target.closest('[data-cx-form]')) track('formulario'); }, true);
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const WA = '<svg class="cx-wa" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';

  // Carrusel de servicios
  const sync = t => {
    const nav = t.closest('.cx-services')?.querySelector('.cx-car-nav'); if (!nav) return;
    nav.querySelector('[data-cx-car="prev"]').disabled = t.scrollLeft < 4;
    nav.querySelector('[data-cx-car="next"]').disabled = t.scrollLeft + t.clientWidth > t.scrollWidth - 4;
  };
  const bindCars = () => document.querySelectorAll('.cx-car:not([data-bound])').forEach(t => {
    t.dataset.bound = 1; t.addEventListener('scroll', () => sync(t), { passive: true }); new ResizeObserver(() => sync(t)).observe(t);
  });

  document.addEventListener('click', e => {
    const car = e.target.closest('[data-cx-car]');
    if (car) {
      const t = car.closest('.cx-services').querySelector('.cx-car'), card = t.querySelector('.cx-card');
      const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(t).columnGap) || 0);
      t.scrollBy({ left: car.dataset.cxCar === 'next' ? step : -step, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    // ¿Qué necesitas?
    const pick = e.target.closest('[data-cx-pick]');
    if (pick) {
      const box = pick.closest('.cx-finder');
      box.querySelectorAll('[data-cx-pick]').forEach(b => b.setAttribute('aria-checked', b === pick));
      box.querySelectorAll('[data-cx-res]').forEach(r => r.hidden = r.dataset.cxRes !== pick.dataset.cxPick);
      return;
    }
    // Chat
    const tog = e.target.closest('[data-cx-chat]');
    if (tog) {
      const fab = tog.closest('.cx-fab'), open = !fab.classList.contains('open');
      fab.classList.toggle('open', open); fab.querySelector('.cx-chat-btn')?.setAttribute('aria-expanded', open);
      const tz = fab.querySelector('.cx-teaser'); if (tz) tz.hidden = true;
      if (open) fab.querySelector('.cx-chat-sug button:not([hidden])')?.focus({ preventScroll: true });
      return;
    }
    const q = e.target.closest('[data-cx-q]');
    if (q) {
      const fab = q.closest('.cx-fab'), log = fab.querySelector('.cx-chat-log'), root = q.closest('.cx');
      q.hidden = true;
      log.insertAdjacentHTML('beforeend', `<p class="cx-msg me">${esc(q.textContent)}</p>`);
      const wa = root.dataset.wa, live = !!root.closest('.vista');
      const link = wa && live ? `https://wa.me/${wa}?text=${encodeURIComponent(q.textContent)}` : '';
      const act = q.dataset.act === 'book' ? '<span>Agenda tu cita</span>' : link ? `<a href="${link}" target="_blank" rel="noopener">${WA}Seguir por WhatsApp</a>` : `<span>${WA}Seguir por WhatsApp</span>`;
      const reply = () => { log.querySelector('.cx-typing')?.remove(); log.insertAdjacentHTML('beforeend', `<p class="cx-msg">${esc(q.dataset.a)}${act}</p>`); log.scrollTop = log.scrollHeight; };
      if (reduce) return reply();
      log.insertAdjacentHTML('beforeend', '<span class="cx-typing" aria-hidden="true"><i></i><i></i><i></i></span>');
      log.scrollTop = log.scrollHeight; setTimeout(reply, 650);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.cx-fab.open').forEach(f => f.classList.remove('open')); });

  // Formulario: arma el mensaje y abre WhatsApp
  document.addEventListener('submit', e => {
    const f = e.target.closest('[data-cx-form]'); if (!f) return;
    e.preventDefault();
    const root = f.closest('.cx'), wa = root.dataset.wa;
    const v = n => (f.elements[n]?.value || '').trim();
    if (!v('n')) { f.elements.n.focus(); return; }
    const msg = [`Hola, quiero agendar una cita en ${root.dataset.name}.`, `Nombre: ${v('n')}`, v('t') && `Teléfono: ${v('t')}`, v('s') && `Servicio: ${v('s')}`, v('d') && `Día que prefiero: ${v('d')}`, v('m') && `Comentarios: ${v('m')}`].filter(Boolean).join('\n');
    if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });


  // ---------- Asistente: responde con la información de la clínica ----------
  const kbOf = root => { try { return root._kb ||= JSON.parse(root.querySelector('.cx-kb')?.textContent || 'null'); } catch { return null; } };
  const norm = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const STOP = new Set('para como cual tienen tiene hacen puedo quiero sobre donde esta estan cuando tengo ustedes porque pueden hola buenas tardes noches dias gracias favor saber necesito tienes hacer seria ser las los una uno del con que'.split(' '));
  const words = t => norm(t).split(/[^a-z0-9ñ]+/).filter(w => w.length > 3 && !STOP.has(w));
  const overlap = (a, b) => { const B = words(b); return words(a).filter(w => B.some(x => x.startsWith(w.slice(0, 5)) || w.startsWith(x.slice(0, 5)))).length; };
  const waLink = (kb, text) => (kb.wa && kb.book !== '' ? `https://wa.me/${kb.wa}?text=${encodeURIComponent(text)}` : '');
  const toWA = (kb, text, label = 'Seguir por WhatsApp') => { const l = waLink(kb, text); return l ? `<a href="${l}" target="_blank" rel="noopener">${WA}${label}</a>` : `<span>${WA}${label}</span>`; };

  function answer(q, kb) {
    const n = norm(q);
    const svc = kb.services.map(s => [s, overlap(s[0], q)]).sort((a, b) => b[1] - a[1])[0];
    const svcHit = svc && svc[1] > 0 ? svc[0] : null;
    const faqHit = kb.faq.map(f => [f, overlap(f[0] + ' ' + f[1], q)]).sort((a, b) => b[1] - a[1])[0];
    if (/^\s*(hola|buen[oa]s?|que tal|hey)\b[\s!.,]*$/.test(n)) return { html: `Hola 👋 Soy el asistente de ${esc(kb.name)}. Pregúntame por precios, horarios, ubicación o aparta tu cita aquí.` };
    if (/(cita|agend|apart|reserv|turno|disponib|consulta)/.test(n)) return book(kb, svcHit ? svcHit[0] : '');
    if (/(horario|abren|abierto|cierran|sabado|domingo|a que hora|hora)/.test(n) && kb.hours.length) return { html: `Nuestro horario:<br>${kb.hours.filter(h => !/estaciona/i.test(h[0])).map(h => `<b>${esc(h[0])}:</b> ${esc(h[1])}`).join('<br>')}` };
    if (/(donde|direcc|ubica|llegar|estaciona|parking|mapa)/.test(n) && kb.address) {
      const park = kb.hours.find(h => /estaciona/i.test(h[0]));
      return { html: `Estamos en ${esc(kb.address)}.${park ? ` Estacionamiento: ${esc(park[1])}.` : ''}${kb.maps ? `<a href="${kb.maps}" target="_blank" rel="noopener">Abrir en Google Maps</a>` : ''}` };
    }
    if (/(pago|pagar|tarjeta|msi|meses|efectivo|seguro|asegur|transfer|credito|debito)/.test(n)) {
      if (faqHit && faqHit[1] > 0 && /(pago|msi|meses|tarjeta|seguro)/.test(norm(faqHit[0][0]))) return { html: esc(faqHit[0][1]) };
      if (kb.pay.length) return { html: `Aceptamos: ${kb.pay.map(esc).join(', ')}.` };
    }
    if (svcHit) {
      const [name, price, desc] = svcHit;
      return { html: `<b>${esc(name)}</b>${price ? ` · ${esc(price)}` : ''}. ${esc(desc)} ¿Te aparto una cita?`, after: book(kb, name, true) };
    }
    if (/(precio|cuesta|costo|cuanto|cobran|tarifa)/.test(n)) {
      const priced = kb.services.filter(s => s[1]).slice(0, 4);
      if (priced.length) return { html: `Algunos precios de referencia:<br>${priced.map(s => `${esc(s[0])}: <b>${esc(s[1])}</b>`).join('<br>')}<br>El tuyo te lo confirmamos en tu valoración.` };
    }
    if (/(urgen|dolor|duele|roto|rota|sangr|hinch|emergen)/.test(n)) {
      const u = kb.today.find(t => /urgen/i.test(t)) || (faqHit && faqHit[1] > 0 ? faqHit[0][1] : '');
      if (u) return { html: `${esc(u)}. Escríbenos y te hacemos un espacio.${toWA(kb, 'Hola, tengo una urgencia dental')}` };
    }
    if (faqHit && faqHit[1] > 0) return { html: esc(faqHit[0][1]) };
    if (kb.more.some(m => overlap(m, q))) return { html: `Sí, también atendemos ${esc(kb.more.find(m => overlap(m, q)))}. ¿Quieres que te aparte una valoración?`, after: book(kb, '', true) };
    return { html: `Esa te la responde mejor nuestro equipo. Te paso con recepción por WhatsApp.${toWA(kb, q, 'Hablar con recepción')}` };
  }
  function book(kb, service, short) {
    if (kb.slots.length) return { html: `${short ? '' : 'Claro. '}Estos son los próximos horarios${service ? ` para <b>${esc(service)}</b>` : ''}:<div class="cx-slots-chat">${kb.slots.map(s => `<button type="button" data-cx-slot="${esc(s)}" data-svc="${esc(service)}">${esc(s)}</button>`).join('')}</div>` };
    return { html: `Te paso con recepción para apartar tu cita${service ? ` de ${esc(service)}` : ''}.${toWA(kb, `Hola, quiero agendar${service ? ` ${service}` : ' una cita'}`, 'Agendar por WhatsApp')}` };
  }
  const say = (log, html, me) => { log.insertAdjacentHTML('beforeend', `<p class="cx-msg${me ? ' me' : ''}">${html}</p>`); log.scrollTop = log.scrollHeight; };
  const typing = (log, ms) => new Promise(r => {
    if (reduce) return r();
    log.insertAdjacentHTML('beforeend', '<span class="cx-typing" aria-hidden="true"><i></i><i></i><i></i></span>'); log.scrollTop = log.scrollHeight;
    setTimeout(() => { log.querySelector('.cx-typing')?.remove(); r(); }, ms);
  });
  async function reply(log, kb, q) {
    say(log, esc(q), true);
    const a = answer(q, kb);
    await typing(log, 700); say(log, a.html);
    if (a.after) { await typing(log, 500); say(log, a.after.html); }
  }
  async function confirmSlot(btn) {
    const log = btn.closest('[data-cx-log], .cx-chat-log'), kb = kbOf(btn.closest('.cx'));
    btn.parentElement.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('on', b === btn); });
    const svc = btn.dataset.svc || 'tu cita', slot = btn.dataset.cxSlot;
    say(log, esc(slot), true);
    await typing(log, 700);
    say(log, `<span class="cx-ok"><b>${ICO_CHECK}Cita apartada</b>${esc(svc === 'tu cita' ? 'Valoración' : svc)} · ${esc(slot)}<small>Te mandamos la confirmación por WhatsApp.</small></span>${toWA(kb, `Hola, aparté ${svc} para ${slot}. ¿Me confirman?`, 'Confirmar por WhatsApp')}`);
  }
  const ICO_CHECK = '<svg class="cx-ico-s" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19.5 7"/></svg>';

  // Demostración que se reproduce sola al llegar a la sección
  const sleep = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  async function demo(log) {
    const root = log.closest('.cx'), kb = kbOf(root); if (!kb || log.dataset.played) return;
    log.dataset.played = 1;
    const stop = () => log.dataset.stop;
    say(log, `Hola 👋 Soy el asistente de ${esc(kb.name)}. ¿En qué te ayudo?`);
    const f = kb.faq[0];
    if (f) { await sleep(900); if (stop()) return; say(log, esc(f[0]), true); await typing(log, 900); if (stop()) return; say(log, esc(f[1])); }
    await sleep(1100); if (stop()) return;
    const q = kb.slots.length ? '¿Tienen cita mañana?' : (kb.faq[1]?.[0] || '¿Dónde están?');
    await reply(log, kb, q);
    if (kb.slots.length) { await sleep(1300); if (stop()) return; const b = log.querySelector('[data-cx-slot]:not(:disabled)'); if (b) await confirmSlot(b); }
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); demo(e.target); } }), { threshold: .35 });
  const bindDemos = () => document.querySelectorAll('[data-cx-log]:not([data-io])').forEach(l => { l.dataset.io = 1; io.observe(l); });

  document.addEventListener('submit', async e => {
    const f = e.target.closest('[data-cx-ask]'); if (!f) return;
    e.preventDefault();
    const q = f.elements.q.value.trim(); if (!q) return;
    const root = f.closest('.cx'), kb = kbOf(root); if (!kb) return;
    const log = f.closest('.cx-phone')?.querySelector('[data-cx-log]') || f.closest('.cx-chat').querySelector('.cx-chat-log');
    log.dataset.stop = 1; f.elements.q.value = '';
    await reply(log, kb, q);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cx-slot]'); if (b && !b.disabled) confirmSlot(b);
    const t = e.target.closest('.cx-teaser');
    if (t) { t.hidden = true; t.closest('.cx-fab').querySelector('.cx-chat-btn')?.click(); }
  });
  // Saludo del chat flotante en la vista previa
  setTimeout(() => document.querySelectorAll('.vista .cx-teaser').forEach(t => { if (!t.closest('.cx-fab').classList.contains('open')) { t.hidden = false; setTimeout(() => { t.hidden = true; }, 7000); } }), 3500);

  // El momento de la página: las fotos de la galería se revelan una vez al llegar a ellas.
  // Sin script o con movimiento reducido se ven normales; solo se «velan» si aún no están a la vista.
  const mio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    mio.unobserve(e.target);
    requestAnimationFrame(() => { e.target.classList.add('is-in'); e.target.classList.remove('is-pre'); });
  }), { threshold: .3 });
  const bindMoments = () => document.querySelectorAll('[data-moment="develop"]:not([data-io])').forEach(m => {
    m.dataset.io = 1;
    if (reduce || m.getBoundingClientRect().top < innerHeight) return;
    m.classList.add('is-pre'); mio.observe(m);
  });

  bindCars(); bindDemos(); bindMoments();
  new MutationObserver(() => { bindCars(); bindDemos(); bindMoments(); }).observe(document.documentElement, { childList: true, subtree: true });
})();

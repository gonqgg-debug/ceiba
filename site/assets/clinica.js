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
    if (!(f.elements.n?.value || '').trim()) { f.elements.n?.focus(); return; }
    // Cada campo trae su etiqueta (data-l): el mensaje sirve para cualquier rubro
    const lines = [...f.querySelectorAll('[data-l]')].filter(el => el.value.trim()).map(el => `${el.dataset.l}: ${el.value.trim()}`);
    const msg = [`${f.dataset.intro || 'Hola, quiero agendar en'} ${root.dataset.name}.`, ...lines].join('\n');
    if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });


  // Pestañas (menú del restaurante) y filtro (propiedades). Sin script se ve todo.
  const bindTabs = () => document.querySelectorAll('.cx-menu:not([data-tabs])').forEach(sec => {
    sec.dataset.tabs = 1;
    if (!sec.querySelector('[data-cx-tab]')) return;
    sec.classList.add('cx-menu--tabs');
    sec.querySelector('[data-cx-panel="0"]')?.classList.add('is-on');
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-cx-tab]');
    if (t) {
      const sec = t.closest('.cx-menu');
      sec.querySelectorAll('[data-cx-tab]').forEach(b => b.setAttribute('aria-selected', b === t));
      sec.querySelectorAll('[data-cx-panel]').forEach(p => p.classList.toggle('is-on', p.dataset.cxPanel === t.dataset.cxTab));
    }
    const fl = e.target.closest('[data-cx-filter]');
    if (fl) {
      const sec = fl.closest('.cx-listings'), op = fl.dataset.cxFilter;
      sec.querySelectorAll('[data-cx-filter]').forEach(b => b.setAttribute('aria-checked', b === fl));
      sec.querySelectorAll('.cx-prop').forEach(c => { c.hidden = !!op && c.dataset.op !== op; });
    }
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

  // ---------- Variante «Expresiva» ----------
  // Un solo manejador de scroll (con rAF) para la frase que se enciende y la galería en capítulos.
  const scrubs = new Set();
  let ticking = false;
  const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; scrubs.forEach(f => f()); }); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  const clamp = v => Math.max(0, Math.min(1, v));
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const b = e.target, { to, dec, pre, post } = b._cx, t0 = performance.now(), dur = 1300;
    const step = now => { const t = clamp((now - t0) / dur), v = to * (1 - Math.pow(1 - t, 3)); b.textContent = pre + v.toFixed(dec) + post; if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  // Se observa el contenedor del título: el título enmascarado no tiene área visible que observar
  const rio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; rio.unobserve(e.target); const h = e.target._cxH; requestAnimationFrame(() => { h.classList.add('is-in'); h.classList.remove('is-pre'); }); }), { threshold: .2 });
  const bindExpresiva = () => {
    // Frase: cada palabra se enciende al cruzar la mitad de la pantalla (y se apaga al volver)
    document.querySelectorAll('[data-cx-words]:not([data-io])').forEach(p => {
      p.dataset.io = 1; if (reduce) return;
      const sec = p.closest('.cx-statement'), ws = [...p.querySelectorAll('.cx-w')];
      sec.classList.add('is-live');
      let n = -1;
      const f = () => {
        const r = p.getBoundingClientRect(), vh = innerHeight, start = vh * .85, end = vh * .4;
        const k = Math.round(clamp((start - r.top) / Math.max(1, start - end + r.height)) * ws.length);
        if (k !== n) { n = k; ws.forEach((w, i) => w.classList.toggle('is-on', i < k)); }
      };
      scrubs.add(f); f();
    });
    // Galería en capítulos: la foto que toca según cuánto se ha recorrido la sección fija
    document.querySelectorAll('[data-cx-chapters]:not([data-io])').forEach(sec => {
      sec.dataset.io = 1; if (reduce) return;
      const imgs = [...sec.querySelectorAll('.cx-ch-img')], count = sec.querySelector('.cx-ch-count b');
      let cur = 0;
      const f = () => {
        const r = sec.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
        const k = Math.min(imgs.length - 1, Math.floor(clamp(-r.top / span) * imgs.length));
        if (k !== cur) { imgs[cur].classList.remove('is-on'); imgs[k].classList.add('is-on'); cur = k; if (count) count.textContent = k + 1; }
      };
      scrubs.add(f); f();
    });
    // Cifras que cuentan una vez al aparecer (solo si aún no están a la vista; sin script se ven completas)
    document.querySelectorAll('[data-cx-count]:not([data-io])').forEach(b => {
      b.dataset.io = 1;
      const m = b.textContent.trim().match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
      if (reduce || !m || b.getBoundingClientRect().top < innerHeight) return;
      const num = m[2].replace(',', '.');
      b._cx = { pre: m[1], post: m[3], to: parseFloat(num), dec: (num.split('.')[1] || '').length };
      b.textContent = m[1] + (0).toFixed(b._cx.dec) + m[3]; cio.observe(b);
    });
    // Títulos de sección: suben desde su máscara la primera vez que aparecen
    document.querySelectorAll('.cx--expresiva .cx-sec h2:not([data-io]), .cx--expresiva .cx-ch-head h2:not([data-io])').forEach(h => {
      h.dataset.io = 1; if (reduce || h.getBoundingClientRect().top < innerHeight) return;
      h.classList.add('cx-rise', 'is-pre'); h.parentElement._cxH = h; rio.observe(h.parentElement);
    });
  };

  // Cercana: las tarjetas de servicios aparecen con un pequeño salto, una tras otra (una vez)
  const pio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; pio.unobserve(e.target); requestAnimationFrame(() => { e.target.classList.add('is-in'); e.target.classList.remove('is-pre'); }); }), { threshold: .2 });
  const bindPop = () => document.querySelectorAll('[data-cx-pop]:not([data-io])').forEach(l => {
    l.dataset.io = 1; if (reduce || l.getBoundingClientRect().top < innerHeight) return;
    l.classList.add('is-pre'); pio.observe(l);
  });

  // ---------- Diseño «Fonda» (restaurantes) ----------
  const fio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; fio.unobserve(e.target); e.target.classList.add('in'); e.target.querySelectorAll('.mk').forEach(m => m.classList.add('in')); }), { threshold: .35 });
  const FD = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'], FM = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const bindFonda = () => document.querySelectorAll('.fx:not([data-fx])').forEach(root => {
    root.dataset.fx = 1; root.classList.add('fx-js');
    root.querySelectorAll('.rv, .mk').forEach(el => fio.observe(el));
    let kb = {}; try { kb = JSON.parse(root.querySelector('.fx-kb')?.textContent || '{}'); } catch {}
    const q = s => root.querySelector(s);
    const toggle = o => { root.classList.toggle('nav-open', o); const b = q('.fx-burger'); b?.setAttribute('aria-expanded', o); b?.setAttribute('aria-label', o ? 'Cerrar menú' : 'Abrir menú'); };
    q('.fx-burger')?.addEventListener('click', () => toggle(!root.classList.contains('nav-open')));
    q('.fx-nav')?.addEventListener('click', e => { if (e.target.closest('a')) toggle(false); });
    root.querySelectorAll('[data-fx-carta]').forEach(a => a.addEventListener('click', () => q('.fx-carta')?.classList.add('show')));
    // boleto: próximos días abiertos, horarios de la casa y personas
    const days = []; for (let i = 0; days.length < 6 && i < 12; i++) { const d = new Date(Date.now() + i * 864e5); if (!(kb.closed || []).includes(d.getDay())) days.push(d); }
    let day = null, hour = null, ppl = 2;
    const sum = () => { const s = q('[data-fx-sum]'); if (s) s.textContent = day && hour ? `${FD[day.getDay()]} ${day.getDate()} ${FM[day.getMonth()]} · ${hour} · ${ppl} ${ppl === 1 ? 'persona' : 'personas'}` : 'Elige día y hora'; };
    const pick = (box, b) => box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const dBox = q('[data-fx-days]'), hBox = q('[data-fx-hours]');
    if (!dBox) return;
    dBox.innerHTML = days.map((d, i) => `<button type="button" aria-pressed="false" data-d="${i}">${d.toDateString() === new Date().toDateString() ? 'Hoy' : FD[d.getDay()]}<small>${d.getDate()} ${FM[d.getMonth()]}</small></button>`).join('');
    dBox.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; day = days[b.dataset.d]; hour = null; pick(dBox, b);
      const today = day.toDateString() === new Date().toDateString(), now = new Date().getHours() * 60 + new Date().getMinutes() + 45;
      const hs = (kb.slots || []).filter(h => !today || +h.split(':')[0] * 60 + +h.split(':')[1] > now);
      hBox.innerHTML = hs.length ? hs.map(h => `<button type="button" aria-pressed="false">${h}</button>`).join('') : '<span>Hoy ya no hay horarios; elige otro día</span>'; sum(); });
    hBox.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; hour = b.textContent; pick(hBox, b); sum(); });
    root.querySelectorAll('[data-fx-ppl]').forEach(b => b.addEventListener('click', () => { ppl = Math.min(20, Math.max(1, ppl + Number(b.dataset.fxPpl))); q('[data-fx-n]').textContent = ppl; sum(); }));
    q('[data-fx-go]')?.addEventListener('click', () => {
      if (!day || !hour) { q('[data-fx-sum]').textContent = 'Elige día y hora para reservar'; return; }
      const who = q('[data-fx-who]')?.value.trim();
      const msg = `Hola, quiero reservar en ${kb.name || root.dataset.name}${who ? ` a nombre de ${who}` : ''}:\n• ${FD[day.getDay()]} ${day.getDate()} de ${FM[day.getMonth()]}\n• ${hour}\n• ${ppl} ${ppl === 1 ? 'persona' : 'personas'}`;
      if (kb.wa) window.open(`https://wa.me/${kb.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  });


  // Diseño «Estudio» (.es): reserva del hero, foto de la carta, pasos de la visita y meses sin intereses
  const bindEstudio = () => document.querySelectorAll('.es:not([data-es])').forEach(root => {
    root.dataset.es = 1;
    let kb = {}; try { kb = JSON.parse(root.querySelector('.es-kb')?.textContent || '{}'); } catch {}
    const book = root.querySelector('[data-es-book]');
    book?.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(book), svc = f.get('svc'), slot = f.get('slot');
      const msg = `Hola, quiero agendar una cita en ${kb.name || root.dataset.name}.\n• ${svc}${slot ? `\n• ${slot}` : '\n• ¿Qué días tienen disponibles?'}`;
      if (kb.wa) window.open(`https://wa.me/${kb.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
    // Carta: la foto del tratamiento que tienes enfrente
    const stage = root.querySelector('.es-menu-stage');
    if (stage) root.querySelectorAll('.es-menu-list li').forEach(li => {
      const show = () => { const im = stage.querySelector(`[data-i="${li.dataset.i}"]`); if (!im) return; stage.querySelectorAll('.on').forEach(x => x.classList.remove('on')); im.classList.add('on'); };
      li.addEventListener('pointerenter', show); li.addEventListener('focusin', show);
    });
    // Visita: cada paso cambia la foto
    const steps = root.querySelector('[data-es-steps]');
    steps?.addEventListener('click', e => {
      const b = e.target.closest('.es-steps button'); if (!b) return;
      steps.querySelectorAll('.es-steps button').forEach(x => x.setAttribute('aria-pressed', x === b));
      steps.querySelectorAll('.es-visit-img').forEach(x => x.classList.toggle('on', x.dataset.i === b.dataset.i));
      const n = steps.querySelector('.es-visit-count b'); if (n) n.textContent = +b.dataset.i + 1;
    });
    // Calculadora de meses sin intereses
    const calc = root.querySelector('[data-es-calc]');
    if (calc) {
      const sel = calc.querySelector('[data-es-svc]');
      const run = () => {
        const m = +(calc.querySelector('.es-seg [aria-pressed="true"]')?.dataset.m || 1), opt = sel.selectedOptions[0];
        calc.querySelector('[data-es-mo]').textContent = '$' + Math.ceil(+sel.value / m).toLocaleString('es-MX');
        calc.querySelector('[data-es-n]').textContent = m;
        calc.querySelector('[data-es-from]').textContent = opt?.hasAttribute('data-from') ? 'Desde' : '';
      };
      sel.addEventListener('change', run);
      calc.querySelector('.es-seg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; calc.querySelectorAll('.es-seg button').forEach(x => x.setAttribute('aria-pressed', x === b)); run(); });
    }
  });

  // Diseño «Galería» (.ga): pestaña «Contáctanos», formulario a WhatsApp y antes/después
  const bindGaleria = () => document.querySelectorAll('.ga:not([data-ga])').forEach(root => {
    root.dataset.ga = 1;
    let kb = {}; try { kb = JSON.parse(root.querySelector('.ga-kb')?.textContent || '{}'); } catch {}
    const tab = root.querySelector('[data-ga-tab]'), btn = tab?.querySelector('.ga-tab-btn');
    const open = o => { tab.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); if (o) tab.querySelector('input')?.focus({ preventScroll: true }); };
    btn?.addEventListener('click', () => open(!tab.classList.contains('open')));
    tab?.addEventListener('keydown', e => { if (e.key === 'Escape') { open(false); btn.focus(); } });
    root.querySelector('[data-ga-form]')?.addEventListener('submit', e => {
      e.preventDefault(); const f = new FormData(e.target);
      const msg = [`Hola, quiero agendar una cita en ${kb.name || root.dataset.name}.`, f.get('n') && `Soy ${f.get('n')}.`, f.get('s') && `Me interesa: ${f.get('s')}.`, f.get('m'), f.get('t') && `Mi teléfono: ${f.get('t')}`].filter(Boolean).join('\n');
      if (kb.wa) window.open(`https://wa.me/${kb.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
    root.querySelectorAll('[data-ga-case] input').forEach(r => r.addEventListener('input', () => r.parentElement.style.setProperty('--p', r.value + '%')));
  });

  // Piezas comunes de los diseños nuevos (lib/templates/base.js): formulario a WhatsApp,
  // «abierto ahora», antes/después y pestañas. Cada diseño solo marca con data-t-*.
  const bindT = () => {
    document.querySelectorAll('[data-t-form]:not([data-tb])').forEach(f => {
      f.dataset.tb = 1;
      f.addEventListener('submit', e => {
        e.preventDefault();
        const root = f.closest('.cx'); let kb = {}; try { kb = JSON.parse(root?.querySelector('.t-kb')?.textContent || '{}'); } catch {}
        const parts = [...f.querySelectorAll('[name]')].filter(x => x.value.trim()).map(x => `• ${x.dataset.l || x.name}: ${x.value.trim()}`);
        const msg = `${f.dataset.intro || 'Hola, quiero agendar una cita en'} ${kb.name || root?.dataset.name || ''}.\n${parts.join('\n')}`;
        if (kb.wa) window.open(`https://wa.me/${kb.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      });
    });
    document.querySelectorAll('[data-t-open]:not([data-tb])').forEach(el => {
      el.dataset.tb = 1;
      let sch = []; try { sch = JSON.parse(el.dataset.tOpen); } catch {}
      const D = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], hm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
      const now = new Date(), d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
      const today = sch.find(s => s.days.includes(d) && m >= s.from && m < s.to);
      if (today) { el.dataset.state = 'open'; el.textContent = `Abierto ahora · cierra a las ${hm(today.to)}`; return; }
      for (let k = 0; k < 8; k++) {
        const dd = (d + k) % 7, next = sch.filter(s => s.days.includes(dd) && (k || s.from > m)).sort((a, b) => a.from - b.from)[0];
        if (next) { el.dataset.state = 'closed'; el.textContent = `Cerrado · abre ${k === 0 ? 'hoy' : k === 1 ? 'mañana' : `el ${D[dd]}`} a las ${hm(next.from)}`; return; }
      }
    });
    document.querySelectorAll('[data-t-shrink]:not([data-tb])').forEach(root => {
      root.dataset.tb = 1; let on = false;
      const tick = () => { const s = scrollY > 80; if (s !== on) { on = s; root.classList.toggle('t-scrolled', s); } };
      addEventListener('scroll', tick, { passive: true }); tick();
    });
    // «Calendario»: dos clics en el calendario eligen llegada y salida y llenan el formulario de estancia
    document.querySelectorAll('[data-t-cal]:not([data-tb])').forEach(cal => {
      cal.dataset.tb = 1;
      const root = cal.closest('.cx'), f = root && root.querySelector('.t-stay'), out = cal.querySelector('[data-cal-out]');
      const fmt = s => new Date(s + 'T12:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
      let a = '', b = '';
      const paint = () => {
        cal.querySelectorAll('[data-d]').forEach(x => { const d = x.dataset.d; x.classList.toggle('is-sel', d === a || d === b); x.classList.toggle('is-in', !!(a && b && d > a && d < b)); x.setAttribute('aria-pressed', d === a || d === b); });
        if (out) out.textContent = a ? (b ? `${fmt(a)} → ${fmt(b)}` : `Llegada ${fmt(a)} · elige la salida`) : 'Elige tu llegada';
        if (f) { const i = f.querySelector('[name=in]'), o = f.querySelector('[name=out]'); if (i) i.value = a; if (o) o.value = b; }
      };
      cal.addEventListener('click', e => {
        const x = e.target.closest('[data-d]'); if (!x || x.disabled) return;
        const d = x.dataset.d;
        if (!a || b || d <= a) { a = d; b = ''; } else b = d;
        paint();
      });
      paint();
    });
    // «Reloj»: hora local en vivo y la actividad de la casa que mejor queda a esta hora
    document.querySelectorAll('[data-t-clock]:not([data-tb])').forEach(el => {
      el.dataset.tb = 1;
      const t = el.querySelector('[data-clock-time]'), now = el.querySelector('[data-clock-now]'), items = [...el.querySelectorAll('[data-from]')];
      const tick = () => {
        const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
        if (t) t.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        let cur = null;
        items.forEach(x => { const on = h >= +x.dataset.from && h < +x.dataset.to; x.classList.toggle('is-now', on); if (on && !cur) cur = x; });
        const next = cur || items.filter(x => +x.dataset.from > h).sort((a, b) => a.dataset.from - b.dataset.from)[0] || items[0];
        if (now && next) now.textContent = cur ? `Ahora es buen momento para: ${next.dataset.name}` : `${+next.dataset.from > h ? 'A las' : 'Mañana a las'} ${next.dataset.from}:00: ${next.dataset.name}`;
      };
      tick(); setInterval(tick, 30000);
    });
    // Inmobiliarias: filtros y búsqueda escrita sobre la lista de propiedades ([data-t-list] > [data-op])
    document.querySelectorAll('[data-t-filt]:not([data-tb])').forEach(f => {
      f.dataset.tb = 1;
      const root = f.closest('.cx'), out = root && root.querySelector('[data-t-count]');
      const items = root ? [...root.querySelectorAll('[data-t-list] [data-op]')] : [];
      const num = s => { const m = s.match(/(\d+(?:[.,]\d+)?)\s*(millones|millón|mdp|m\b|mil|k\b)?/); if (!m) return 0; const n = parseFloat(m[1].replace(',', '.')); return /^m/.test(m[2] || '') ? n * 1e6 : /^(mil|k)/.test(m[2] || '') ? n * 1e3 : n; };
      const run = () => {
        const v = Object.fromEntries(new FormData(f)), q = String(v.q || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let op = v.op || '', beds = +v.beds || 0, max = 0, words = [];
        if (q) {
          if (/rent/.test(q)) op = 'renta'; else if (/compr|venta|vend/.test(q)) op = 'venta';
          const b = q.match(/(\d+)\s*(rec|cuart|hab)/); if (b) beds = +b[1];
          const p = q.match(/(?:hasta|menos de|maximo|max\.?|por)\s*\$?\s*([\d.,]+\s*(?:millones|millon|mdp|mil|k|m)?)/); if (p) max = num(p[1]);
          words = q.replace(/(\d+)\s*(rec\w*|cuart\w*|hab\w*)|(hasta|menos de|maximo|max\.?|por)\s*\$?\s*[\d.,]+\s*(millones|millon|mdp|mil|k|m)?|\b(busco|quiero|una?|casa|depa\w*|en|de|con|para|comprar|rentar|renta|venta|y|el|la|los|las)\b/g, ' ').split(/\s+/).filter(w => w.length > 3);
        }
        let shown = 0;
        items.forEach(x => {
          const d = x.dataset, hay = `${d.zone} ${d.t}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const ok = (!op || d.op === op) && (!beds || +d.beds >= beds) && (!max || !+d.price || +d.price <= max) && words.every(w => hay.includes(w));
          x.hidden = !ok; if (ok) shown++;
        });
        if (out) out.textContent = shown ? `${shown} ${shown === 1 ? 'propiedad' : 'propiedades'}` : 'Nada con eso por ahora: escríbenos y te buscamos opciones';
      };
      f.addEventListener('input', run); f.addEventListener('change', run); run();
    });
    // Accesibilidad de la página: agrandar letra y leer en voz alta ([data-t-zoom], [data-t-read])
    document.querySelectorAll('[data-t-zoom]:not([data-tb])').forEach(bt => {
      bt.dataset.tb = 1; const root = bt.closest('.cx');
      bt.addEventListener('click', () => { const on = root.classList.toggle('t-big'); bt.setAttribute('aria-pressed', on); });
    });
    document.querySelectorAll('[data-t-read]:not([data-tb])').forEach(bt => {
      bt.dataset.tb = 1; const root = bt.closest('.cx');
      if (!('speechSynthesis' in window)) { bt.hidden = true; return; }
      bt.addEventListener('click', () => {
        if (speechSynthesis.speaking) { speechSynthesis.cancel(); bt.setAttribute('aria-pressed', false); return; }
        const txt = [...root.querySelectorAll('h1, h2, h3, p')].filter(e => e.offsetParent).map(e => e.textContent.trim()).filter(Boolean).slice(0, 40).join('. ');
        const u = new SpeechSynthesisUtterance(txt); u.lang = 'es-MX'; u.onend = () => bt.setAttribute('aria-pressed', false);
        speechSynthesis.speak(u); bt.setAttribute('aria-pressed', true);
      });
    });
    // «Bowl»: filtros de la carta y panel del platillo elegido
    document.querySelectorAll('.bw-shop:not([data-tb])').forEach(sh => {
      sh.dataset.tb = 1;
      sh.addEventListener('click', e => {
        const f = e.target.closest('[data-bw-cat]');
        if (f) { sh.querySelectorAll('[data-bw-cat]').forEach(x => x.setAttribute('aria-selected', x === f)); sh.querySelectorAll('.bw-grid li').forEach(li => { li.hidden = !!f.dataset.bwCat && li.dataset.cat !== f.dataset.bwCat; }); return; }
        const p = e.target.closest('[data-bw-pick]');
        if (p) { sh.querySelectorAll('[data-bw-pick]').forEach(x => x.setAttribute('aria-pressed', x === p)); sh.querySelectorAll('[data-bw-det]').forEach(d => { d.hidden = d.dataset.bwDet !== p.dataset.bwPick; }); }
      });
    });
    // «Tienda»: filtros por etiqueta y carrito que arma el pedido para WhatsApp
    document.querySelectorAll('.td:not([data-tb])').forEach(root => {
      root.dataset.tb = 1;
      const cart = new Map(), money = v => { const n = parseFloat(String(v).replace(/[^\d.]/g, '')); return isNaN(n) ? 0 : n; };
      let kb = {}; try { kb = JSON.parse(root.querySelector('.t-kb')?.textContent || '{}'); } catch {}
      const paint = () => {
        const lines = root.querySelector('[data-t-lines]'), items = [...cart.values()];
        root.querySelectorAll('[data-t-count]').forEach(x => { x.textContent = items.reduce((s, i) => s + i.q, 0); });
        root.querySelector('[data-t-total]').textContent = '$' + items.reduce((s, i) => s + i.q * money(i.p), 0).toLocaleString('es-MX');
        lines.innerHTML = items.length ? items.map(i => `<li><span>${i.q} × ${esc(i.n)}</span><span>${esc(i.p)} <button type="button" data-t-del="${esc(i.n)}" aria-label="Quitar ${esc(i.n)}">×</button></span></li>`).join('') : '<li class="td-empty">Agrega productos con el botón «Agregar».</li>';
      };
      root.addEventListener('click', e => {
        const add = e.target.closest('[data-t-add]');
        if (add) { const n = add.dataset.tAdd, it = cart.get(n) || { n, p: add.dataset.price, q: 0 }; it.q++; cart.set(n, it); add.classList.add('added'); add.textContent = `Agregado (${it.q})`; paint(); return; }
        const del = e.target.closest('[data-t-del]');
        if (del) { cart.delete(del.dataset.tDel); root.querySelectorAll(`[data-t-add]`).forEach(b => { if (!cart.has(b.dataset.tAdd)) { b.classList.remove('added'); b.textContent = 'Agregar'; } }); paint(); return; }
        const tag = e.target.closest('[data-td-tag]');
        if (tag) { root.querySelectorAll('[data-td-tag]').forEach(x => x.setAttribute('aria-selected', x === tag)); root.querySelectorAll('.td-row>li[data-tags]').forEach(li => { li.hidden = !!tag.dataset.tdTag && !li.dataset.tags.split('|').includes(tag.dataset.tdTag); }); return; }
        if (e.target.closest('[data-t-cartsend]') && cart.size && kb.wa) {
          const msg = `Hola, quiero hacer este pedido en ${kb.name || root.dataset.name}:\n${[...cart.values()].map(i => `• ${i.q} × ${i.n} (${i.p})`).join('\n')}`;
          window.open(`https://wa.me/${kb.wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
        }
      });
    });
    document.querySelectorAll('[data-t-follow]:not([data-tb])').forEach(root => {
      root.dataset.tb = 1; const dot = root.querySelector('.fs-follow'); if (!dot || reduce) return;
      root.addEventListener('pointermove', e => { dot.style.setProperty('--mx', e.clientX + 12 + 'px'); dot.style.setProperty('--my', e.clientY + 12 + 'px'); }, { passive: true });
    });
    document.querySelectorAll('[data-t-flip]:not([data-tb])').forEach(b => { b.dataset.tb = 1; b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')); });
    document.querySelectorAll('[data-t-case] input:not([data-tb])').forEach(r => { r.dataset.tb = 1; r.addEventListener('input', () => r.parentElement.style.setProperty('--p', r.value + '%')); });
    document.querySelectorAll('[data-t-tabs]:not([data-tb])').forEach(box => {
      box.dataset.tb = 1;
      box.addEventListener('click', e => {
        const b = e.target.closest('[role="tab"]'); if (!b) return;
        box.querySelectorAll('[role="tab"]').forEach(x => x.setAttribute('aria-selected', x === b));
        box.querySelectorAll('[role="tabpanel"]').forEach(p => { p.hidden = p.id !== b.getAttribute('aria-controls'); });
      });
    });
  };
  bindCars(); bindDemos(); bindMoments(); bindExpresiva(); bindPop(); bindTabs(); bindFonda(); bindEstudio(); bindGaleria(); bindT();
  new MutationObserver(() => { bindCars(); bindDemos(); bindMoments(); bindExpresiva(); bindPop(); bindTabs(); bindFonda(); bindEstudio(); bindGaleria(); bindT(); }).observe(document.documentElement, { childList: true, subtree: true });
})();

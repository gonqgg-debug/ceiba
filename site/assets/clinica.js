// Interacción de la plantilla «clínica» v2 (.cx). Funciona en la vista previa
// completa y dentro del comparador de la propuesta.
(() => {
  if (window.__cx) return; window.__cx = true;
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

  bindCars();
  new MutationObserver(bindCars).observe(document.documentElement, { childList: true, subtree: true });
})();

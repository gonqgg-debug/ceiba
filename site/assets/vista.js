// Interacción de la vista previa en pantalla completa (/vista/[slug]).
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const WA = '<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#wa"/></svg>';

  // Aviso para las páginas internas, que se diseñan al activar
  const toast = $('#vp-toast'); let tT;
  const say = html => { toast.innerHTML = html; toast.hidden = false; clearTimeout(tT); tT = setTimeout(() => toast.hidden = true, 3800); };
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-page]'); if (!a) return;
    e.preventDefault(); say(`La página <b>${esc(a.dataset.page)}</b> la diseñamos cuando activas tu propuesta.`);
  });

  // Chat de la clínica: respuestas aprobadas, sin IA en la vista previa
  const closeAI = f => { f.classList.remove('open'); f.querySelector('.mn-ai-btn').setAttribute('aria-expanded', 'false'); };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-ai]'); if (!t) return;
    const fl = t.closest('.mn-float'); if (!fl) return;
    if (t.dataset.ai === 'toggle') {
      if (fl.classList.contains('open')) return closeAI(fl);
      fl.classList.add('open'); fl.querySelector('.mn-ai-btn').setAttribute('aria-expanded', 'true');
      fl.querySelector('.mn-ai-sug button:not([hidden])')?.focus({ preventScroll: true });
      return;
    }
    const log = fl.querySelector('.mn-ai-log'); t.hidden = true;
    log.insertAdjacentHTML('beforeend', `<p class="mn-ai-msg me">${esc(t.textContent)}</p>`);
    const wa = document.querySelector('.mn-util-wa, .mn-wa-btn');
    const act = t.dataset.act === 'book'
      ? '<span class="mn-ai-act book">Agenda tu cita</span>'
      : wa?.href ? `<a class="mn-ai-act" href="${esc(wa.href)}" target="_blank" rel="noopener">${WA}Seguir por WhatsApp</a>` : `<span class="mn-ai-act">${WA}Seguir por WhatsApp</span>`;
    const reply = () => { log.querySelector('.mn-ai-typing')?.remove(); log.insertAdjacentHTML('beforeend', `<p class="mn-ai-msg bot">${esc(t.dataset.a)}${act}</p>`); log.scrollTop = log.scrollHeight; };
    if (reduce) return reply();
    log.insertAdjacentHTML('beforeend', '<span class="mn-ai-typing" aria-hidden="true"><i></i><i></i><i></i></span>');
    log.scrollTop = log.scrollHeight; setTimeout(reply, 650);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.mn-float.open').forEach(closeAI); });

  // Carrusel de servicios
  const sync = track => {
    const nav = track.closest('.mn-treat')?.querySelector('.mn-car-nav'); if (!nav) return;
    nav.querySelector('[data-car="prev"]').disabled = track.scrollLeft < 4;
    nav.querySelector('[data-car="next"]').disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-car]'); if (!b) return;
    const track = b.closest('.mn-treat').querySelector('.mn-car'), card = track.querySelector('.mn-tc');
    const step = card.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    track.scrollBy({ left: b.dataset.car === 'next' ? step : -step, behavior: reduce ? 'auto' : 'smooth' });
  });
  document.querySelectorAll('.mn-car').forEach(t => { t.addEventListener('scroll', () => sync(t), { passive: true }); new ResizeObserver(() => sync(t)).observe(t); });

  // La barra de vista previa se puede cerrar para ver la página limpia
  $('#vp-hide')?.addEventListener('click', () => { $('#vp-bar').hidden = true; $('#vp-pill').hidden = false; });
  $('#vp-pill')?.addEventListener('click', () => { $('#vp-bar').hidden = false; $('#vp-pill').hidden = true; });
})();

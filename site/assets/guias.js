// Guías: barra de lectura, índice que sigue la sección, apariciones y cifras que cuentan.
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  const body = $('.g-body'); if (!body) return;

  /* barra de lectura */
  const bar = document.createElement('div'); bar.className = 'g-prog'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  const onScroll = () => { const r = body.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight * .6))); bar.style.setProperty('--p', p.toFixed(3)); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* índice con las secciones (h2) */
  const toc = $('#g-toc');
  const hs = $$('h2', body).filter(h => !h.closest('.g-src'));
  hs.forEach((h, i) => { if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.normalize('NFD').replace(/[̀-ͯ¿?]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40); });
  if (toc) {
    toc.innerHTML = '<b>En esta guía</b><ol>' + hs.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('') + '</ol>';
    const links = $$('a', toc);
    const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id)); }), { rootMargin: '-15% 0px -75% 0px' });
    hs.forEach(h => tio.observe(h));
  }

  /* apariciones */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2, rootMargin: '0px 0px -8% 0px' });
  $$('.g-rv, .g-checks').forEach(el => io.observe(el));

  /* cifras que cuentan: <b data-count="4.3" data-dec="1" data-suf="★"> */
  const count = el => {
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '', pre = el.dataset.pre || '';
    const put = v => el.textContent = pre + v.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) return put(end);
    const t0 = performance.now(), f = t => { const p = Math.min(1, (t - t0) / 1400); put(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f);
  };
  const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } }), { threshold: .6 });
  $$('[data-count]').forEach(el => { el.textContent = (el.dataset.pre || '') + '0' + (el.dataset.suf || ''); cio.observe(el); });

  /* pasos que se llenan con el scroll */
  $$('.g-steps').forEach(ol => {
    const lis = $$('li', ol);
    const upd = () => { const r = ol.getBoundingClientRect(), mid = innerHeight * .55; ol.style.setProperty('--fill', Math.max(0, Math.min(1, (mid - r.top) / r.height)).toFixed(3)); lis.forEach(li => li.classList.toggle('on', li.getBoundingClientRect().top < mid)); };
    addEventListener('scroll', upd, { passive: true }); upd();
  });
})();

// Barra de vista previa y aviso de páginas internas (/vista/[slug]).
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = $('#vp-toast'); let tT;
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-page]'); if (!a) return;
    e.preventDefault(); toast.innerHTML = `La página <b>${esc(a.dataset.page)}</b> la diseñamos cuando activas tu propuesta.`;
    toast.hidden = false; clearTimeout(tT); tT = setTimeout(() => toast.hidden = true, 3800);
  });
  $('#vp-hide')?.addEventListener('click', () => { $('#vp-bar').hidden = true; $('#vp-pill').hidden = false; });
  $('#vp-pill')?.addEventListener('click', () => { $('#vp-bar').hidden = false; $('#vp-pill').hidden = true; });
})();

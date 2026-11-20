// Precios del país del visitante, detectado por su IP (/api/geo, encabezado de Vercel).
// No hay selector ni se puede forzar el país: cada país tiene su propia estrategia de precios.
// El catálogo (window.CEIBA_CATALOG) lo genera build.py desde lib/catalog.js.
// El HTML trae los precios de México (sirve sin JavaScript y para buscadores). Este script:
//   - oculta los precios un instante mientras pregunta el país (máx. 1.5 s), para no mostrar
//     primero los de México a quien está en otro país;
//   - reescribe [data-price="web.negocio.monthly"] (grupo.id.campo) y sumas "sum:a+b";
//     un monto 0 en [data-price-zero] muestra ese texto;
//   - reescribe [data-cur-name] y [data-cur-code].
// El cobro real usa el país de la propuesta; esto solo cambia lo que se muestra.
(() => {
  const C = window.CEIBA_CATALOG; if (!C) return;
  const cur = k => C.currencies[C.countries[k].currency];
  const fmt = (n, k) => cur(k).symbol + Number(n).toLocaleString('en-US');
  const val = (path, k) => { const [g, id, f] = path.split('.'); return C.prices[k]?.[g]?.[id]?.[f]; };
  const norm = k => (k && C.countries[String(k).toUpperCase()] ? String(k).toUpperCase() : 'XX');

  const hide = document.createElement('style');
  hide.textContent = '[data-price],[data-cur-name],[data-cur-code]{visibility:hidden}';
  document.head.appendChild(hide);
  let done = false;
  function apply(k) {
    if (done) return; done = true;
    document.querySelectorAll('[data-price]').forEach(el => {
      const spec = el.dataset.price;
      const n = spec.startsWith('sum:') ? spec.slice(4).split('+').reduce((a, p) => a + (val(p, k) || 0), 0) : val(spec, k);
      if (n == null) return;
      el.textContent = n === 0 && el.dataset.priceZero ? el.dataset.priceZero : fmt(n, k);
    });
    document.querySelectorAll('[data-cur-name]').forEach(el => { el.textContent = cur(k).name; });
    document.querySelectorAll('[data-cur-code]').forEach(el => { el.textContent = cur(k).code; });
    document.documentElement.dataset.pais = k;
    hide.remove();
  }
  const timer = setTimeout(() => apply(C.default), 1500); // si no responde, precios de México
  fetch('/api/geo').then(r => (r.ok ? r.json() : null))
    .then(d => { clearTimeout(timer); apply(d?.country ? norm(d.country) : C.default); })
    .catch(() => { clearTimeout(timer); apply(C.default); });
})();

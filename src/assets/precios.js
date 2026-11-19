// Precios en la moneda del visitante. El catálogo (window.CEIBA_CATALOG) lo genera
// build.py desde lib/catalog.js, así que los montos salen de un solo lugar.
// El HTML trae los precios en la moneda base (sirve sin JavaScript). Este script:
//   - elige la moneda: ?moneda=usd, la que eligió antes, o la de su país (/api/geo);
//   - reescribe [data-price="web.negocio.activation"] y sumas "sum:a+b";
//   - reescribe [data-cur-name] (p. ej. «pesos mexicanos») y [data-cur-code];
//   - muestra un selector en [data-cur-switch] si hay más de una moneda pública.
// El cobro real usa la moneda de la propuesta; esto solo cambia lo que se muestra.
(() => {
  const C = window.CEIBA_CATALOG; if (!C) return;
  const pub = Object.keys(C.currencies).filter(c => C.currencies[c].public);
  const KEY = 'ceiba_moneda';
  const store = { get() { try { return localStorage.getItem(KEY); } catch { return null; } }, set(v) { try { localStorage.setItem(KEY, v); } catch {} } };
  const fmt = (n, c) => C.currencies[c].symbol + Number(n).toLocaleString('en-US');
  const val = (path, c) => { const [g, id, f] = path.split('.'); return C[g]?.[id]?.[c]?.[f]; };

  function apply(c) {
    if (!C.currencies[c]) c = C.base;
    document.querySelectorAll('[data-price]').forEach(el => {
      const spec = el.dataset.price;
      const n = spec.startsWith('sum:') ? spec.slice(4).split('+').reduce((a, p) => a + (val(p, c) || 0), 0) : val(spec, c);
      if (n != null) el.textContent = fmt(n, c);
    });
    document.querySelectorAll('[data-cur-name]').forEach(el => { el.textContent = C.currencies[c].name; });
    document.querySelectorAll('[data-cur-code]').forEach(el => { el.textContent = C.currencies[c].code; });
    document.querySelectorAll('[data-cur-switch] button').forEach(b => b.setAttribute('aria-pressed', b.dataset.cur === c));
    document.documentElement.dataset.moneda = c;
  }

  if (pub.length > 1) {
    document.querySelectorAll('[data-cur-switch]').forEach(box => {
      box.hidden = false;
      box.innerHTML = '<span>Ver precios en</span>' + pub.map(c => `<button type="button" data-cur="${c}" aria-pressed="false">${C.currencies[c].code}</button>`).join('');
      box.addEventListener('click', e => { const b = e.target.closest('[data-cur]'); if (!b) return; store.set(b.dataset.cur); apply(b.dataset.cur); });
    });
  }

  const asked = new URLSearchParams(location.search).get('moneda');
  const chosen = (asked && C.currencies[asked] && asked) || (store.get() && pub.includes(store.get()) && store.get());
  if (chosen) { apply(chosen); return; }
  if (pub.length < 2) return; // una sola moneda pública: el HTML ya está bien
  fetch('/api/geo').then(r => r.ok ? r.json() : null).then(d => { if (d?.currency && pub.includes(d.currency)) apply(d.currency); }).catch(() => {});
})();

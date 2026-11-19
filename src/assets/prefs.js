// Cuestionario de estilo antes de armar la propuesta (Inicio y /diagnostico).
//   CeibaPrefs.ask(form, prefs => enviar(prefs))   // prefs = null si lo omite
// Muestra 6 preguntas rápidas dentro del mismo formulario. Todo es opcional.
(() => {
  const Q = [
    { id: 'style', t: '¿Qué estilo va más con tu clínica?', type: 'cards', opts: [
      ['moderno', 'Moderno y limpio', 'Mucho blanco, líneas simples', '#2D6BE4', 'Manrope'],
      ['elegante', 'Elegante y premium', 'Tipografía con serif, detalles finos', '#B08D3C', 'Fraunces'],
      ['calido', 'Cálido y familiar', 'Formas suaves, cercano', '#E07A5F', 'Nunito'],
      ['tecnologico', 'Clínico y tecnológico', 'Preciso, ordenado', '#0E8C9A', 'Poppins'],
    ] },
    { id: 'mode', t: '¿Fondo claro u oscuro?', type: 'pills', opts: [['light', 'Claro'], ['dark', 'Oscuro'], ['any', 'Que lo elija Ceiba']] },
    { id: 'color', t: 'Color principal', type: 'swatches', opts: [
      ['logo', 'El de mi logo', ''], ['#1F4FD1', 'Azul', '#1F4FD1'], ['#0E9F8A', 'Verde menta', '#0E9F8A'], ['#0B8FB3', 'Turquesa', '#0B8FB3'],
      ['#6D4BD8', 'Morado', '#6D4BD8'], ['#B08D3C', 'Dorado', '#B08D3C'], ['#D9547A', 'Rosa', '#D9547A'], ['#1E2A28', 'Casi negro', '#1E2A28'],
    ] },
    { id: 'goals', t: '¿Qué quieres lograr primero?', type: 'multi', opts: [
      ['citas', 'Más citas de valoración'], ['estetica', 'Vender tratamientos estéticos'], ['urgencias', 'Atender urgencias'],
      ['google', 'Que me encuentren en Google'], ['zonas', 'Pacientes de otras zonas'], ['confianza', 'Transmitir más confianza'],
    ] },
    { id: 'tone', t: '¿Cómo les hablas a tus pacientes?', type: 'pills', opts: [['tu', 'De tú'], ['usted', 'De usted']] },
    { id: 'ref', t: '¿Hay alguna página que te guste? (opcional)', type: 'text', ph: 'Pega el enlace o escribe el nombre' },
  ];
  const css = `
.cp{display:grid;gap:22px}
.cp-head{display:grid;gap:4px}
.cp-head b{font:600 20px/1.25 var(--f-display);letter-spacing:-.01em}
.cp-head span{color:rgba(247,244,235,.7);font-size:15px}
.cp-q{display:grid;gap:10px;border:0;margin:0;padding:0}
.cp-q legend{font-weight:500;font-size:15px;margin-bottom:10px;padding:0}
.cp-cards{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cp-card{display:grid;gap:4px;text-align:left;padding:12px;border-radius:12px;border:1px solid rgba(247,244,235,.18);background:rgba(247,244,235,.04);cursor:pointer;color:inherit;font:inherit}
.cp-card i{display:block;height:6px;width:36px;border-radius:9px;margin-bottom:6px}
.cp-card b{font-size:17px;line-height:1.15;font-weight:600}
.cp-card span{font-size:13px;color:rgba(247,244,235,.65)}
.cp-pills{display:flex;flex-wrap:wrap;gap:8px}
.cp-pill{border:1px solid rgba(247,244,235,.22);background:transparent;color:inherit;border-radius:999px;padding:9px 14px;font:inherit;font-size:15px;cursor:pointer}
.cp-sw{display:flex;flex-wrap:wrap;gap:8px}
.cp-swatch{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(247,244,235,.22);background:transparent;color:inherit;border-radius:999px;padding:6px 12px 6px 6px;font:inherit;font-size:14px;cursor:pointer}
.cp-swatch i{width:22px;height:22px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.25)}
.cp-swatch i.logo{background:conic-gradient(#1F4FD1,#0E9F8A,#B08D3C,#D9547A,#1F4FD1)}
[aria-pressed="true"].cp-card,[aria-pressed="true"].cp-pill,[aria-pressed="true"].cp-swatch{border-color:var(--lime);background:rgba(214,250,82,.1);box-shadow:inset 0 0 0 1px var(--lime)}
.cp input[type=text]{width:100%;height:48px;border-radius:10px;border:1px solid rgba(247,244,235,.18);background:var(--ink-2);color:var(--ivory);padding:0 14px;font:400 16px var(--f-body)}
.cp-acts{display:grid;gap:10px}
.cp-skip{background:none;border:0;color:rgba(247,244,235,.7);text-decoration:underline;cursor:pointer;font:inherit;font-size:15px;justify-self:center}
@media (max-width:520px){.cp-cards{grid-template-columns:1fr}}`;
  let styled = false;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function ask(form, done, { fields, submitLabel = 'Ver mi propuesta' } = {}) {
    if (!styled) {
      const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
      const f = document.createElement('link'); f.rel = 'stylesheet'; f.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Manrope:wght@600&family=Nunito:wght@700&family=Poppins:wght@600&display=swap'; document.head.appendChild(f);
      styled = true;
    }
    const box = document.createElement('div');
    box.className = 'cp';
    box.innerHTML = `<div class="cp-head"><b>Personaliza tu propuesta</b><span>30 segundos. Con esto armamos una portada a tu gusto, optimizada para clínicas.</span></div>` +
      Q.map(q => {
        let inner = '';
        if (q.type === 'cards') inner = `<div class="cp-cards">${q.opts.map(([v, l, d, c, f]) => `<button type="button" class="cp-card" data-q="${q.id}" data-v="${v}" aria-pressed="false"><i style="background:${c}"></i><b style="font-family:'${f}',var(--f-display)">${esc(l)}</b><span>${esc(d)}</span></button>`).join('')}</div>`;
        if (q.type === 'pills' || q.type === 'multi') inner = `<div class="cp-pills">${q.opts.map(([v, l]) => `<button type="button" class="cp-pill" data-q="${q.id}" data-v="${v}" aria-pressed="false"${q.type === 'multi' ? ' data-multi' : ''}>${esc(l)}</button>`).join('')}</div>`;
        if (q.type === 'swatches') inner = `<div class="cp-sw">${q.opts.map(([v, l, c]) => `<button type="button" class="cp-swatch" data-q="${q.id}" data-v="${v}" aria-pressed="false"><i${c ? ` style="background:${c}"` : ' class="logo"'}></i>${esc(l)}</button>`).join('')}</div>`;
        if (q.type === 'text') inner = `<input type="text" data-q="${q.id}" maxlength="200" placeholder="${esc(q.ph)}" aria-label="${esc(q.t)}">`;
        return `<fieldset class="cp-q"><legend>${esc(q.t)}${q.type === 'multi' ? ' <small style="opacity:.6">(elige las que quieras)</small>' : ''}</legend>${inner}</fieldset>`;
      }).join('') +
      `<div class="cp-acts"><button type="button" class="btn btn-primary" data-cp="send">${esc(submitLabel)} <span class="arrow" aria-hidden="true">→</span></button><button type="button" class="cp-skip" data-cp="skip">Omitir y enviar</button></div>`;
    if (fields) fields.hidden = true;
    form.appendChild(box);
    box.querySelector('.cp-head b').setAttribute('tabindex', '-1'); box.querySelector('.cp-head b').focus();
    box.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

    box.addEventListener('click', e => {
      const b = e.target.closest('[data-q][data-v]');
      if (b) {
        if (b.hasAttribute('data-multi')) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
        else box.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x => x.setAttribute('aria-pressed', x === b));
        return;
      }
      const a = e.target.closest('[data-cp]'); if (!a) return;
      const prefs = a.dataset.cp === 'skip' ? null : collect(box);
      a.disabled = true;
      Promise.resolve(done(prefs)).finally(() => { a.disabled = false; });
    });
    return { close() { box.remove(); if (fields) fields.hidden = false; } };
  }
  function collect(box) {
    const one = id => box.querySelector(`[data-q="${id}"][aria-pressed="true"]`)?.dataset.v || null;
    const prefs = {
      style: one('style'), mode: one('mode'), color: one('color'), tone: one('tone'),
      goals: [...box.querySelectorAll('[data-q="goals"][aria-pressed="true"]')].map(b => b.dataset.v),
      ref: box.querySelector('[data-q="ref"]').value.trim().slice(0, 200) || null,
    };
    return Object.values(prefs).some(v => (Array.isArray(v) ? v.length : v)) ? prefs : null;
  }
  window.CeibaPrefs = { ask };
})();

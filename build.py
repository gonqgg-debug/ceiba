#!/usr/bin/env python3
"""Arma las páginas de site/ a partir de las plantillas de src/.

Las tres páginas comparten estilos, el logo, las maquetas de la clínica
(Actual / Propuesta), el comparador y los formularios. La fuente de todo eso
es src/home.html; las otras plantillas los reciben con marcadores {{...}}.

Uso:  python3 build.py
"""
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent
SRC, SITE = ROOT / "src", ROOT / "site"

home = (SRC / "home.html").read_text(encoding="utf-8")


def cut(start, end, text=home):
    a = text.index(start)
    b = text.index(end, a) + len(end)
    return text[a:b]


shared = {
    "{{BASE_CSS}}": home[home.index("<style>") + 7:home.index("</style>")],
    "{{SYMBOLS}}": cut('<svg width="0" height="0"', "</svg>"),
    "{{TEMPLATES}}": home[home.index('<template id="tpl-old">'):
                          home.index("</template>", home.index('<template id="tpl-new">')) + 11],
}

# Comparador y helpers de JS que usa la propuesta privada
cmp_js = (home[home.index("  /* ---------- clone mock templates"):home.index("  /* hero tag follows")]
          + home[home.index("  /* ---------- radiogroup helper"):home.index("  /* ---------- URL check (hero)")])

# Bloques de Inicio que reutiliza la página de industria
industry = {
    "{{SCRIPT}}": home[home.rindex("<script>") + 8:home.rindex("</script>")],
    "{{CMP_SECTION}}": cut('<section class="band band--light section" id="antes-despues"', "</section>"),
    "{{FORM}}": cut('<form class="form" id="lead-form"', "</form>").replace(
        "<option>Clínica o consultorio</option>", "<option selected>Clínica o consultorio</option>"),
    "{{DIAG}}": cut('<dialog class="diag" id="diag"', "</dialog>"),
    "{{AUDIT}}": cut('<form class="audit" id="audit-form"', "</form>"),
}


def fill(template, values):
    text = (SRC / template).read_text(encoding="utf-8")
    for key, value in values.items():
        assert key in text, f"{template}: {key}"
        text = text.replace(key, value)
    return text


# src/home.html no trae <html>/<head> porque también se publica como Artifact,
# que agrega su propio esqueleto. Para el sitio estático se lo ponemos aquí.
index = ('<!doctype html>\n<html lang="es">\n<meta charset="utf-8">\n'
         '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
         '<link rel="icon" href="favicon.svg" type="image/svg+xml">\n'
         '<link rel="icon" href="favicon.ico" sizes="32x32">\n'
         '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n'
         '<meta name="theme-color" content="#081036">\n' + home)


# ---------- Encabezado y pie comunes (Inicio, Páginas web, IA, Clínicas) ----------
import re as _re
CHEV = '<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
SOON = ["Restaurantes", "Inmobiliarias", "Hoteles", "Despachos"]

# Encabezado del diseño nuevo (logo vivo, cristal al bajar): src/partials/n-nav.html
def n_nav(active, cta_href, cta, cta_long):
    html = (SRC / "partials/n-nav.html").read_text(encoding="utf-8")
    html = html.replace("{{CTA_HREF}}", cta_href).replace("{{CTA}}", cta).replace("{{CTA_LONG}}", cta_long)
    if active:
        html = html.replace(f'<a href="{active}">', f'<a href="{active}" aria-current="page">')
    return html

def header(active, cta="/diagnostico"):
    """Encabezado nuevo (logo vivo) para páginas con contenido normal debajo: siempre sólido y con su espacio."""
    href = {"webs": "/webs", "clinicas": "/webs", "ia": "/ia"}.get(active)
    nav = n_nav(href, cta, "Pedir propuesta", "Pedir mi propuesta gratis").replace('<header class="n-nav" id="top">', '<header class="n-nav solid" id="top" data-solid>', 1)
    return nav + '\n<div class="n-space" aria-hidden="true"></div>'

import site_legal
LEGAL_LINKS = ('<a href="/privacidad">Privacidad</a><a href="/terminos">Términos</a>' if site_legal.READY
               else '<a href="#" data-soon="Privacidad">Privacidad</a><a href="#" data-soon="Términos">Términos</a>')
FOOTER = (SRC / "partials/n-foot.html").read_text(encoding="utf-8").replace("{LEGAL_LINKS}", LEGAL_LINKS)

# Menú móvil, submenú y enlaces «pronto» para las páginas que no traen el script de Inicio
NAV_JS = """<script>
(() => {
  if (!window.__ceibaMenu) {
  const h = document.querySelector('.site-header'), b = document.getElementById('menu-btn');
  b?.addEventListener('click', () => { const o = !h.classList.contains('open'); h.classList.toggle('open', o); b.setAttribute('aria-expanded', o); });
  const close = () => document.querySelectorAll('.has-sub.open').forEach(li => { li.classList.remove('open'); li.querySelector('.sub-btn').setAttribute('aria-expanded', 'false'); });
  document.querySelectorAll('.sub-btn').forEach(x => x.addEventListener('click', () => { const li = x.closest('.has-sub'), o = !li.classList.contains('open'); close(); li.classList.toggle('open', o); x.setAttribute('aria-expanded', o); }));
  document.addEventListener('click', e => { if (!e.target.closest('.has-sub')) close(); });
  }
  let t; document.addEventListener('click', e => {
    const a = e.target.closest('[data-soon]'); if (!a) return; e.preventDefault();
    let el = document.getElementById('soon-toast'); if (!el) { el = Object.assign(document.createElement('div'), { id: 'soon-toast', className: 'toast' }); el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = a.dataset.soon + ': muy pronto.'; el.hidden = false; clearTimeout(t); t = setTimeout(() => el.hidden = true, 3200);
  });
})();
</script>"""

def site_chrome(html, active, cta="/diagnostico", own_menu=False):
    """own_menu=True: la página ya trae el script de Inicio, que maneja el menú; solo se agregan los «pronto»."""
    html = _re.sub(r'<header class="site-header"[\s\S]*?</header>', lambda m: header(active, cta), html, count=1)
    html = _re.sub(r'<footer class="band footer">[\s\S]*?</footer>', lambda m: FOOTER, html, count=1)
    if "estudio.css" not in html:
        html = html.replace("</head>", '<link rel="stylesheet" href="/assets/estudio.css">\n</head>', 1)
    js = ("<script>window.__ceibaMenu = true;</script>" if own_menu else "") + NAV_JS
    return html.replace("</body>", js + "\n</body>", 1) if "</body>" in html else html + js

# Rutas limpias y archivos con ruta absoluta (las páginas viven en /, /webs, /webs/clinicas, /ia…)
def linkfix(html):
    html = _re.sub(r'(["\'(])(img/|assets/|favicon|apple-touch-icon)', r'\1/\2', html)
    html = html.replace('rel="/apple-touch-icon"', 'rel="apple-touch-icon"')  # el rel no es una ruta
    for a, b in [('"webs-clinicas.html"', '"/webs/clinicas"'), ('"propuesta-clinica-arrayan.html"', '"/p/clinica-arrayan"'),
                 ("'diagnostico.html?url='", "'/diagnostico?url='"), ('"diagnostico.html"', '"/diagnostico"'), ('href="index.html"', 'href="/"')]:
        html = html.replace(a, b)
    return html

head_tags = ('<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="icon" href="/favicon.ico" sizes="32x32">\n'
             '<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<meta name="theme-color" content="#081036">')
common = {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"], "{{HEAD_TAGS}}": head_tags}

# Muro 3D de /webs: columnas de capturas reales de la plantilla; cada columna va duplicada
# para que la animación (subir o bajar 50%) dé la vuelta sin corte.
def wall():
    names = ["clinica", "restaurante", "hotel", "inmobiliaria", "despacho", "cercana", "expresiva"]
    desk = [f"{n}-{k}" for k in range(3) for n in names]
    mob = [f"{n}-m" for n in names]
    cols, di, mi = [], 0, 0
    for c, (kind, dur) in enumerate([("d", 70), ("m", 55), ("d", 85), ("d", 62), ("m", 74), ("d", 90)]):
        if kind == "d":
            imgs = [desk[(di + k * 5) % len(desk)] for k in range(5)]; di += 2
        else:
            imgs = [mob[(mi + k) % len(mob)] for k in range(4)]; mi += 3
        tags = "".join(f'<img src="/img/webs/{i}.jpg" alt="" width="{640 if kind == "d" else 300}" height="{400 if kind == "d" else 600}" loading="{"eager" if c < 4 else "lazy"}" decoding="async">' for i in imgs)
        cols.append(f'<div class="w-col{" thin" if kind == "m" else ""}" style="--d:{dur}s">{tags}{tags}</div>')
    return "".join(cols)

pages = {
    "index.html": site_chrome(fill("inicio.html", {**common, "{{N_NAV}}": n_nav(None, "#consultoria", "Agendar consultoría", "Agendar una consultoría")}), "inicio"),
    "webs.html": site_chrome(fill("webs.html", {**common, "{{WALL}}": wall(), "{{N_NAV}}": n_nav("/webs", "/empezar", "Armar mi página", "Armar mi página gratis")}), "webs"),
    "empezar.html": fill("empezar.html", {"{{HEAD_TAGS}}": head_tags, "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "ia.html": site_chrome(fill("ia.html", {**common, "{{N_NAV}}": n_nav("/ia", "#contacto", "Agendar diagnóstico", "Agendar un diagnóstico")}), "ia"),
    "webs-clinicas.html": site_chrome(fill("webs-clinicas.html", {**shared, **industry}), "clinicas", cta="#diagnostico", own_menu=True),
    "diagnostico.html": fill("diagnostico.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "admin.html": fill("admin.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "gracias.html": fill("gracias.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "cuenta.html": fill("cuenta.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "maqueta.html": fill("maqueta.html", {"{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
}
# Vista previa en pantalla completa (/vista/[slug]): CSS de la portada nueva,
# la plantilla como módulo para el navegador y los símbolos para el servidor.
(SITE / "assets").mkdir(exist_ok=True)
(SITE / "assets" / "clinica.css").write_text((SRC / "assets/clinica.css").read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "clinica.js").write_text((SRC / "assets/clinica.js").read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "prefs.js").write_text((SRC / "assets/prefs.js").read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "tpl-clinica.js").write_text((ROOT / "lib/templates/clinica.js").read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "fonda.js").write_text((ROOT / "lib/templates/fonda.js").read_text(encoding="utf-8"), encoding="utf-8")
# Datos de las páginas de ejemplo por giro: /empezar arma la vista previa con ellos en el navegador
(SITE / "assets" / "demos").mkdir(exist_ok=True)
for _demo in (ROOT / "lib/demos").glob("*.js"):
    (SITE / "assets" / "demos" / _demo.name).write_text(_demo.read_text(encoding="utf-8"), encoding="utf-8")
for _lib in ("fluid.js", "rough.js", "estudio.css"):
    (SITE / "assets" / _lib).write_text((SRC / "assets" / _lib).read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "vista.js").write_text((SRC / "assets/vista.js").read_text(encoding="utf-8"), encoding="utf-8")
# Precios por moneda: el catálogo sale de lib/catalog.js (única fuente) y precios.js los pinta
catalog_json = subprocess.run(["node", "--input-type=module", "-e",
    "import { publicCatalog } from './lib/catalog.js'; process.stdout.write(JSON.stringify(publicCatalog()))"],
    capture_output=True, text=True, cwd=ROOT, check=True).stdout
(SITE / "assets" / "precios.js").write_text("window.CEIBA_CATALOG = " + catalog_json + ";\n" + (SRC / "assets/precios.js").read_text(encoding="utf-8"), encoding="utf-8")
PRICES_TAG = '<script src="/assets/precios.js" defer></script>\n'
for name in ("webs.html", "ia.html", "webs-clinicas.html"):
    pages[name] = pages[name].replace("</body>", PRICES_TAG + "</body>", 1) if "</body>" in pages[name] else pages[name] + "\n" + PRICES_TAG
(ROOT / "lib" / "generated").mkdir(exist_ok=True)
import json
# Propuesta privada: plantilla con marcadores {{P_...}} que llena lib/render-proposal.js
import re
proposal = fill("propuesta.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"], "{{CMP_JS}}": cmp_js, "{{HOME}}": "/"})
absolute = lambda t: re.sub(r'(["\'(])(img/|favicon|apple-touch-icon)', r'\1/\2', t).replace('rel="/apple-touch-icon"', 'rel="apple-touch-icon"')
(ROOT / "lib" / "generated" / "shared.js").write_text(
    "// Generado por build.py a partir de src/. No editar.\n"
    "export const SYMBOLS = " + json.dumps(shared["{{SYMBOLS}}"], ensure_ascii=False) + ";\n"
    "export const TEMPLATES = " + json.dumps(absolute(shared["{{TEMPLATES}}"]), ensure_ascii=False) + ";\n"
    "export const PROPOSAL_HTML = " + json.dumps(absolute(proposal), ensure_ascii=False) + ";\n", encoding="utf-8")

# Copia estática de la propuesta de ejemplo (la misma que sirve /p/clinica-arrayan)
import subprocess
subprocess.run(["node", str(ROOT / "scripts/render-static.mjs")], check=True)

# ---------- SEO y visibilidad en IA (site_seo.py) ----------
import site_seo
seo_cat = json.loads(subprocess.run(["node", "scripts/seo-catalog.mjs"], capture_output=True, text=True, cwd=ROOT, check=True).stdout)
for name in site_seo.PAGES:
    pages[name] = site_seo.apply(name, pages[name], seo_cat)
(SITE / "robots.txt").write_text(site_seo.robots_txt(), encoding="utf-8")
(SITE / "sitemap.xml").write_text(site_seo.sitemap_xml(), encoding="utf-8")
(SITE / "llms.txt").write_text(site_seo.llms_txt(seo_cat, pages), encoding="utf-8")
pages["404.html"] = fill("404.html", common)
for kind in ("terminos", "privacidad"):
    pages[f"{kind}.html"] = site_chrome(site_legal.page(lambda t, v: fill(t, {**common, **v}), kind), kind)

for name, html in pages.items():
    html = linkfix(html)
    (SITE / name).write_text(html, encoding="utf-8")
    print(f"site/{name}  {len(html.encode()) // 1024} KB")

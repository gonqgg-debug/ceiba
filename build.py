#!/usr/bin/env python3
"""Arma las páginas de site/ a partir de las plantillas de src/.

Las tres páginas comparten estilos, el logo, las maquetas de la clínica
(Actual / Propuesta), el comparador y los formularios. La fuente de todo eso
es src/home.html; las otras plantillas los reciben con marcadores {{...}}.

Uso:  python3 build.py
"""
from pathlib import Path

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
chat_start = home.index('<div class="chat" aria-label')
industry = {
    "{{SCRIPT}}": home[home.rindex("<script>") + 8:home.rindex("</script>")],
    "{{CMP_SECTION}}": cut('<section class="band band--light section" id="antes-despues"', "</section>"),
    "{{CHAT}}": home[chat_start:home.index("\n  </div>\n</section>", chat_start)],
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
         '<meta name="theme-color" content="#0B1514">\n' + home)

pages = {
    "index.html": index,
    "webs-clinicas.html": fill("webs-clinicas.html", {**shared, **industry}),
    "diagnostico.html": fill("diagnostico.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "admin.html": fill("admin.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
    "gracias.html": fill("gracias.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"]}),
}
# Vista previa en pantalla completa (/vista/[slug]): CSS de la portada nueva,
# la plantilla como módulo para el navegador y los símbolos para el servidor.
mock_css = home[home.index("/* ===================== MOCK: PROPUESTA"):home.index("/* markers on the mock")]
root_vars = home[home.index(":root{"):home.index("}", home.index(":root{")) + 1]
(SITE / "assets").mkdir(exist_ok=True)
(SITE / "assets" / "clinica.css").write_text(
    "/* Generado por build.py a partir de src/home.html. No editar. */\n" + root_vars +
    "\n*,*::before,*::after{box-sizing:border-box}\n@keyframes blink{50%{opacity:.25}}\n" + mock_css, encoding="utf-8")
(SITE / "assets" / "tpl-clinica.js").write_text((ROOT / "lib/templates/clinica.js").read_text(encoding="utf-8"), encoding="utf-8")
(SITE / "assets" / "vista.js").write_text((SRC / "assets/vista.js").read_text(encoding="utf-8"), encoding="utf-8")
(ROOT / "lib" / "generated").mkdir(exist_ok=True)
import json
# Propuesta privada: plantilla con marcadores {{P_...}} que llena lib/render-proposal.js
import re
proposal = fill("propuesta.html", {"{{BASE_CSS}}": shared["{{BASE_CSS}}"], "{{SYMBOLS}}": shared["{{SYMBOLS}}"], "{{CMP_JS}}": cmp_js, "{{HOME}}": "/"})
absolute = lambda t: re.sub(r'(["\'(])(img/|favicon|apple-touch-icon)', r'\1/\2', t)
(ROOT / "lib" / "generated" / "shared.js").write_text(
    "// Generado por build.py a partir de src/. No editar.\n"
    "export const SYMBOLS = " + json.dumps(shared["{{SYMBOLS}}"], ensure_ascii=False) + ";\n"
    "export const TEMPLATES = " + json.dumps(absolute(shared["{{TEMPLATES}}"]), ensure_ascii=False) + ";\n"
    "export const PROPOSAL_HTML = " + json.dumps(absolute(proposal), ensure_ascii=False) + ";\n", encoding="utf-8")

# Copia estática de la propuesta de ejemplo (la misma que sirve /p/clinica-arrayan)
import subprocess
subprocess.run(["node", str(ROOT / "scripts/render-static.mjs")], check=True)

for name, html in pages.items():
    (SITE / name).write_text(html, encoding="utf-8")
    print(f"site/{name}  {len(html.encode()) // 1024} KB")

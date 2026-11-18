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
         '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + home)

pages = {
    "index.html": index,
    "propuesta-clinica-arrayan.html": fill("propuesta.html", {**shared, "{{CMP_JS}}": cmp_js, "{{HOME}}": "index.html"}),
    "webs-clinicas.html": fill("webs-clinicas.html", {**shared, **industry}),
}
for name, html in pages.items():
    (SITE / name).write_text(html, encoding="utf-8")
    print(f"site/{name}  {len(html.encode()) // 1024} KB")

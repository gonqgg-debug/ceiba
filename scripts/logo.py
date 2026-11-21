#!/usr/bin/env python3
"""Logo de Ceiba Labs: la gota (el «orb») y la palabra «Ceiba Labs» en Funnel Display.

La palabra va convertida en trazos para que se vea igual aunque la fuente no cargue.
Genera:
  - el <symbol id="ceiba-logo"> que usan todas las páginas (se escribe dentro de src/home.html)
  - marca/ceiba-logo.svg (claro sobre oscuro), marca/ceiba-logo-oscuro.svg, marca/ceiba-icono.svg
  - site/favicon.svg
Uso: python3 scripts/logo.py <carpeta con funnel-300.ttf y funnel-600.ttf>
Requiere fontTools (pip install fonttools). Fuente: Funnel Display, licencia OFL.
"""
import re
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "scripts/fonts")
VB_H = 54  # alto del lienzo; el ancho sale del contenido (build() lo calcula)


def word(font_file, text, x0, size, tracking):
    """Trazos de `text` con la base en y=0 (hacia arriba negativo), desde x0. Devuelve (d, ancho)."""
    f = TTFont(font_file)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    k = size / upm
    pen, x = SVGPathPen(gs), x0
    for ch in text:
        g = cmap[ord(ch)]
        TransformPen_ = TransformPen(pen, (k, 0, 0, -k, x, 0))
        gs[g].draw(TransformPen_)
        x += gs[g].width * k + tracking * size
    return pen.getCommands(), x - x0 - tracking * size


def orb(prefix, cx, cy, r):
    """La gota: degradado de la marca, una mancha violeta y un brillo, recortados al círculo."""
    p = prefix
    return f'''<defs>
    <linearGradient id="{p}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6E8BFF"/><stop offset="1" stop-color="#2747E8"/></linearGradient>
    <radialGradient id="{p}l" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#D6FA52"/><stop offset=".55" stop-color="#D6FA52" stop-opacity=".55"/><stop offset="1" stop-color="#D6FA52" stop-opacity="0"/></radialGradient>
    <radialGradient id="{p}v" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7B5CFF" stop-opacity=".95"/><stop offset="1" stop-color="#7B5CFF" stop-opacity="0"/></radialGradient>
    <radialGradient id="{p}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="{p}s" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="#081036" stop-opacity="0"/><stop offset="1" stop-color="#081036" stop-opacity=".3"/></radialGradient>
    <clipPath id="{p}c"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>
  </defs>
  <g clip-path="url(#{p}c)">
    <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{p}g)"/>
    <circle cx="{cx - r * .42}" cy="{cy - r * .46}" r="{r * .95}" fill="url(#{p}l)"/>
    <circle cx="{cx + r * .38}" cy="{cy + r * .42}" r="{r * .85}" fill="url(#{p}v)"/>
    <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{p}s)"/>
    <circle cx="{cx - r * .34}" cy="{cy - r * .38}" r="{r * .42}" fill="url(#{p}h)"/>
  </g>'''


def build():
    # Proporción del encabezado del sitio: la gota mide ~1.7 veces la altura de mayúscula
    size = 37.0                       # cuerpo de la letra; altura de mayúscula = 0.81 em = 30
    d1, w1 = word(FONTS / "funnel-600.ttf", "Ceiba", 0, size, -0.03)
    d2, w2 = word(FONTS / "funnel-300.ttf", "Labs", 0, size, -0.02)
    r, orb_gap, gap = 25.0, 13.0, size * .2
    base = 27 + 0.81 * size / 2       # centra la altura de mayúscula en el lienzo
    tx1 = 2 * r + 1 + orb_gap
    tx2 = tx1 + w1 + gap
    width = round(tx2 + w2 + 1, 2)
    text = (f'<path transform="translate({tx1:.2f} {base:.2f})" d="{d1}"/>'
            f'<path transform="translate({tx2:.2f} {base:.2f})" d="{d2}" opacity=".72"/>')
    return text, orb("clg-", r + .5, 27, r), width


def main():
    text, o, VB_W = build()
    symbol = f'<symbol id="ceiba-logo" viewBox="0 0 {VB_W} {VB_H}">{o}<g fill="currentColor">{text}</g></symbol>'
    home = ROOT / "src/home.html"
    h = home.read_text(encoding="utf-8")
    h2 = re.sub(r'<symbol id="ceiba-logo"[\s\S]*?</symbol>', lambda m: symbol, h, count=1)
    assert h2 != h or symbol in h
    home.write_text(h2, encoding="utf-8")

    marca = ROOT / "marca"; marca.mkdir(exist_ok=True)
    for name, color in [("ceiba-logo.svg", "#FFFFFF"), ("ceiba-logo-oscuro.svg", "#081036")]:
        (marca / name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VB_W} {VB_H}" role="img" aria-label="Ceiba Labs">{o.replace("clg-", "m-")}<g fill="{color}">{text}</g></svg>\n', encoding="utf-8")
    icon = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Ceiba Labs"><rect width="100" height="100" rx="24" fill="#081036"/>{orb("i-", 50, 50, 31)}</svg>\n'
    (marca / "ceiba-icono.svg").write_text(icon, encoding="utf-8")
    (ROOT / "site/favicon.svg").write_text(icon, encoding="utf-8")
    # Todas las páginas que usan el símbolo declaran el mismo lienzo en su <svg>: se actualiza
    for f in [*(ROOT / "src").glob("*.html"), ROOT / "build.py", ROOT / "scripts/og-images.py"]:
        if not f.exists(): continue
        t = f.read_text(encoding="utf-8")
        t2 = re.sub(r'viewBox="0 0 [0-9.]+ 54"', f'viewBox="0 0 {VB_W} 54"', t)
        if t2 != t: f.write_text(t2, encoding="utf-8")
    print("logo listo:", VB_W, "x", VB_H)


if __name__ == "__main__":
    main()

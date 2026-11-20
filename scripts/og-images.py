#!/usr/bin/env python3
"""Imágenes para compartir (Open Graph, 1200x630) de las páginas públicas de Ceiba.
Uso: python3 scripts/og-images.py  ->  site/img/og/<nombre>.jpg
Fuentes (OFL): scripts/fonts/serif.ttf (Instrument Serif) y geist.ttf (Geist 500)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site/img/og"; OUT.mkdir(parents=True, exist_ok=True)
W, H = 1200, 630
NAVY, LIME, IVORY = (20, 36, 107), (214, 250, 82), (247, 245, 239)
SERIF = str(ROOT / "scripts/fonts/serif.ttf"); SANS = str(ROOT / "scripts/fonts/geist.ttf")

PAGES = {
    "inicio": ("Implementamos la tecnología que hace crecer tu negocio.", "Páginas web, WhatsApp e inteligencia artificial"),
    "webs": ("Páginas web listas para Google y la inteligencia artificial.", "Por suscripción · Te la mostramos antes de pagar"),
    "clinicas": ("Páginas web para clínicas y consultorios.", "Más citas desde Google, WhatsApp y la IA"),
    "ia": ("Inteligencia artificial aplicada a cómo trabaja tu negocio.", "Asistentes, agentes y automatización de procesos"),
}

def base():
    sky = Image.open(ROOT / "site/img/hero-cielo.jpg").convert("RGB")
    sky = sky.resize((W, int(sky.height * W / sky.width)))
    top = (sky.height - H) // 3
    img = sky.crop((0, top, W, top + H))
    shade = Image.new("RGB", (W, H), NAVY)
    mask = Image.linear_gradient("L").rotate(90).resize((W, H))  # izquierda opaca -> derecha clara
    mask = mask.point(lambda v: int(70 + v * 0.62))
    return Image.composite(shade, img, mask)

def wrap(draw, text, font, width):
    lines, line = [], ""
    for w in text.split():
        t = (line + " " + w).strip()
        if draw.textlength(t, font=font) <= width: line = t
        else: lines.append(line); line = w
    return lines + [line]

logo = Image.open(ROOT / "marca/ceiba-logo-transparente.png").convert("RGBA")
logo = logo.resize((300, int(logo.height * 300 / logo.width)))
for name, (title, sub) in PAGES.items():
    img = base(); d = ImageDraw.Draw(img)
    img.paste(logo, (72, 64), logo)
    size = 74
    while True:
        f = ImageFont.truetype(SERIF, size); lines = wrap(d, title, f, 780)
        if len(lines) <= 3 or size <= 54: break
        size -= 4
    y = 600 - 64 - 46 - 18 - len(lines) * int(size * 1.08)
    for ln in lines:
        d.text((72, y), ln, font=f, fill=IVORY); y += int(size * 1.08)
    d.text((72, y + 18), sub, font=ImageFont.truetype(SANS, 30), fill=LIME)
    img.save(OUT / f"{name}.jpg", quality=86, optimize=True, progressive=True)
    print(OUT / f"{name}.jpg")

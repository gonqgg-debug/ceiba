# Versiones chicas de las miniaturas de plantillas (640x400) para /estilos, /empezar y el muro de /webs.
# Uso: python3 scripts/plantillas-thumbs.py  (después de node scripts/plantillas-shots.cjs)
from pathlib import Path
from PIL import Image
src = Path(__file__).resolve().parent.parent / "site/plantillas/img"
out = src / "s"; out.mkdir(exist_ok=True)
for f in sorted(src.glob("*.jpg")):
    im = Image.open(f).convert("RGB"); im.thumbnail((640, 400), Image.LANCZOS)
    im.save(out / f.name, quality=72, optimize=True, progressive=True)
print("miniaturas chicas:", len(list(out.glob("*.jpg"))))

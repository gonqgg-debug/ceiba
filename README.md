# Ceiba Labs · sitio web

Prototipo en alta fidelidad del sitio de Ceiba Labs, estudio digital para negocios de Latinoamérica. Son tres páginas estáticas en español, sin dependencias, que funcionan en escritorio y móvil.

| Página | Archivo | Ruta prevista en el sitemap |
|---|---|---|
| Inicio | `site/index.html` | `/` |
| Webs para clínicas | `site/webs-clinicas.html` | `/webs/clinicas` |
| Propuesta privada de ejemplo | `site/propuesta-clinica-arrayan.html` | `/p/[negocio]` |

Clínica Dental Arrayán y la Dra. Valeria Ríos son ficticias. Sirven como concepto de rediseño y la página lo indica.

## Ver el sitio

```bash
python3 -m http.server 8000 --directory site
```

Después abre http://localhost:8000.

## Editar

Las tres páginas comparten estilos, el logo, las maquetas de la clínica (Actual y Propuesta), el comparador y los formularios. La fuente de todo eso es `src/home.html`. Las otras plantillas reciben esos bloques con marcadores `{{...}}`.

1. Edita la plantilla que corresponda en `src/`.
2. Ejecuta `python3 build.py`.
3. Revisa `site/` y haz commit de `src/` y `site/` juntos.

No edites `site/*.html` a mano: `build.py` los sobrescribe.

```
src/home.html            Inicio y fuente de los bloques compartidos
src/propuesta.html       Propuesta privada (plan + módulo, total, activar, agendar)
src/webs-clinicas.html   Página de industria: Clínicas
site/                    Sitio generado, listo para publicar
site/img/                Fotos del concepto, generadas con Gamma
brand/                   Logo y símbolo de Ceiba (petróleo, negro y lima)
build.py                 Arma site/ a partir de src/
```

## Marca

- Colores: verde casi negro `#0B1514`, petróleo `#103D37`, marfil `#F7F4EB` y lima `#D6FA52`. El lima se reserva para la acción principal y los estados interactivos.
- Tipografías (Google Fonts): Funnel Display para titulares, Geist para el texto y Geist Mono para datos. La clínica del concepto usa Instrument Serif.
- El logo se usa con su forma y proporciones originales. En el sitio va en línea con `fill="currentColor"`, para usarlo en marfil sobre fondo oscuro.

## Precios

Son precios de lanzamiento para probar en México, en MXN y con IVA incluido. Falta confirmar si las cifras ya incluyen el IVA.

| | Activación | Mensualidad |
|---|---|---|
| Web Esencial | $3,490 | $1,490 |
| Web Negocio | $5,490 | $2,490 |
| Web Avanzado | $8,490 | $3,990 |
| Recepción por WhatsApp (módulo) | $3,990 | $1,490 |
| Automatización a medida | Diagnóstico $3,900, acreditable | Piloto desde $19,900 |

## Qué es prototipo y qué no

- **Revisión de URL:** valida la dirección, pero el servicio de auditoría no está conectado. No muestra resultados para URLs reales. Si escribes `clinicaarrayan.mx`, abre el diagnóstico de ejemplo.
- **Formularios:** el de diagnóstico, la activación y la agenda de 15 minutos validan los datos, pero no envían nada ni cobran.
- **Páginas del sitemap sin construir:** `/ia`, `/precios`, `/trabajo`, `/nosotros`, `/contacto`, las demás industrias y las páginas legales. Sus enlaces muestran un aviso con la ruta.
- **Archivos planos:** las páginas están en archivos planos dentro de `site/`. Para usar las rutas definitivas (`/webs/clinicas`, `/p/[negocio]`), hay que ajustar los enlaces relativos y las rutas de `img/`.

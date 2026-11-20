"""SEO y visibilidad en IA de ceibalabs.io (lo usa build.py).

Cada página pública recibe: título y descripción afinados, canónico, Open Graph y Twitter,
y un grafo JSON-LD (Organization, WebSite, WebPage, BreadcrumbList, Service con precios del
catálogo y FAQPage armado con las preguntas que la página ya muestra). También genera
robots.txt, sitemap.xml y llms.txt. Fuente de precios: lib/catalog.js (vía build.py).
"""
import html as _html
import json
import re
from datetime import date

SITE = "https://www.ceibalabs.io"
ORG = f"{SITE}/#organization"
WEBSITE = f"{SITE}/#website"
NAME = "Ceiba Labs"
# Perfiles públicos de Ceiba (LinkedIn, Instagram, Google Business Profile…). Agregar aquí cuando existan:
SAME_AS: list[str] = []

PAGES = {
    "index.html": {
        "path": "/", "og": "inicio",
        "title": "Ceiba Labs · Páginas web, WhatsApp e IA para negocios",
        "description": "Estudio digital que implementa la tecnología que hace crecer tu negocio: páginas web optimizadas para Google y la IA, asistentes de WhatsApp y automatización.",
        "crumbs": [],
    },
    "webs.html": {
        "path": "/webs", "og": "webs",
        "title": "Páginas web optimizadas para Google y la IA · Ceiba Labs",
        "description": "Tu página web lista para Google y ChatGPT, por suscripción desde $1,490 al mes: diseño, hosting, SEO y cambios incluidos. Te la mostramos antes de pagar.",
        "crumbs": [("Páginas web", "/webs")],
    },
    "webs-clinicas.html": {
        "path": "/webs/clinicas", "og": "clinicas",
        "title": "Páginas web para clínicas y consultorios · Ceiba Labs",
        "description": "Páginas web para clínicas dentales, consultorios y especialistas: más citas desde Google, WhatsApp y la IA, con precios claros y datos listos para buscadores.",
        "crumbs": [("Páginas web", "/webs"), ("Clínicas y consultorios", "/webs/clinicas")],
    },
    "ia.html": {
        "path": "/ia", "og": "ia",
        "title": "IA y automatización para negocios · Ceiba Labs",
        "description": "Asistentes de WhatsApp con IA, agentes que hacen el trabajo repetitivo y automatización de procesos. Empezamos por un problema concreto y medimos el resultado.",
        "crumbs": [("Inteligencia artificial", "/ia")],
    },
}


def _strip(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", _html.unescape(s)).strip()


def faqs(page_html):
    """Preguntas y respuestas visibles en la página (<details><summary>…)."""
    out = []
    # Acordeón de /webs y /webs/clinicas: <button class="faq-q">…</button> + <div class="faq-a">…</div>
    for m in re.finditer(r'class="faq-q"[^>]*>([\s\S]*?)<span class="pm"[\s\S]*?class="faq-a"[^>]*>([\s\S]*?)</div></div>', page_html):
        q, a = _strip(m.group(1)), _strip(m.group(2))
        if q and a and len(a) > 20:
            out.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}})
    for m in re.finditer(r"<details(?![^>]*more-changes)[^>]*>\s*<summary[^>]*>([\s\S]*?)</summary>([\s\S]*?)</details>", page_html):
        q, a = _strip(m.group(1)), _strip(m.group(2))
        if q and a and len(a) > 20:
            out.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}})
    return out


def _price(amount, cur="MXN", name=None, monthly=False):
    p = {"@type": "UnitPriceSpecification", "price": amount, "priceCurrency": cur}
    if name:
        p["name"] = name
    if monthly:
        p.update({"unitCode": "MON", "referenceQuantity": {"@type": "QuantitativeValue", "value": 1, "unitCode": "MON"}})
    return p


def _web_offers(cat):
    plans = cat["plans"]
    return [{
        "@type": "Offer",
        "name": p["name"],
        "description": p["description"],
        "price": p["monthly"], "priceCurrency": "MXN",
        "priceSpecification": [_price(p["monthly"], name="Mensualidad", monthly=True), _price(p["activation"], name="Pago inicial")],
        "availability": "https://schema.org/InStock",
        "url": f"{SITE}/webs#precios",
        "seller": {"@id": ORG},
    } for p in plans.values()]


def _service(sid, name, desc, service_type, offers=None, audience=None, url=None):
    s = {"@type": "Service", "@id": sid, "name": name, "description": desc, "serviceType": service_type,
         "provider": {"@id": ORG}, "areaServed": {"@type": "Place", "name": "México y Latinoamérica"},
         "availableChannel": {"@type": "ServiceChannel", "serviceUrl": url or SITE, "availableLanguage": "es"}}
    if offers:
        s["offers"] = offers
    if audience:
        s["audience"] = {"@type": "BusinessAudience", "audienceType": audience}
    return s


def graph(key, page_html, cat):
    cfg = PAGES[key]
    url = SITE + cfg["path"]
    og = f"{SITE}/img/og/{cfg['og']}.jpg"
    org = {
        "@type": "Organization", "@id": ORG, "name": NAME, "legalName": "GQG Holdings LLC", "url": SITE + "/",
        "logo": {"@type": "ImageObject", "url": f"{SITE}/img/ceiba-icono.png", "width": 512, "height": 512},
        "image": f"{SITE}/img/og/inicio.jpg",
        "description": "Estudio digital que diseña, publica y mantiene páginas web por suscripción y aplica inteligencia artificial en negocios: asistentes de WhatsApp, agentes y automatización de procesos.",
        "slogan": "Implementamos la tecnología que hace crecer tu negocio.",
        "knowsLanguage": "es",
        "knowsAbout": ["Diseño de páginas web", "SEO", "Optimización para buscadores de inteligencia artificial (GEO)",
                       "Datos estructurados", "Asistentes de WhatsApp con IA", "Automatización de procesos", "Agentes de IA"],
        "areaServed": {"@type": "Place", "name": "México y Latinoamérica"},
        "address": {"@type": "PostalAddress", "addressCountry": "US"},
    }
    if SAME_AS:
        org["sameAs"] = SAME_AS
    nodes = [org, {"@type": "WebSite", "@id": WEBSITE, "url": SITE + "/", "name": NAME, "inLanguage": "es", "publisher": {"@id": ORG}}]
    webpage = {"@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": cfg["title"], "description": cfg["description"],
               "inLanguage": "es", "isPartOf": {"@id": WEBSITE}, "about": {"@id": ORG},
               "primaryImageOfPage": {"@type": "ImageObject", "url": og, "width": 1200, "height": 630},
               "dateModified": date.today().isoformat()}
    if cfg["crumbs"]:
        items = [("Inicio", "/")] + cfg["crumbs"]
        nodes.append({"@type": "BreadcrumbList", "@id": f"{url}#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + p} for i, (n, p) in enumerate(items)]})
        webpage["breadcrumb"] = {"@id": f"{url}#breadcrumb"}

    web = _service(f"{SITE}/webs#servicio", "Páginas web por suscripción",
                   "Diseñamos, publicamos y mantenemos tu página web por una mensualidad fija, con hosting, SEO base, optimización para buscadores de IA y cambios incluidos. Te mostramos tu página antes de pagar.",
                   "Diseño y mantenimiento de páginas web", _web_offers(cat), url=f"{SITE}/webs")
    wa, diag, pilot = cat["whatsapp"], cat["diagnostico"], cat["piloto"]
    whatsapp = _service(f"{SITE}/ia#whatsapp", wa["name"], wa["description"], "Asistente de WhatsApp con inteligencia artificial", [{
        "@type": "Offer", "name": wa["name"], "price": wa["monthly"], "priceCurrency": "MXN", "seller": {"@id": ORG},
        "priceSpecification": [_price(wa["monthly"], name="Mensualidad", monthly=True), _price(wa["activation"], name="Pago inicial")]}], url=f"{SITE}/ia")
    diagnostico = _service(f"{SITE}/ia#diagnostico", diag["name"], diag["description"], "Consultoría de inteligencia artificial", [{
        "@type": "Offer", "name": diag["name"], "price": diag["amount"], "priceCurrency": "MXN", "seller": {"@id": ORG}}], url=f"{SITE}/ia")
    piloto = _service(f"{SITE}/ia#piloto", pilot["name"], pilot["description"], "Implementación de agentes de IA y automatización", [{
        "@type": "Offer", "name": pilot["name"], "seller": {"@id": ORG},
        "priceSpecification": {"@type": "PriceSpecification", "minPrice": pilot["from"], "priceCurrency": "MXN"}}], url=f"{SITE}/ia")

    if key == "index.html":
        org["hasOfferCatalog"] = {"@type": "OfferCatalog", "name": "Servicios de Ceiba Labs", "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@id": s["@id"]}} for s in (web, whatsapp, diagnostico, piloto)]}
        nodes += [web, whatsapp, diagnostico, piloto]
    elif key == "webs.html":
        nodes.append(web); webpage["mainEntity"] = {"@id": web["@id"]}
    elif key == "webs-clinicas.html":
        clin = _service(f"{SITE}/webs/clinicas#servicio", "Páginas web para clínicas y consultorios",
                        "Páginas web por suscripción para clínicas dentales, consultorios médicos y especialistas: citas desde Google, WhatsApp y la IA, tratamientos con precios y datos estructurados para buscadores.",
                        "Diseño de páginas web para clínicas", _web_offers(cat), audience="Clínicas, consultorios y especialistas de la salud", url=f"{SITE}/webs/clinicas")
        nodes.append(clin); webpage["mainEntity"] = {"@id": clin["@id"]}
    elif key == "ia.html":
        nodes += [whatsapp, diagnostico, piloto]
    q = faqs(page_html)
    if q:
        nodes.append({"@type": "FAQPage", "@id": f"{url}#faq", "url": url, "inLanguage": "es", "isPartOf": {"@id": WEBSITE}, "mainEntity": q})
    nodes.insert(2, webpage)
    return {"@context": "https://schema.org", "@graph": nodes}


def head(key, page_html, cat):
    cfg = PAGES[key]
    url = SITE + cfg["path"]
    og = f"{SITE}/img/og/{cfg['og']}.jpg"
    e = lambda s: _html.escape(s, quote=True)
    ld = json.dumps(graph(key, page_html, cat), ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    return "\n".join([
        f"<title>{e(cfg['title'])}</title>",
        f'<meta name="description" content="{e(cfg["description"])}">',
        f'<link rel="canonical" href="{url}">',
        '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{NAME}">',
        '<meta property="og:locale" content="es_LA">',
        f'<meta property="og:title" content="{e(cfg["title"])}">',
        f'<meta property="og:description" content="{e(cfg["description"])}">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:image" content="{og}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{e(cfg["title"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{e(cfg["title"])}">',
        f'<meta name="twitter:description" content="{e(cfg["description"])}">',
        f'<meta name="twitter:image" content="{og}">',
        f'<script type="application/ld+json">{ld}</script>',
    ])


def apply(key, page_html, cat):
    """Quita título/descripción existentes e inserta el bloque SEO después del viewport."""
    page_html = re.sub(r"<title>[\s\S]*?</title>\s*", "", page_html, count=1)
    page_html = re.sub(r'<meta name="description"[^>]*>\s*', "", page_html, count=1)
    m = re.search(r'<meta name="viewport"[^>]*>', page_html)
    assert m, key
    return page_html[:m.end()] + "\n" + head(key, page_html, cat) + page_html[m.end():]


def robots_txt():
    ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot",
          "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User"]
    private = ["/admin", "/api/", "/cuenta", "/vista/", "/p/", "/gracias", "/maqueta", "/diagnostico"]
    block = "".join(f"Disallow: {p}\n" for p in private)
    out = "# Ceiba Labs. Los buscadores y asistentes de IA son bienvenidos: las páginas públicas están para leerse y citarse.\n\n"
    out += "".join(f"User-agent: {b}\n" for b in ai) + "Allow: /\n" + block + "\n"
    out += "User-agent: *\nAllow: /\n" + block + f"\nSitemap: {SITE}/sitemap.xml\n"
    return out


def sitemap_xml():
    today = date.today().isoformat()
    pri = {"/": "1.0", "/webs": "0.9", "/webs/clinicas": "0.8", "/ia": "0.8"}
    urls = "".join(
        f"  <url><loc>{SITE}{c['path']}</loc><lastmod>{today}</lastmod><priority>{pri[c['path']]}</priority>"
        f"<image:image><image:loc>{SITE}/img/og/{c['og']}.jpg</image:loc></image:image></url>\n"
        for c in PAGES.values())
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
            'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' + urls + "</urlset>\n")


def llms_txt(cat, pages_html):
    """Resumen para asistentes de IA (formato llmstxt.org), con precios y preguntas frecuentes reales."""
    money = lambda n: f"${n:,.0f} MXN"
    plans = "\n".join(f"- {p['name']}: {money(p['activation'])} de pago inicial y {money(p['monthly'])} al mes. {p['description']}" for p in cat["plans"].values())
    wa, diag, pilot = cat["whatsapp"], cat["diagnostico"], cat["piloto"]
    faq_md = ""
    for key, title in [("index.html", "Generales"), ("webs.html", "Páginas web"), ("ia.html", "Inteligencia artificial")]:
        qs = faqs(pages_html.get(key, ""))
        if qs:
            faq_md += f"\n### {title}\n" + "\n".join(f"- **{q['name']}** {q['acceptedAnswer']['text']}" for q in qs) + "\n"
    return f"""# Ceiba Labs

> Ceiba Labs es un estudio digital que implementa la tecnología que hace crecer a los negocios: diseña, publica y mantiene páginas web por suscripción, optimizadas para Google y para buscadores de inteligencia artificial, y aplica IA en la operación (asistentes de WhatsApp, agentes que hacen trabajo repetitivo y automatización de procesos). Atiende a negocios de México y Latinoamérica, en español, a distancia.

Datos clave:
- Antes de pagar, el negocio recibe una propuesta gratis con su nueva página ya diseñada para que la vea.
- Las páginas incluyen diseño, hosting, mantenimiento, SEO base, datos estructurados, optimización para buscadores de IA y minutos de cambios al mes.
- Después de pagar, un asistente de IA reúne los materiales del negocio (logo, fotos, datos, dominio) y el equipo construye y publica la página.
- Precios finales en pesos mexicanos (también se cotiza en dólares).

## Páginas web
- [Páginas web por suscripción]({SITE}/webs): planes, qué incluye cada uno y cómo optimizamos para Google y la IA.
- [Páginas web para clínicas y consultorios]({SITE}/webs/clinicas): versión para clínicas dentales, consultorios y especialistas.

### Planes
{plans}
- Complemento {wa['name']}: {money(wa['activation'])} de pago inicial y {money(wa['monthly'])} al mes. {wa['description']}

## Inteligencia artificial y procesos
- [IA y automatización para negocios]({SITE}/ia): asistentes, agentes, automatización y cómo trabajamos.
- {diag['name']}: {money(diag['amount'])}. {diag['description']}
- {pilot['name']}: desde {money(pilot['from'])}. {pilot['description']}

## Empezar
- [Propuesta gratis]({SITE}/webs#diagnostico): el negocio deja su página actual (o sus datos) y recibe su propuesta con la página nueva.
- [Consultoría]({SITE}/#consultoria): para proyectos de procesos e IA a la medida.

## Preguntas frecuentes
{faq_md}"""

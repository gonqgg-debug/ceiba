# Customer journey de Ceiba Labs (Google y asistentes de IA)

Cómo encuentra, compara y elige a Ceiba un dueño de negocio en México y Latinoamérica, en las 5 etapas de conciencia. Hecho con el skill `customer-journey` (ver `.claude/skills/ceiba-seo`). Las preguntas están escritas como las teclea la gente, no como lista de palabras clave. Las que se usan para medir si la IA nos recomienda están en `ops/seo/preguntas-ceiba.json`.

**A quién le hablamos**
- **A. Negocio que atiende y vende** (clínica, consultorio, restaurante, café, hotel, inmobiliaria, despacho, estética, taller): quiere más clientes, hoy vive de Instagram, WhatsApp y recomendaciones; o tiene una página vieja que no le trae nada. Decide el dueño, casi siempre desde el celular.
- **B. Negocio con operación** (distribuidora, tienda, empresa de servicios con equipo): pierde tiempo contestando WhatsApp, capturando pedidos, cotizando o persiguiendo pagos. Le interesa la IA, pero desconfía.

**Lo que aprendimos al investigar**
- Cuando alguien pregunta cuánto cuesta una página web, los primeros resultados son de proveedores de hosting y constructores (GoDaddy, Hostinger, Tiendanube, Neolo) con rangos muy amplios y precios promocionales. Casi nadie responde con una mensualidad todo incluido ni enseña la página antes de cobrar: ese es nuestro espacio.
- Para recomendaciones locales, ChatGPT se apoya mucho en el perfil de Google (calificación y número de reseñas), en el índice de Bing, en directorios y en listas de «los mejores» de medios locales. La página propia ayuda cuando tiene ubicación, horario, servicios y preguntas frecuentes claras.

---

## 1. Sin conciencia (no sabe que tiene un problema)

**Qué piensa:** «Me va bien con Instagram y con la gente que me recomienda.» No relaciona que bajen las citas o las mesas con que no lo encuentran. Pregunta por síntomas, no por páginas web.

**Lo que escribe en Google o en ChatGPT**
- «¿Por qué tengo menos pacientes este año si el consultorio está igual?»
- «Cómo conseguir más clientes para mi restaurante sin pagar anuncios»
- «¿Vale la pena tener página web si ya tengo Instagram?»
- «Mis clientes me escriben a las 11 de la noche, ¿cómo le hago para contestar?»
- «Ideas para que más gente conozca mi negocio en mi colonia»

**Qué contenido hace falta**
- Guías cortas que respondan el síntoma y lleven a la causa: «Instagram o página web: qué necesita tu negocio en 2026» y «Cómo te encuentran tus clientes hoy (y por qué cada vez más le preguntan a la IA)».
- El argumento de la sección «Tus clientes ya no buscan. Preguntan.» del inicio, convertido en una guía que se pueda citar.
- Formato: texto que responda en las primeras 40 palabras, más un video corto para Instagram y TikTok mostrando una búsqueda real en ChatGPT donde el negocio no aparece.

## 2. Consciente del problema (sabe que le cuesta clientes)

**Qué piensa:** «No me encuentran en Google» o «la competencia sale y yo no». Busca qué hacer, todavía sin elegir cómo.

**Lo que escribe**
- «Cómo aparecer en Google cuando buscan dentista cerca»
- «¿Cómo hago que ChatGPT recomiende mi negocio?»
- «Por qué mi negocio no sale en Google Maps»
- «Cómo hacer que mis clientes reserven en línea sin una app»
- «Contestar WhatsApp automático para negocio, ¿se puede con IA?» (segmento B)

**Qué contenido hace falta**
- «Cómo aparecer en ChatGPT, Gemini y Google: guía para negocios locales», con lo que sí funciona (perfil de Google completo, reseñas, Bing Places, datos claros en la página, preguntas frecuentes) y el análisis gratis de `/diagnostico` como siguiente paso.
- «Cómo aparecer en Google Maps cuando buscan tu giro cerca».
- Para B: «Qué puede hacer un asistente de WhatsApp con IA (y qué no)», con lo que ya enseña `/ia`.
- Acción en cada guía: analizar su página gratis o empezar en `/empezar`.

## 3. Consciente de la solución (sabe que necesita una página o IA)

**Qué piensa:** «Necesito una página web, pero ¿la hago yo, pago a un freelance o a una agencia? ¿Cuánto cuesta?». Compara caminos y precios.

**Lo que escribe**
- «¿Cuánto cuesta una página web para un negocio en México?»
- «¿Qué es mejor, Wix o pagarle a alguien que me haga la página?»
- «Página web para consultorio dental, ¿qué debe tener?»
- «Página web por mensualidad o pago único, ¿qué conviene?»
- «¿Cuánto cobra una agencia por un asistente de WhatsApp con IA?» (B)

**Qué contenido hace falta**
- **«¿Cuánto cuesta una página web en México (y en cada país)?»**: la pregunta con más intención. Compara los tres caminos (hacerla tú con un constructor, freelance o agencia de pago único, suscripción todo incluido) con costos de verdad y nuestros planes con precio por país. Hoy los resultados son de hosting con precios promocionales; una respuesta honesta y completa tiene buenas probabilidades de que la IA la cite.
- «Wix, Squarespace o alguien que te la haga: qué conviene a un negocio que no tiene tiempo».
- «Qué debe tener la página de un [giro]»: una por giro, que crece junto con los 10 modelos (es la base de las páginas por giro).
- Para B: «Cuánto cuesta implementar IA en un negocio pequeño», con nuestro diagnóstico gratis.

## 4. Consciente del producto (ya conoce a Ceiba)

**Qué piensa:** «Me gustó lo de verla antes de pagar, pero ¿es confiable? ¿Qué incluye? ¿Hay letra chica?».

**Lo que escribe**
- «Ceiba Labs opiniones»
- «¿Ceiba Labs es confiable?»
- «Ceiba Labs precios»
- «¿Qué incluye el plan Negocio de Ceiba Labs?»
- «¿Puedo cancelar mi página de Ceiba Labs?»

**Qué contenido hace falta**
- Que la IA tenga hechos de Ceiba: `llms.txt` al día, preguntas frecuentes de `/webs` y del inicio (ya incluyen precio, cancelación, tiempos) y datos de la empresa (GQG Holdings LLC, Florida) en el JSON-LD.
- **Perfiles públicos** con el mismo nombre y descripción: perfil de Google, LinkedIn, Instagram, Bing Places. Sin ellos, «Ceiba Labs opiniones» no tiene qué mostrar.
- **Casos reales** cuando existan, con permiso del cliente: antes y después, y qué cambió. No publicar casos ni reseñas inventadas.
- La propuesta de ejemplo y `/empezar` como prueba: «ve cómo quedaría la tuya sin pagar».

## 5. Muy consciente (listo para decidir)

**Qué piensa:** «Ya quiero empezar. ¿Cómo le hago? ¿Cuánto tarda? ¿Qué necesito mandar?».

**Lo que escribe**
- «Ceiba Labs propuesta gratis»
- «Cómo empezar mi página con Ceiba Labs»
- «Ceiba Labs WhatsApp contacto»
- «¿En cuánto tiempo está lista mi página con Ceiba?»

**Qué contenido hace falta**
- `/empezar` y su conversación (ya existe), con el tiempo prometido claro: borrador al momento, versión completa en un día hábil.
- El botón del encabezado en todas las páginas y la frase «Solo pagas si decides publicarla».
- Después del pago: el chat de `/cuenta` guía los materiales. Medir cuántos llegan de cada etapa con las `utm` que ya guarda `/api/lead`.

---

## Brechas: qué construir primero

| Prioridad | Contenido | Etapa | Por qué |
|---|---|---|---|
| 1 | Perfil de Google, Bing Places, LinkedIn e Instagram de Ceiba, con el mismo nombre y descripción | 4 | Sin esto la IA no puede confirmar que existimos ni mostrar opiniones. Lo da de alta el equipo. |
| 2 | Guía «¿Cuánto cuesta una página web en México?» | 3 | La pregunta con más intención de compra, y hoy la responden proveedores de hosting con precios promocionales. |
| 3 | Guía «Cómo aparecer en ChatGPT, Gemini y Google» | 2 | Es nuestra promesa central y lleva directo al análisis gratis. |
| 4 | «Qué debe tener la página de un [giro]» por cada uno de los 10 modelos | 3 | Se construye junto con las páginas por giro; cada una es una puerta de entrada distinta. |
| 5 | «Wix o alguien que te la haga» | 3 | Comparación honesta que la IA cita cuando alguien duda entre hacerlo solo o pagar. |
| 6 | Guía de IA para negocios pequeños (segmento B) | 2-3 | Lleva al diagnóstico de IA de `/ia`. |

Formato para todas: respuesta directa en las primeras 40 palabras, encabezados en forma de pregunta del cliente, datos reales (sin cifras inventadas), una sección de preguntas frecuentes y una sola acción al final (analizar su página o empezar en `/empezar`). Cada guía es una página pública nueva: necesita su entrada en `site_seo.py` (`PAGES` y sitemap) y su ruta en `vercel.json`.

## Cómo medir

Correr las preguntas de `ops/seo/preguntas-ceiba.json` en ChatGPT, Gemini, Perplexity y Claude cada mes y anotar: si aparece Ceiba, en qué lugar, a quién recomiendan en su lugar y qué fuente citan. Lo que citan en vez de nosotros es la lista de lugares donde conviene aparecer (medios, directorios, listas).

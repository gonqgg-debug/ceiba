"""Términos y condiciones y aviso de privacidad de Ceiba Labs (los usa build.py).

Todo lo que cambia según la empresa está en LEGAL. Mientras READY sea False, las páginas se
generan con noindex y el pie sigue diciendo «muy pronto»: no publicamos compromisos legales
sin confirmar. Revisión recomendada por un abogado antes de READY = True.
"""
import html as _html

LEGAL = {
    "entity": "GQG Holdings LLC",
    "dba": "Ceiba Labs",
    "state": None,                  # estado de EE. UU. donde está constituida, ej. "Florida"
    "email": None,                  # contacto legal y de privacidad, ej. "hola@ceibalabs.io"
    "min_months": 0,                # permanencia mínima de la mensualidad (0 = sin permanencia)
    "refund": "before_preview",     # "before_preview" | "never" | "until_approval"
    "updated": "20 de noviembre de 2026",
}
READY = all(LEGAL[k] for k in ("state", "email"))

E = lambda s: _html.escape(str(s))


def _who():
    L = LEGAL
    state = f"constituida en el estado de {E(L['state'])}, Estados Unidos" if L["state"] else "constituida en Estados Unidos"
    return f"<b>{E(L['entity'])}</b>, sociedad de responsabilidad limitada {state}, que opera con el nombre comercial <b>{E(L['dba'])}</b> («Ceiba», «nosotros»)"


def _contact():
    return f'<a href="mailto:{E(LEGAL["email"])}">{E(LEGAL["email"])}</a>' if LEGAL["email"] else "el chat de tu cuenta o los medios de contacto de ceibalabs.io"


def terms_body():
    L = LEGAL
    m = L["min_months"]
    term = ("La mensualidad no tiene permanencia mínima: puedes cancelar cuando quieras." if not m else
            f"La mensualidad tiene una permanencia mínima de {m} meses contados desde la publicación de tu página; después continúa mes a mes y puedes cancelar cuando quieras. Si cancelas antes de cumplir ese mínimo, se cobran las mensualidades que falten para completarlo.")
    refund = {
        "before_preview": "El pago inicial se reembolsa completo si cancelas antes de que te enviemos la vista previa de tu página. Una vez enviada, el pago inicial ya no es reembolsable porque cubre el trabajo de diseño y construcción realizado.",
        "never": "El pago inicial no es reembolsable porque cubre el trabajo de diseño y construcción desde que empezamos.",
        "until_approval": "Si después de las rondas de cambios incluidas no apruebas tu página, puedes pedir el reembolso del pago inicial antes de aprobarla. Una vez aprobada o publicada, ya no es reembolsable.",
    }[L["refund"]]
    law = E(L["state"]) if L["state"] else "el estado de constitución de la empresa"
    return f"""
<p>Estos términos regulan el uso de ceibalabs.io y la contratación de los servicios de {_who()}. Al pedir una propuesta, pagar o usar nuestros servicios aceptas estos términos.</p>

<h2>1. Qué hacemos</h2>
<ul>
<li><b>Páginas web por suscripción:</b> diseñamos, publicamos y mantenemos la página de tu negocio a cambio de un pago inicial y una mensualidad. Incluye hosting, mantenimiento, SEO base, optimización para buscadores de inteligencia artificial y los minutos de cambios al mes de tu plan.</li>
<li><b>Asistente de WhatsApp:</b> complemento que responde en WhatsApp y en tu página con la información que apruebas.</li>
<li><b>Consultoría y proyectos de IA:</b> diagnósticos, agentes y automatizaciones, con alcance, precio y tiempos definidos en una propuesta por separado.</li>
</ul>
<p>Lo que incluye cada plan es lo que se describe en <a href="/webs#precios">ceibalabs.io/webs</a> o en tu propuesta al momento de contratar.</p>

<h2>2. Propuesta gratis</h2>
<p>La propuesta y su vista previa son gratis y no te obligan a nada. Tienen una vigencia indicada en la propia propuesta; después, los precios o el diseño pueden cambiar.</p>

<h2>3. Precios y pagos</h2>
<ul>
<li>Al activar tu página pagas el <b>pago inicial</b>. La <b>mensualidad</b> empieza a cobrarse el día que publicamos tu página y se renueva cada mes en la misma fecha.</li>
<li>Los cobros se hacen con la tarjeta que registres, a través de Stripe. Nosotros no guardamos los datos completos de tu tarjeta.</li>
<li>Se cobra en la moneda indicada en tu propuesta. Los precios publicados son el precio final; si alguna ley te obliga a pagar un impuesto adicional, te lo indicamos antes del pago.</li>
<li>Si un cobro falla, lo reintentamos y te avisamos. Si no se resuelve en 15 días, podemos suspender tu página hasta que se regularice el pago.</li>
<li>Podemos actualizar precios con al menos 30 días de aviso. El cambio aplica desde la siguiente mensualidad y puedes cancelar antes si no estás de acuerdo.</li>
</ul>

<h2>4. Duración, cancelación y reembolsos</h2>
<p>{term} Para cancelar, escríbenos desde el chat de tu cuenta o a {_contact()}. La cancelación aplica al terminar el periodo ya pagado y no hay reembolsos parciales de mensualidades.</p>
<p>{refund}</p>

<h2>5. Lo que nos das y de quién es cada cosa</h2>
<ul>
<li>Nos das logos, fotos, textos, precios, horarios y demás información de tu negocio, y garantizas que tienes derecho a usarlos y que son correctos. Nos autorizas a usarlos para construir, publicar y mantener tu página.</li>
<li><b>Tu dominio, tu marca y tu contenido son tuyos.</b> Si compramos el dominio por ti, se registra a tu nombre o te lo transferimos cuando lo pidas.</li>
<li>El diseño, la plantilla, el código y nuestras herramientas son de Ceiba. Mientras tu suscripción esté activa tienes una licencia para usarlos en tu página.</li>
<li>Si cancelas, tu página deja de publicarse al terminar el periodo pagado. Durante los 30 días siguientes puedes pedirnos una copia de tus textos e imágenes.</li>
<li>Podemos mencionar que tu página la hicimos nosotros (por ejemplo, en un portafolio), salvo que nos pidas lo contrario.</li>
</ul>

<h2>6. Cambios a tu página</h2>
<p>Cada plan incluye minutos de cambios al mes (30 en Esencial, 60 en Negocio y 120 en Avanzado). No se acumulan de un mes a otro. Los trabajos que excedan ese tiempo o el alcance del plan (secciones nuevas complejas, integraciones, rediseños) se cotizan aparte antes de hacerlos.</p>

<h2>7. Inteligencia artificial</h2>
<ul>
<li>Usamos inteligencia artificial para atenderte, reunir tus materiales y construir o cambiar tu página. Una persona del equipo revisa el trabajo antes de enviártelo.</li>
<li>Los asistentes y agentes que instalamos en tu negocio pueden equivocarse. Responden con la información que tú apruebas y te pasan lo que necesita una persona; las decisiones importantes las tomas tú.</li>
<li>No dan consejo médico, legal ni financiero. Si tu negocio es una clínica, el asistente no debe recibir ni dar información clínica de pacientes.</li>
<li>El Asistente de WhatsApp depende de las reglas y la disponibilidad de WhatsApp Business (Meta), incluidos sus requisitos de verificación y sus posibles costos por conversación.</li>
</ul>

<h2>8. SEO y visibilidad en IA</h2>
<p>Construimos tu página con las mejores prácticas para Google y los buscadores de IA, pero nadie controla sus resultados: no garantizamos posiciones, recomendaciones ni un número de visitas o clientes.</p>

<h2>9. Disponibilidad y proveedores</h2>
<p>Hacemos un esfuerzo razonable para que tu página esté siempre en línea, pero dependemos de proveedores (hosting, pagos, correo, inteligencia artificial, WhatsApp) y puede haber interrupciones o mantenimientos. No garantizamos una disponibilidad del 100%.</p>

<h2>10. Uso aceptable</h2>
<p>No puedes usar nuestros servicios para contenido ilegal, engañoso, que infrinja derechos de terceros, o para enviar spam. Podemos suspender o retirar una página que incumpla esto, avisándote cuando sea posible.</p>

<h2>11. Responsabilidad</h2>
<p>En la medida en que la ley lo permita: los servicios se prestan «tal cual»; no respondemos por daños indirectos, pérdida de ganancias, de datos o de oportunidades de negocio; y nuestra responsabilidad total por cualquier reclamo se limita a lo que nos hayas pagado en los 3 meses anteriores al hecho que lo origine. Tú respondes por el contenido que nos entregas y nos mantendrás libres de reclamos de terceros relacionados con él.</p>

<h2>12. Ley aplicable</h2>
<p>Estos términos se rigen por las leyes de {law}, Estados Unidos, y cualquier disputa se resolverá ante sus tribunales competentes. Antes de eso, nos comprometemos a intentar resolverla de buena fe por escrito durante 30 días. Si eres consumidor y la ley de tu país te da derechos que no se pueden renunciar, esos derechos se mantienen.</p>

<h2>13. Cambios a estos términos</h2>
<p>Podemos actualizar estos términos. Si el cambio es importante, te avisamos por correo o en tu chat al menos 15 días antes de que aplique.</p>

<h2>14. Idioma y contacto</h2>
<p>Estos términos se redactan en español; si existe una traducción, prevalece la versión en español. Para cualquier duda escríbenos a {_contact()}.</p>
"""


def privacy_body():
    return f"""
<p>Este aviso explica qué datos personales recaba {_who()}, para qué los usamos y cómo puedes ejercer tus derechos.</p>

<h2>1. Qué datos recabamos</h2>
<ul>
<li><b>Cuando pides una propuesta o una consultoría:</b> tu nombre, el nombre y la dirección de la página de tu negocio, tu correo o WhatsApp, tu ciudad y lo que nos cuentes de tu negocio. También leemos la información pública de tu página actual para preparar la propuesta.</li>
<li><b>Cuando contratas:</b> datos de facturación y de pago. Los datos de tu tarjeta los procesa Stripe; nosotros no los vemos completos ni los guardamos.</li>
<li><b>En el chat de tu cuenta:</b> los mensajes, archivos (logos, fotos, documentos) y datos de tu negocio que nos envías.</li>
<li><b>Datos técnicos:</b> tu país aproximado (a partir de tu conexión) para mostrarte precios en tu moneda, y datos básicos de uso del servidor. Guardamos en tu navegador tu moneda preferida y el acceso a tu chat. No usamos cookies de publicidad ni de rastreo de terceros.</li>
</ul>

<h2>2. Para qué los usamos</h2>
<ul>
<li>Preparar tu propuesta, prestar los servicios que contratas, cobrar, darte soporte y avisarte del avance de tu página.</li>
<li>Mejorar nuestro servicio, siempre de forma agregada.</li>
<li>Cumplir obligaciones legales y fiscales.</li>
</ul>
<p>No vendemos ni rentamos tus datos personales, ni los compartimos para publicidad.</p>

<h2>3. Con quién los compartimos</h2>
<p>Solo con proveedores que nos ayudan a prestar el servicio, que los tratan por cuenta nuestra:</p>
<ul>
<li>Vercel (hosting del sitio y de las páginas de clientes).</li>
<li>Supabase (base de datos y almacenamiento de archivos).</li>
<li>Stripe (pagos y facturación).</li>
<li>Anthropic (modelos de inteligencia artificial del chat y de la construcción de páginas).</li>
<li>Resend (envío de correos).</li>
<li>Meta / WhatsApp Business, si contratas el Asistente de WhatsApp.</li>
</ul>
<p>Estos proveedores pueden almacenar los datos en Estados Unidos u otros países. Al usar nuestros servicios aceptas esa transferencia. También podemos compartir datos si una autoridad competente lo exige conforme a la ley.</p>

<h2>4. Cuánto tiempo los guardamos</h2>
<p>Mientras seas cliente y después el tiempo que exijan las obligaciones legales y fiscales. Si pediste una propuesta y no contrataste, guardamos tus datos hasta 12 meses y luego los borramos o anonimizamos.</p>

<h2>5. Tus derechos</h2>
<p>Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, oponerte a su uso o retirar tu consentimiento (en México, derechos ARCO). Escríbenos a {_contact()} indicando tu nombre, el derecho que quieres ejercer y un medio para responderte. Te contestamos en un plazo máximo de 20 días hábiles. Si vives en California u otro estado de EE. UU. con leyes de privacidad, tienes además los derechos que esas leyes te reconocen; no vendemos ni compartimos tus datos con fines publicitarios.</p>

<h2>6. Datos de los clientes de tu negocio</h2>
<p>Si tu página o tu asistente reciben datos de tus propios clientes o pacientes (por ejemplo, una solicitud de cita), tú eres el responsable de esos datos y nosotros los tratamos solo por tu cuenta para prestar el servicio. Te corresponde informar a tus clientes con tu propio aviso de privacidad. Si tu negocio es una clínica, configura el asistente para no recibir información clínica.</p>

<h2>7. Seguridad</h2>
<p>Usamos conexiones cifradas, accesos restringidos y almacenamiento privado para tus archivos. Ningún sistema es infalible, pero si ocurre un incidente que afecte tus datos te avisaremos.</p>

<h2>8. Menores de edad</h2>
<p>Nuestros servicios son para negocios y no están dirigidos a menores de 18 años.</p>

<h2>9. Cambios a este aviso</h2>
<p>Podemos actualizar este aviso. Si el cambio es importante, te avisamos por correo o en tu chat.</p>
"""


def page(fill, kind):
    """kind: 'terminos' | 'privacidad'. fill: función de build.py que llena src/legal.html."""
    title = "Términos y condiciones" if kind == "terminos" else "Aviso de privacidad"
    body = terms_body() if kind == "terminos" else privacy_body()
    return fill("legal.html", {
        "{{L_TITLE}}": title,
        "{{L_ROBOTS}}": "index,follow" if READY else "noindex,follow",
        "{{L_DESC}}": E(f"{title} de {LEGAL['dba']} ({LEGAL['entity']})."),
        "{{L_CANON}}": f"https://www.ceibalabs.io/{kind}",
        "{{L_UPDATED}}": E(LEGAL["updated"]),
        "{{L_BODY}}": body,
    })

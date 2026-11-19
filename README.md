# Ceiba Labs · sitio web

Prototipo en alta fidelidad del sitio de Ceiba Labs, estudio digital para negocios de Latinoamérica. Son tres páginas estáticas en español, sin dependencias, que funcionan en escritorio y móvil.

| Página | Archivo | Ruta prevista en el sitemap |
|---|---|---|
| Inicio | `site/index.html` | `/` |
| Webs para clínicas | `site/webs-clinicas.html` | `/webs/clinicas` |
| Propuesta privada de ejemplo | `site/propuesta-clinica-arrayan.html` | `/p/[negocio]` |
| Revisión de tu página | `site/diagnostico.html` | `/diagnostico` |

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
brand/                   Logo, símbolo y favicon de Ceiba (petróleo, negro y lima)
build.py                 Arma site/ a partir de src/
```

## Marca

- Colores: verde casi negro `#0B1514`, petróleo `#103D37`, marfil `#F7F4EB` y lima `#D6FA52`. El lima se reserva para la acción principal y los estados interactivos.
- Tipografías (Google Fonts): Funnel Display para titulares, Geist para el texto y Geist Mono para datos. La clínica del concepto usa Instrument Serif.
- Favicon: `brand/ceiba-favicon.svg` (símbolo simplificado en lima sobre petróleo). En `site/` están `favicon.svg`, `favicon.ico` y `apple-touch-icon.png`, generados a partir de él; `brand/ceiba-icon-512.png` sirve para redes o el Dashboard de Stripe.
- El logo se usa con su forma y proporciones originales. En el sitio va en línea con `fill="currentColor"`, para usarlo en marfil sobre fondo oscuro.

## Precios

Son precios de lanzamiento para probar en México, en MXN. Son el precio final: Ceiba es una empresa de EE. UU. y por ahora no cobra IVA mexicano (pendiente de confirmar con el contador si algún servicio, como el hosting o el asistente, entra en el art. 18-B de la Ley del IVA).

| | Pago inicial | Mensualidad |
|---|---|---|
| Plan Esencial | $3,490 | $1,490 |
| Plan Negocio | $5,490 | $2,490 |
| Plan Avanzado | $8,490 | $3,990 |
| Asistente de WhatsApp | $3,990 | $1,490 |
| Automatización a medida | Diagnóstico $3,900, acreditable | Piloto desde $19,900 |

## Qué es prototipo y qué no

- **Revisión de URL:** funciona (ver «Embudo»). `clinicaarrayan.mx` sigue abriendo la revisión de ejemplo.
- **Formularios:** el de propuesta gratis guarda en Supabase y avisa por correo. La agenda de 15 minutos de la propuesta todavía no envía nada.
- **Activación:** con el servidor (`api/`) corriendo, «Activar mi web» abre Stripe Checkout (ver «Pagos con Stripe»). En una vista estática sin servidor muestra un aviso y no cobra.
- **Páginas del sitemap sin construir:** `/ia`, `/precios`, `/trabajo`, `/nosotros`, `/contacto`, las demás industrias y las páginas legales. Sus enlaces muestran un aviso con la ruta.
- **Archivos planos:** las páginas están en archivos planos dentro de `site/`. Para usar las rutas definitivas (`/webs/clinicas`, `/p/[negocio]`), hay que ajustar los enlaces relativos y las rutas de `img/`.

## Embudo: de la dirección a la propuesta

```
Cliente escribe su dirección en Inicio
  └─ /diagnostico?url=… → POST /api/analyze (revisión automática, no guarda nada)
        celular, WhatsApp, llamar, agendar, velocidad, Google, mapa, año del pie, reseñas
  └─ «Quiero ver mi propuesta» → POST /api/lead
        guarda en Supabase (tabla leads) con fecha de entrega = 24 horas hábiles
        avisa al equipo por correo y confirma al cliente si dejó correo
Equipo arma la propuesta (borrador con IA + revisión) → /p/[negocio]
```

- **24 horas hábiles:** de lunes a viernes, sin feriados de México, en hora del centro. Si la solicitud llega fuera de 9:00 a 19:00, se cuenta desde las 9:00 del siguiente día hábil (`lib/business-hours.js`; actualizar los feriados cada año).
- **Base de datos:** proyecto de Supabase `ceiba`, esquema en `supabase/migrations/0001_embudo.sql` (`leads`, `proposals`, `proposal_views`). RLS activado sin políticas: solo el servidor, con la service_role key, lee y escribe.
- **Si falla algo:** si no se guarda en Supabase pero sale el correo (o al revés), la solicitud cuenta como recibida. Si fallan los dos, el cliente ve un error y se le pide escribir por WhatsApp.
- **Seguridad de la revisión:** solo abre direcciones públicas (bloquea IPs privadas y redirecciones a ellas), máximo 2 MB y 9 segundos.

| Archivo | Qué hace |
|---|---|
| `api/analyze.js` | Revisión automática de la portada |
| `api/lead.js` | Valida, guarda y avisa |
| `lib/db.js` | Supabase por REST |
| `lib/notify.js` | Correos con Resend |
| `lib/business-hours.js` | Fecha de entrega |

## Pagos con Stripe

La propuesta privada cobra el pago inicial con **Stripe Checkout** (página alojada por Stripe) y la mensualidad empieza **al publicar la web**.

```
Cliente en /p/[negocio]
  └─ «Activar mi web» → POST /api/checkout → Stripe Checkout
        cobra el pago inicial, genera la factura y guarda la tarjeta
  └─ webhook checkout.session.completed → POST /api/webhook
        deja en el cliente la tarjeta por defecto y el plan elegido
Equipo de Ceiba publica la web
  └─ POST /api/publish (con CEIBA_ADMIN_TOKEN) → crea la suscripción mensual
Después: facturas mensuales automáticas, Smart Retries y portal de clientes
```

No se usa Checkout en modo suscripción con periodo de prueba porque le mostraría al cliente «prueba gratis», y la mensualidad no es gratis: simplemente empieza al publicar.

| Archivo | Qué hace |
|---|---|
| `lib/catalog.js` | Planes, módulo y consultoría en MXN (precio final); códigos fiscales de Stripe Tax |
| `lib/proposals.js` | Propuestas activas y su vigencia |
| `api/checkout.js` | Crea la sesión de Checkout. Busca los precios por `lookup_key`, nunca confía en montos del navegador |
| `api/webhook.js` | Verifica la firma y procesa los eventos de Stripe |
| `api/publish.js` | Uso interno: crea la mensualidad al publicar. Es idempotente |
| `scripts/stripe-setup.mjs` | Crea o actualiza productos, precios y el portal de clientes |
| `scripts/dev.mjs` | Servidor local que sirve `site/` y `api/` |

### Puesta en marcha

```bash
npm install
cp .env.example .env               # completa las variables
node --env-file=.env scripts/stripe-setup.mjs
node --env-file=.env scripts/dev.mjs   # http://localhost:3000
```

En Vercel, configura las mismas variables del `.env.example`. El proyecto ya sirve `site/` (ver `vercel.json`) y las funciones de `api/`.

Para probar el pago usa la tarjeta `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC.

### Pendiente en el Dashboard de Stripe

1. **Stripe Tax:** apagado por ahora, porque Ceiba (EE. UU.) no cobra IVA mexicano. Si el contador confirma que algún servicio entra en el art. 18-B de la Ley del IVA, cargar el domicilio fiscal y el registro en México, y poner `STRIPE_AUTOMATIC_TAX=true`.
2. **Marca:** logo, ícono y colores (`#103D37` y `#D6FA52`) en Configuración › Marca, para que Checkout, facturas y correos se vean de Ceiba.
3. **Webhook:** crear el endpoint `https://www.ceibalabs.io/api/webhook` con los eventos listados en `api/webhook.js` y guardar su secreto en `STRIPE_WEBHOOK_SECRET`.
4. **Cobranza:** activar Smart Retries, los correos de pago fallido y la actualización automática de tarjetas (Facturación › Recuperación de ingresos).
5. **Métodos de pago:** revisar los métodos activos. Checkout solo muestra los reutilizables, como la tarjeta, porque guarda el método para la mensualidad.
6. **Portal de clientes:** la cancelación y el cambio de plan están desactivados hasta definir la política de permanencia.

### Límites de la cuenta actual

La cuenta de prueba es de **Estados Unidos**:
- Permite OXXO, pero solo para pagos únicos (por ejemplo, el diagnóstico de IA por factura).
- No permite transferencias SPEI, que requieren una cuenta mexicana.
- Stripe no emite CFDI. Si los clientes mexicanos necesitan CFDI, hace falta un proveedor de facturación electrónica (PAC) y, en general, una entidad en México.

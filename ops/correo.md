# Correo de Ceiba Labs: alias, etiquetas y agentes

El dominio ya recibe correo en Google Workspace (MX `smtp.google.com`, SPF y DKIM de Google) y envía desde la app con Resend (DKIM `resend._domainkey`, retorno por `send.ceibalabs.io`). Los alias llegan todos al mismo buzón y un filtro de Gmail los etiqueta.

## Los alias

| Alias | Para qué | Quién escribe desde ahí | Etiqueta |
|---|---|---|---|
| `hola@` | Contacto general, firma del equipo, la web | Personas y la confirmación de solicitudes | Ceiba/Hola |
| `propuestas@` | Propuestas enviadas y lo que contestan los prospectos | La app al mandar cada propuesta | Ceiba/Propuestas |
| `clientes@` | Clientes activos: bienvenida, enlace a su chat, avisos de su página | La app y el chat de clientes | Ceiba/Clientes |
| `reportes@` | Reportes mensuales de SEO e IA | Los reportes a clientes | Ceiba/Reportes |
| `facturacion@` | Pagos, recibos y facturas | Stripe y proveedores | Ceiba/Facturación |
| `legal@` | Privacidad y términos (ya está publicado en el sitio) | Personas | Ceiba/Legal |
| `avisos@` | Avisos internos de la app (nueva solicitud, pagó, pidió cambios) | La app; si alguien responde, va a `hola@` | Ceiba/Avisos |
| `agentes@` | Cuentas que abren los agentes en otras herramientas: altas, códigos de verificación, avisos de servicios | Los agentes | Ceiba/Agentes (sale de la bandeja) |
| `dmarc@` | Reportes automáticos de DMARC | Google, Microsoft y otros | Ceiba/DMARC (sale de la bandeja, leído) |

La app ya manda cada correo desde su alias y con respuesta a ese mismo alias (`lib/notify.js`, `MAILBOXES`): propuestas desde `propuestas@`, bienvenida y avisos de clientes desde `clientes@`, confirmación de solicitud desde `hola@` y avisos internos desde `avisos@`.

## Configurarlo (una vez)

1. **Crear los alias.** Consola de administración de Google (admin.google.com) → Directorio → Usuarios → tu usuario → Información del usuario → Direcciones de correo alternativas → agrega cada alias de la tabla. Son gratis (hasta 30 por usuario) y empiezan a recibir en minutos.
   - Si después entra más gente al equipo, cambia un alias por un **Grupo de Google** con la misma dirección (por ejemplo `clientes@` como grupo con bandeja colaborativa) para que varios lo atiendan.
2. **Importar los filtros.** Gmail → Configuración → Ver toda la configuración → Filtros y direcciones bloqueadas → Importar filtros → elige `ops/correo/filtros-gmail.xml` → Abrir archivo → Crear filtros (marca «Aplicar también a las conversaciones existentes»). Se crean las 9 etiquetas bajo «Ceiba».
3. **Enviar como el alias desde Gmail** (para contestar desde `propuestas@` o `clientes@`): Configuración → Cuentas → Enviar como → Agregar otra dirección, una por alias, sin marcar «tratar como alias». Activa «Responder desde la misma dirección a la que se envió el mensaje».
4. **Avisos internos.** En Vercel, `CEIBA_NOTIFY_EMAIL=avisos@ceibalabs.io` para que los avisos de la app caigan en su etiqueta y no revueltos en la bandeja.
5. **Stripe.** Settings → Business → Public details: correo de soporte `facturacion@ceibalabs.io`; y en Emails, recibos con respuesta a ese mismo alias.
6. **DMARC.** Agregar en el DNS (Vercel) un registro TXT `_dmarc` con `v=DMARC1; p=none; rua=mailto:dmarc@ceibalabs.io; fo=1`. Después de 2 a 4 semanas sin problemas en los reportes, subir a `p=quarantine`.

## Cómo los usan los agentes

- **Enviar:** cualquier agente o función de la app manda desde un alias con `sendMail({ as: 'reportes', ... })`. Resend tiene verificado todo el dominio, así que no hace falta configurar nada por alias.
- **Recibir y leer:** los correos quedan etiquetados en Gmail. Un agente con acceso a Gmail (el conector de Gmail o la API) lee solo su etiqueta, por ejemplo `label:Ceiba/Agentes` para códigos de verificación o `label:Ceiba/Propuestas is:unread` para ver qué contestaron los prospectos.
- **Registrarse en herramientas:** los agentes usan `agentes@ceibalabs.io`, nunca el correo personal de alguien. Así los códigos y avisos no se mezclan con el trabajo del equipo y se pueden revisar en un solo lugar.
- **Nunca** se guardan contraseñas en el correo ni en el repositorio: van en el gestor de contraseñas o en las variables de Vercel.

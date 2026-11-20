# Trabajo de clientes · el ingeniero (Claude Code) y el agente de customer success

El chat de clientes (`api/chat.js`, modelo barato: Claude Haiku 5.5) es el **agente de customer success**:
atiende al cliente, recoge materiales e instrucciones y los guarda en Supabase. **No edita páginas.**
El **ingeniero** es Claude Code: lee la tabla `solicitudes`, construye o cambia la página y le responde
al cliente a través del agente. El agente es el puente entre los dos.

## La cola: tabla `solicitudes` (proyecto Supabase `emcfsmufhvnekqnmosmx`)
| Campo | Qué es |
|---|---|
| `tipo` | `materiales` (el cliente terminó de mandar todo: construir la página) o `cambio` (pedido confirmado sobre la página publicada) |
| `slug`, `business` | El cliente. Su página está en `proposals.content` con ese `slug`. |
| `seccion`, `instruccion` | Qué cambiar y cómo, con el dato exacto que dio el cliente. |
| `archivos` | `[{ ruta, nombre, tipo, clase }]` en el bucket privado `materiales` (clase: logo, foto, guia_marca…). |
| `datos` | Solo en `materiales`: horario, servicios, dirección, teléfono, colores, dominio, etc. |
| `urgente` | Si la página está caída o el cliente lo pidió urgente. |
| `estado` | `pendiente` → `en_proceso` → `aplicado` (o `descartado`). `necesita_info` si el ingeniero le preguntó algo al cliente. |
| `hilo` | Conversación ingeniero ↔ cliente sobre esa solicitud: `[{ de, texto, at }]`. |

Cada solicitud nueva también llega por correo al equipo con su id.

## Desde el panel (/admin → Clientes)
La pestaña **Clientes** lista a quien ya pagó, ordenado por lo urgente: quien pidió una persona,
cambios urgentes y solicitudes pendientes. Al abrir un cliente ves:
- **Solicitudes** con sus archivos y el hilo con el cliente. Cambia el estado y, si quieres, escríbele:
  el mensaje le llega en su chat y por correo (igual que `action: "engineer"`).
- **Datos que confirmó**, **archivos que subió** (enlaces de 24 h) y la **conversación** completa.
- **Etapa**: al publicar su página, pásalo a «Publicada» para que el asistente atienda cambios.

El flujo completo después del chat:
1. El cliente confirma todo → el asistente crea la solicitud «Construir la página» (estado pendiente) y avisa por correo.
2. La tomas (En proceso), construyes la página con Claude Code y le mandas la vista previa con un mensaje.
3. Si falta algo, «Esperando al cliente» + tu pregunta; su respuesta regresa a la misma solicitud.
4. Publicas, marcas «Aplicado» y cambias la etapa a «Publicada».

## Ver lo pendiente
```sql
select id, tipo, slug, business, seccion, instruccion, archivos, urgente, created_at
from solicitudes where estado = 'pendiente'
order by urgente desc, created_at;
```
Para bajar un archivo: Storage → bucket `materiales` → la `ruta` del archivo (o un enlace firmado).

## Hablarle al cliente (el puente)
El ingeniero nunca le escribe directo al cliente: le pasa el mensaje al agente, que lo deja en su chat y le manda un correo.

```bash
curl -X POST https://www.ceibalabs.io/api/chat \
  -H "Authorization: Bearer $CEIBA_ADMIN_TOKEN" -H "Content-Type: application/json" \
  -d '{"action":"engineer","solicitud":"<uuid>","estado":"necesita_info","mensaje":"¿Prefieres una foto del consultorio o del equipo?"}'
```
- `estado`: `en_proceso` (lo tomaste), `necesita_info` (le preguntas algo), `aplicado` (listo) o `descartado`.
- `mensaje`: lo que verá el cliente, escrito para él (corto, sin tecnicismos). Opcional si solo cambias el estado.
- `nota`: opcional, nota interna de lo que hiciste.

Cuando el cliente responde, el agente agrega su respuesta al `hilo`, adjunta los archivos que suba y regresa la
solicitud a `pendiente`. Al equipo le llega el correo «Respuesta del cliente: …».

## Aplicar
1. Marca la solicitud `en_proceso` (con el curl de arriba).
2. Edita el contenido de la página (tabla `proposals`, campo `content`, esquema en `ops/esquema-propuesta.md`)
   con los datos y archivos de la solicitud. Revisa el resultado en `/vista/<slug>`.
3. Ciérrala con `estado: "aplicado"` y un `mensaje` para el cliente, por ejemplo
   «Listo, ya cambiamos tu horario del sábado. Puedes verlo en tu página.».

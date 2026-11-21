// Correos con Resend (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY y CEIBA_NOTIFY_EMAIL viven en Vercel. El remitente debe ser
// de un dominio verificado en Resend (p. ej. avisos@ceibalabs.io).
export const mailReady = () => !!process.env.RESEND_API_KEY;

// Buzones de Ceiba (alias de Google Workspace). Cada correo sale del buzón de su tema y las
// respuestas regresan a ese mismo alias, donde un filtro de Gmail lo etiqueta (ops/correo.md).
// «avisos» es solo para avisos internos; si alguien le responde, va a hola@.
const DOMAIN = 'ceibalabs.io';
export const MAILBOXES = {
  avisos: { name: 'Ceiba Labs', replyTo: `hola@${DOMAIN}` },
  hola: { name: 'Ceiba Labs' },
  propuestas: { name: 'Propuestas Ceiba Labs' },
  clientes: { name: 'Ceiba Labs' },
  reportes: { name: 'Reportes Ceiba Labs' },
  facturacion: { name: 'Facturación Ceiba Labs' },
};

export async function sendMail({ to, subject, html, text, replyTo, as = 'avisos' }) {
  if (!mailReady()) throw new Error('Falta RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: as === 'avisos' && process.env.RESEND_FROM ? process.env.RESEND_FROM : `${(MAILBOXES[as] || MAILBOXES.avisos).name} <${MAILBOXES[as] ? as : 'avisos'}@${DOMAIN}>`,
      to: Array.isArray(to) ? to : [to],
      subject, html, text,
      reply_to: replyTo || (MAILBOXES[as] || MAILBOXES.avisos).replyTo || `${MAILBOXES[as] ? as : 'avisos'}@${DOMAIN}`,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

export const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

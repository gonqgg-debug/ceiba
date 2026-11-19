// Correos con Resend (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY y CEIBA_NOTIFY_EMAIL viven en Vercel. El remitente debe ser
// de un dominio verificado en Resend (p. ej. avisos@ceibalabs.io).
export const mailReady = () => !!process.env.RESEND_API_KEY;

export async function sendMail({ to, subject, html, text, replyTo }) {
  if (!mailReady()) throw new Error('Falta RESEND_API_KEY');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Ceiba Labs <avisos@ceibalabs.io>',
      to: Array.isArray(to) ? to : [to],
      subject, html, text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

export const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

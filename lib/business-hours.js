// "24 horas hábiles": 24 horas que caen de lunes a viernes, sin días feriados
// de México, contadas en hora del centro (UTC-6, sin horario de verano desde 2022).
// Si la solicitud llega fuera de horario, en fin de semana o en feriado, se cuenta
// desde las 9:00 del siguiente día hábil.
const TZ = 'America/Mexico_City';
const OFFSET_MS = -6 * 3600e3;
// Días de descanso obligatorio (LFT art. 74) de los próximos meses. Actualizar cada año.
const HOLIDAYS = new Set([
  '2026-12-25', '2027-01-01', '2027-02-01', '2027-03-15', '2027-05-01',
  '2027-09-16', '2027-11-15', '2027-12-25', '2028-01-01',
]);

const local = t => new Date(t + OFFSET_MS); // "reloj" de CDMX leído con getUTC*
const isWorkday = t => {
  const d = local(t), wd = d.getUTCDay();
  return wd !== 0 && wd !== 6 && !HOLIDAYS.has(d.toISOString().slice(0, 10));
};

const at9 = t => { const d = local(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 9) - OFFSET_MS; };

export function dueDate(from = new Date(), hours = 24) {
  let t = from.getTime();
  // Fuera de horario de oficina (9:00 a 19:00), se empieza a contar a las 9:00 del siguiente día hábil.
  const h = local(t).getUTCHours();
  if (!isWorkday(t) || h >= 19) { t = at9(t) + 24 * 3600e3; while (!isWorkday(t)) t += 24 * 3600e3; }
  else if (h < 9) t = at9(t);
  let left = hours;
  while (left > 0) { t += 3600e3; if (isWorkday(t)) left -= 1; }
  // Si cae justo en fin de semana o feriado, se recorre al siguiente día hábil a la misma hora.
  while (!isWorkday(t)) t += 24 * 3600e3;
  return new Date(t);
}

// "el martes 24 de noviembre, antes de las 6:15 p. m. (hora del centro)"
export function dueLabel(date) {
  const day = new Intl.DateTimeFormat('es-MX', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  const time = new Intl.DateTimeFormat('es-MX', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return { day: `el ${day.replace(',', '')}`, time: `antes de las ${time.replace(/\s*([ap])\.\s*m\./, ' $1. m.').replace(/\u00a0/g, ' ')}`, tz: 'hora del centro de México' };
}

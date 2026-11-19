// Dispara la rutina de Claude Code «Armar propuesta» para una solicitud nueva.
// CLAUDE_ROUTINE_ID (trig_...) y CLAUDE_ROUTINE_TOKEN se generan en la
// configuración de la rutina en claude.ai y viven solo en Vercel.
// La API está en beta: si falla, la rutina igual revisa las solicitudes
// pendientes en su horario de respaldo.
export const routineReady = () => !!(process.env.CLAUDE_ROUTINE_ID && process.env.CLAUDE_ROUTINE_TOKEN);

// fireRoutine(lead) para una solicitud nueva, o fireRoutine('change=<slug>') para una ronda de cambios.
export async function fireRoutine(what) {
  if (!routineReady()) { console.warn('rutina: no configurada'); return null; }
  const id = process.env.CLAUDE_ROUTINE_ID.replace(/[^A-Za-z0-9_]/g, '');
  const res = await fetch(`https://api.anthropic.com/v1/claude_code/routines/${id}/fire`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${process.env.CLAUDE_ROUTINE_TOKEN}`,
      'anthropic-beta': 'experimental-cc-routine-2026-04-01',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    // Solo el id: la rutina lee todo lo demás de Supabase.
    body: JSON.stringify({ text: typeof what === 'string' ? what : `lead_id=${what.id}` }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`fire ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

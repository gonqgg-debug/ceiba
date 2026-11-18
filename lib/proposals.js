// Propuestas privadas activas. Cada una corresponde a /p/[slug].
// Más adelante esto vendrá de una base de datos o del CRM; por ahora vive aquí.
export const PROPOSALS = {
  'clinica-arrayan': {
    business: 'Clínica Dental Arrayán',
    contactName: 'Valeria Ríos',
    page: '/propuesta-clinica-arrayan.html',
    recommended: { plan: 'negocio', whatsapp: true },
    allowedPlans: ['esencial', 'negocio', 'avanzado'],
    validUntil: '2026-12-02T23:59:59-06:00', // hora del centro de México
  },
};

export function getProposal(slug) {
  const p = PROPOSALS[slug];
  if (!p) return { error: 'La propuesta no existe.', status: 404 };
  if (Date.now() > Date.parse(p.validUntil)) return { error: 'La propuesta venció. Pide una actualización.', status: 410 };
  return { proposal: p };
}

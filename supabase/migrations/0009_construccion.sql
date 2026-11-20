-- Claude Code construye la página del cliente y aplica sus cambios (rutina «Ceiba · Propuestas y páginas»).
-- La página real del cliente vive aparte de su propuesta: proposals.site_content (mismo esquema que content).
alter table public.proposals add column if not exists site_content jsonb;
alter table public.proposals add column if not exists site_content_prev jsonb;
alter table public.proposals add column if not exists site_built_at timestamptz;

-- pendiente -> construyendo (la rutina la tomó) -> en_revision (lista para que el equipo la apruebe)
-- -> aplicado (aprobada y avisada al cliente). necesita_info: esperando al cliente.
alter table public.solicitudes drop constraint if exists solicitudes_estado_check;
alter table public.solicitudes add constraint solicitudes_estado_check
  check (estado in ('pendiente', 'construyendo', 'en_revision', 'necesita_info', 'aplicado', 'descartado'));
alter table public.solicitudes add column if not exists resultado text;        -- qué hizo la rutina (para el equipo)
alter table public.solicitudes add column if not exists mensaje_cliente text;  -- borrador del aviso al cliente
alter table public.solicitudes add column if not exists started_at timestamptz;

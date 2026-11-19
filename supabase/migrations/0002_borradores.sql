-- Contenido leído de la página del cliente y estados para la rutina de borradores.
alter table public.leads add column page_snapshot jsonb;
alter table public.leads add column proposal_id uuid references public.proposals(id) on delete set null;
alter table public.leads drop constraint leads_status_check;
alter table public.leads add constraint leads_status_check
  check (status in ('nuevo','generando','en_revision','propuesta_enviada','descartado','error'));
alter table public.proposals add column notes text;           -- notas de la rutina para el equipo
alter table public.proposals add column changes_requested text; -- lo que pide corregir el equipo

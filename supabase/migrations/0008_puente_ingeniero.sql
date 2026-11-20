-- Puente entre el ingeniero (Claude Code) y el cliente: el agente de customer success
-- transmite preguntas y avisos del ingeniero y le devuelve las respuestas del cliente.
alter table public.solicitudes drop constraint if exists solicitudes_estado_check;
alter table public.solicitudes add constraint solicitudes_estado_check check (estado in ('pendiente', 'en_proceso', 'necesita_info', 'aplicado', 'descartado'));
-- [{ de: "ingeniero" | "cliente", texto, at }]
alter table public.solicitudes add column if not exists hilo jsonb not null default '[]'::jsonb;

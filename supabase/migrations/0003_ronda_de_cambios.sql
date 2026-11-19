-- Una ronda de ajustes que el cliente pide desde su propuesta y Claude aplica sin revisión.
alter table public.proposals add column change_rounds int not null default 0;
alter table public.proposals add column change_status text check (change_status in ('pendiente','aplicando','aplicado','error'));
alter table public.proposals add column change_note text;          -- resumen para el cliente de lo que se cambió
alter table public.proposals add column change_requested_at timestamptz;
alter table public.proposals add column content_prev jsonb;        -- respaldo para deshacer

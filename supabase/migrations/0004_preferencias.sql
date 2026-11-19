-- Preferencias de estilo que el cliente elige antes de que armemos su propuesta.
alter table public.leads add column preferences jsonb;

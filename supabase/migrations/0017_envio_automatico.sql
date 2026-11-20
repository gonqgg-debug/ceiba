-- Envío automático de propuestas: cuando la rutina deja la solicitud «en_revision» con su
-- propuesta, la base de datos llama a /api/admin (autosend) y se le manda al cliente sin
-- pasar por el panel. Para apagarlo: AUTO_SEND_PROPOSALS=off en Vercel.
create extension if not exists pg_net with schema extensions;

create or replace function public.ceiba_autosend() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
begin
  perform net.http_post(
    url := 'https://www.ceibalabs.io/api/admin',
    body := jsonb_build_object('action', 'autosend', 'lead_id', new.id),
    headers := '{"content-type": "application/json"}'::jsonb,
    timeout_milliseconds := 20000
  );
  return new;
end $$;

drop trigger if exists leads_autosend on public.leads;
create trigger leads_autosend after update of status, proposal_id on public.leads
for each row when (new.status = 'en_revision' and new.proposal_id is not null
  and (old.status is distinct from 'en_revision' or old.proposal_id is null))
execute function public.ceiba_autosend();

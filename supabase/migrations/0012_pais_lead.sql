-- País del cliente detectado por IP al llenar el formulario (lo usa la propuesta para sus precios).
alter table public.leads add column if not exists country text;
create or replace function public.proposal_country_from_lead() returns trigger language plpgsql as $$
begin
  if new.lead_id is not null and (new.country is null or new.country = 'MX') then
    select coalesce(l.country, new.country, 'MX') into new.country from public.leads l where l.id = new.lead_id;
  end if;
  return new;
end $$;
drop trigger if exists proposal_country_from_lead on public.proposals;
create trigger proposal_country_from_lead before insert on public.proposals for each row execute function public.proposal_country_from_lead();

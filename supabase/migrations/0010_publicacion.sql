-- Entrega: el cliente aprueba su página y la publicamos en su dominio.
alter table public.proposals add column if not exists site_approved_at timestamptz;
alter table public.proposals add column if not exists domain text;               -- sin www, ej. clinicaarrayan.mx
alter table public.proposals add column if not exists domain_status text;        -- pendiente | listo | error
alter table public.proposals add column if not exists domain_dns jsonb;          -- registros que debe poner el cliente
alter table public.proposals add column if not exists published_at timestamptz;
create unique index if not exists proposals_domain_idx on public.proposals (domain) where domain is not null;

-- Chat de clientes: un agente de IA atiende a cada cliente desde que paga
-- (arranque: pide materiales y dominio) y después como soporte (cambios, dudas).
create table if not exists public.client_chats (
  id            uuid primary key default gen_random_uuid(),
  proposal_id   uuid unique references public.proposals(id) on delete set null,
  slug          text not null unique,
  business      text,
  email         text,
  phase         text not null default 'arranque'
                check (phase in ('arranque', 'construccion', 'soporte')),
  messages      jsonb not null default '[]'::jsonb,  -- historial para la API (solo se agrega, nunca se edita)
  data          jsonb not null default '{}'::jsonb,  -- lo que el cliente nos dio: horario, servicios, dominio...
  files         jsonb not null default '[]'::jsonb,  -- archivos subidos: ruta, tipo, nombre
  needs_human   boolean not null default false,
  last_client_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists client_chats_email_idx on public.client_chats (lower(email));
alter table public.client_chats enable row level security;

-- Archivos de clientes (logos, fotos, guías de marca). Privado: solo con enlaces firmados.
insert into storage.buckets (id, name, public, file_size_limit)
values ('materiales', 'materiales', false, 26214400)
on conflict (id) do nothing;

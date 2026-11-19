-- Embudo de Ceiba Labs: solicitudes, propuestas y visitas a cada propuesta.
-- Solo el servidor (service_role) lee y escribe. RLS activado sin políticas:
-- las claves anon/authenticated no ven nada.

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  source        text not null default 'home',          -- home | diagnostico | clinicas
  has_site      boolean not null default true,
  site_host     text,                                   -- clinica.com (sin https ni www)
  industry      text,
  city          text,
  social        text,                                   -- Instagram o enlace de Google Maps
  name          text not null,
  business      text not null,
  contact       text not null,                          -- WhatsApp o correo
  contact_type  text not null check (contact_type in ('email','whatsapp')),
  audit         jsonb,                                  -- resultado de /api/analyze
  status        text not null default 'nuevo'
                check (status in ('nuevo','en_revision','propuesta_enviada','descartado')),
  due_at        timestamptz not null,                   -- promesa: 24 horas hábiles
  notes         text,
  utm           jsonb,
  user_agent    text
);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_due_idx on public.leads (status, due_at);

create table public.proposals (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  lead_id               uuid references public.leads(id) on delete set null,
  slug                  text not null unique check (slug ~ '^[a-z0-9-]{3,80}$'),
  business              text not null,
  status                text not null default 'borrador'
                        check (status in ('borrador','enviada','vista','activada','vencida','descartada')),
  recommended_plan      text not null default 'negocio' check (recommended_plan in ('esencial','negocio','avanzado')),
  allowed_plans         text[] not null default array['esencial','negocio','avanzado'],
  whatsapp_recommended  boolean not null default false,
  ai_draft              jsonb,                          -- borrador generado con IA
  content               jsonb,                          -- versión revisada por el equipo
  valid_until           date,
  sent_at               timestamptz,
  first_viewed_at       timestamptz,
  activated_at          timestamptz,
  stripe_customer_id    text
);
create index proposals_lead_idx on public.proposals (lead_id);

create table public.proposal_views (
  id           bigint generated always as identity primary key,
  proposal_id  uuid not null references public.proposals(id) on delete cascade,
  viewed_at    timestamptz not null default now(),
  user_agent   text,
  referrer     text
);
create index proposal_views_proposal_idx on public.proposal_views (proposal_id, viewed_at desc);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger proposals_touch before update on public.proposals
  for each row execute function public.touch_updated_at();

alter table public.leads enable row level security;
alter table public.proposals enable row level security;
alter table public.proposal_views enable row level security;
revoke all on public.leads, public.proposals, public.proposal_views from anon, authenticated;

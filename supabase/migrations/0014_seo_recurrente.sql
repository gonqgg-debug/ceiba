-- Lo recurrente de los planes: análisis al lanzar, prueba de visibilidad en IA y reportes.
create table if not exists public.seo_reports (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  kind text not null check (kind in ('lanzamiento', 'trimestral', 'mensual')),
  data jsonb not null default '{}'::jsonb,   -- { audit, visibility, contacts }
  summary text,                              -- lo que se le manda al cliente
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists seo_reports_slug_idx on public.seo_reports (slug, kind, created_at desc);
alter table public.seo_reports enable row level security;

-- Contactos desde las páginas de clientes (clic en WhatsApp, llamar, formulario, agendar…)
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  slug text not null,
  kind text not null check (kind in ('whatsapp', 'llamada', 'formulario', 'agendar', 'correo', 'mapa')),
  page text,
  created_at timestamptz not null default now()
);
create index if not exists site_events_slug_idx on public.site_events (slug, created_at desc);
alter table public.site_events enable row level security;

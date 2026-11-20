-- Pruebas de visibilidad en IA que se hacen en el chat de cada asistente (ChatGPT, Perplexity…)
-- con Claude Cowork en el navegador del equipo. El servidor crea las pendientes con cada reporte;
-- Cowork las contesta (respuesta y fuentes) y el cron diario cierra el reporte.
create table if not exists public.ai_checks (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.seo_reports (id) on delete cascade,
  slug text not null,
  provider text not null check (provider in ('chatgpt', 'perplexity', 'gemini')),
  q text not null,                       -- la pregunta exacta a pegar en el chat
  estado text not null default 'pendiente' check (estado in ('pendiente', 'hecho', 'error')),
  answer text,                           -- texto de la respuesta tal cual
  sources text[] not null default '{}',  -- enlaces de las fuentes que citó
  nota text,                             -- si falló: qué pasó
  created_at timestamptz not null default now(),
  done_at timestamptz
);
create index if not exists ai_checks_pend_idx on public.ai_checks (estado, created_at);
create index if not exists ai_checks_report_idx on public.ai_checks (report_id);
alter table public.ai_checks enable row level security;

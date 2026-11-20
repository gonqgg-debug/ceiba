-- Cola de trabajo para Claude Code: lo que el asistente del chat recoge de cada cliente.
--   materiales: el cliente terminó de mandar logo, fotos, marca, datos y dominio -> construir la página
--   cambio:     instrucción confirmada para cambiar su página publicada
create table if not exists public.solicitudes (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid references public.client_chats(id) on delete cascade,
  slug        text not null,
  business    text,
  tipo        text not null check (tipo in ('materiales', 'cambio')),
  seccion     text,
  instruccion text not null,
  archivos    jsonb not null default '[]'::jsonb,   -- [{ ruta, nombre, tipo, clase }] en el bucket «materiales»
  datos       jsonb,                                 -- para «materiales»: datos del negocio confirmados
  urgente     boolean not null default false,
  estado      text not null default 'pendiente' check (estado in ('pendiente', 'en_proceso', 'aplicado', 'descartado')),
  nota        text,                                  -- lo que hizo Claude Code o por qué se descartó
  created_at  timestamptz not null default now(),
  applied_at  timestamptz
);
create index if not exists solicitudes_pendientes_idx on public.solicitudes (estado, urgente desc, created_at);
alter table public.solicitudes enable row level security;

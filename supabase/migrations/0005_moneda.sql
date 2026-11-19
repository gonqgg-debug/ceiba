-- Multimoneda: cada propuesta se cotiza y se cobra en una moneda (la fija el equipo en /admin).
alter table public.proposals
  add column if not exists currency text not null default 'mxn'
  check (currency ~ '^[a-z]{3}$');

-- El reporte mensual lo revisa y redacta Claude Cowork; el equipo lo aprueba en el panel.
--   para_cowork: datos listos, espera la revisión de Cowork
--   por_revisar: Cowork escribió el reporte; falta que el equipo lo mande
--   enviado / descartado
alter table public.seo_reports
  add column if not exists estado text not null default 'enviado' check (estado in ('para_cowork', 'por_revisar', 'enviado', 'descartado')),
  add column if not exists cowork_report text,   -- el reporte para el cliente, escrito por Cowork
  add column if not exists cowork_notes text,    -- notas para el equipo
  add column if not exists mejora text,          -- Avanzado: la mejora de SEO del mes que propone
  add column if not exists reviewed_at timestamptz;
create index if not exists seo_reports_estado_idx on public.seo_reports (estado, created_at);

-- Minutos de cambios por plan: la rutina estima cuánto tomó cada cambio (minutos) y guardamos
-- el plan con que se pidió. El consumo del mes se suma de las solicitudes de tipo «cambio».
alter table public.solicitudes add column if not exists minutos integer;
alter table public.solicitudes add column if not exists plan text;

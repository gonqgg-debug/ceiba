-- Precios por país: cada propuesta cobra con los precios del país que fija el equipo en /admin.
-- touristic: nichos turísticos (hoteles, villas, inmobiliarias) siempre con precios de nivel 1.
alter table public.proposals add column if not exists country text not null default 'MX';
alter table public.proposals add column if not exists touristic boolean not null default false;
update public.proposals set country = 'XX' where currency = 'usd' and country = 'MX';

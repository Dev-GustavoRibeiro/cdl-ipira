-- Eventos de entrada livre (sorteio público, feira) não pedem inscrição: o site mostra "Entrada livre" em vez do formulário
alter table public.events add column if not exists registration_enabled boolean not null default true;
comment on column public.events.registration_enabled is 'false: evento de entrada livre (sorteio público, feira); o site não mostra o formulário de inscrição';

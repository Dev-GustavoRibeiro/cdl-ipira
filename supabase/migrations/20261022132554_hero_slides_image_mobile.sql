-- Imagem própria para celular em cada slide do hero (opcional).
-- Sem ela, o site usa a imagem principal também no celular (comportamento anterior).
alter table public.hero_slides add column if not exists image_mobile text;

comment on column public.hero_slides.image_mobile is
  'URL da imagem do slide para telas de celular (vertical). Opcional: vazio usa a imagem principal.';

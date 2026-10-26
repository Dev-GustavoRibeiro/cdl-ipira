-- Uma inscrição por e-mail em cada evento: o formulário deixou de pedir CPF (coleta mínima, LGPD art. 6º, III).
-- A API já checa antes de inserir; o índice cobre duas inscrições simultâneas (erro 23505 → 409 na API).
create unique index if not exists event_registrations_event_email_key
  on public.event_registrations (event_id, lower(email));

-- PENDENTE (CDL): com o ok da CDL, apagar o CPF já guardado (o índice idx_event_registrations_event_cpf cai junto):
-- alter table public.event_registrations drop column if exists cpf;

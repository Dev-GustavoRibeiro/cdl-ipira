-- Formulário público de Orientação Jurídica passa a salvar os dados de contato
alter table public.legal_requests add column if not exists telefone text;
alter table public.legal_requests add column if not exists email text;
alter table public.legal_requests add column if not exists descricao text;

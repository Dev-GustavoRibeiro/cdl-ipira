-- Contato de quem anuncia a vaga (nome, e-mail, telefone) é dado pessoal: a API pública só lê as colunas do anúncio.
-- O painel usa o service role e continua vendo tudo; /api/vagas e /api/search não pedem as colunas de contato.
revoke select on public.jobs from anon, authenticated;
grant select (id, title, company, quantity, description, location, date, category, is_active, created_at, updated_at)
  on public.jobs to anon, authenticated;

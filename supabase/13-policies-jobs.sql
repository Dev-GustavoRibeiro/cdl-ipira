-- Políticas RLS para a tabela jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública para vagas ativas
CREATE POLICY "Vagas ativas são públicas"
ON jobs FOR SELECT
USING (is_active = true);

-- Permitir todas as operações para usuários autenticados (admin)
-- Assumindo que usuários autenticados são admins neste contexto
CREATE POLICY "Admins podem fazer tudo em vagas"
ON jobs FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Permitir inserção pública (para o formulário "Cadastre sua vaga")
-- Mas como is_active default é true no banco, e false na API, ok.
-- Se a API usa service_role, não precisa desta política.
-- Se a API usa cliente anonimo, precisa.
CREATE POLICY "Público pode criar vagas"
ON jobs FOR INSERT
WITH CHECK (true);




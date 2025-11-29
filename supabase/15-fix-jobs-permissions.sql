-- CORREÇÃO CRÍTICA DE PERMISSÕES
-- Execute este script para permitir que o formulário do site funcione

-- 1. Habilitar Segurança a Nível de Linha (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas conflitantes antigas para limpar a casa
DROP POLICY IF EXISTS "Público pode criar vagas" ON jobs;
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON jobs;
DROP POLICY IF EXISTS "Admins podem fazer tudo em vagas" ON jobs;
DROP POLICY IF EXISTS "Enable insert for everyone" ON jobs;
DROP POLICY IF EXISTS "Admin full access" ON jobs;

-- 3. Criar política EXPLÍCITA para permitir CADASTRO PÚBLICO (INSERT)
-- Esta política permite que qualquer pessoa (mesmo sem login) envie uma vaga
CREATE POLICY "Permitir cadastro publico"
ON jobs FOR INSERT
WITH CHECK (true);

-- 4. Criar política para VISUALIZAÇÃO PÚBLICA (SELECT)
-- Apenas vagas ativas (is_active = true) são visíveis publicamente
CREATE POLICY "Ver apenas vagas ativas"
ON jobs FOR SELECT
USING (is_active = true);

-- 5. Criar política para ADMINISTRADORES (ALL)
-- Usuários logados (admin do dashboard) podem ver e editar tudo (incluindo pendentes)
CREATE POLICY "Admin acesso total"
ON jobs FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 6. Garantir que as colunas de contato existam (caso o script anterior não tenha sido rodado)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone TEXT;



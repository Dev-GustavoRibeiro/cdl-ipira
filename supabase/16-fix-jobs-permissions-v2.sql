-- CORREÇÃO CRÍTICA DE PERMISSÕES - VERSÃO 2 (SEM ERROS)
-- Execute este script para corrigir as permissões definitivamente

-- 1. Garantir que as colunas de contato existam
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- 2. Habilitar Segurança a Nível de Linha (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 3. Remover TODAS as políticas possíveis para evitar conflitos (erro 42710)
DROP POLICY IF EXISTS "Público pode criar vagas" ON jobs;
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON jobs;
DROP POLICY IF EXISTS "Admins podem fazer tudo em vagas" ON jobs;
DROP POLICY IF EXISTS "Enable insert for everyone" ON jobs;
DROP POLICY IF EXISTS "Admin full access" ON jobs;
DROP POLICY IF EXISTS "Permitir cadastro publico" ON jobs; -- Removendo a que deu erro
DROP POLICY IF EXISTS "Ver apenas vagas ativas" ON jobs;
DROP POLICY IF EXISTS "Admin acesso total" ON jobs;

-- 4. Criar política para VISUALIZAÇÃO PÚBLICA (SELECT)
-- Apenas vagas ativas (is_active = true) são visíveis publicamente
CREATE POLICY "Ver apenas vagas ativas"
ON jobs FOR SELECT
USING (is_active = true);

-- 5. Criar política para ADMINISTRADORES (ALL)
-- Usuários logados (admin do dashboard) podem ver e editar tudo
CREATE POLICY "Admin acesso total"
ON jobs FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');




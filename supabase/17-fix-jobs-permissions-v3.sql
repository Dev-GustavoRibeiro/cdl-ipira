-- CORREÇÃO DEFINITIVA DE PERMISSÕES - VERSÃO 3
-- Execute TODO este script de uma vez no Editor SQL do Supabase

-- 1. Garantir colunas necessárias
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- 2. Habilitar RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 3. Remover TODAS as políticas antigas (lista completa de tentativas anteriores)
DROP POLICY IF EXISTS "Público pode criar vagas" ON jobs;
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON jobs;
DROP POLICY IF EXISTS "Admins podem fazer tudo em vagas" ON jobs;
DROP POLICY IF EXISTS "Enable insert for everyone" ON jobs;
DROP POLICY IF EXISTS "Admin full access" ON jobs;
DROP POLICY IF EXISTS "Permitir cadastro publico" ON jobs;
DROP POLICY IF EXISTS "Ver apenas vagas ativas" ON jobs;
DROP POLICY IF EXISTS "Admin acesso total" ON jobs;
-- Variações possíveis
DROP POLICY IF EXISTS "ver apenas vagas ativas" ON jobs;
DROP POLICY IF EXISTS "admin acesso total" ON jobs;

-- 4. Criar políticas definitivas (com sufixo _v3 para evitar qualquer conflito residual)

-- Apenas leitura de vagas ativas para público (SELECT)
CREATE POLICY "Ver apenas vagas ativas_v3"
ON jobs FOR SELECT
USING (is_active = true);

-- Admin tem acesso total (ALL: Select, Insert, Update, Delete)
CREATE POLICY "Admin acesso total_v3"
ON jobs FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');




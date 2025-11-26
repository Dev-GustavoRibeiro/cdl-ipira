-- Adicionar colunas faltantes na tabela transparency_documents
-- Execute este script no Editor SQL do Supabase

-- Adicionar coluna category se não existir
ALTER TABLE transparency_documents ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Adicionar coluna description se não existir
ALTER TABLE transparency_documents ADD COLUMN IF NOT EXISTS description TEXT;

-- Adicionar coluna is_active se não existir
ALTER TABLE transparency_documents ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Adicionar coluna created_at se não existir
ALTER TABLE transparency_documents ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Adicionar coluna updated_at se não existir
ALTER TABLE transparency_documents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Garantir que RLS está habilitado
ALTER TABLE transparency_documents ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "transparency_documents_select_policy" ON transparency_documents;
DROP POLICY IF EXISTS "transparency_documents_insert_policy" ON transparency_documents;
DROP POLICY IF EXISTS "transparency_documents_update_policy" ON transparency_documents;
DROP POLICY IF EXISTS "transparency_documents_delete_policy" ON transparency_documents;

-- Criar políticas permissivas
CREATE POLICY "transparency_documents_select_policy" ON transparency_documents
FOR SELECT USING (true);

CREATE POLICY "transparency_documents_insert_policy" ON transparency_documents
FOR INSERT WITH CHECK (true);

CREATE POLICY "transparency_documents_update_policy" ON transparency_documents
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "transparency_documents_delete_policy" ON transparency_documents
FOR DELETE USING (true);

-- Criar índices para melhor performance (ignorar se já existirem)
CREATE INDEX IF NOT EXISTS idx_transparency_documents_date ON transparency_documents(date DESC);
CREATE INDEX IF NOT EXISTS idx_transparency_documents_category ON transparency_documents(category);
CREATE INDEX IF NOT EXISTS idx_transparency_documents_is_active ON transparency_documents(is_active);

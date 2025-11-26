-- Criar tabela de revistas CDL
-- Execute este script no Editor SQL do Supabase

-- Criar tabela magazines
CREATE TABLE IF NOT EXISTS magazines (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  edition VARCHAR(50),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_url TEXT,
  file_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas se a tabela já existir
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS edition VARCHAR(50);
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Habilitar RLS
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes
DROP POLICY IF EXISTS "magazines_select_policy" ON magazines;
DROP POLICY IF EXISTS "magazines_insert_policy" ON magazines;
DROP POLICY IF EXISTS "magazines_update_policy" ON magazines;
DROP POLICY IF EXISTS "magazines_delete_policy" ON magazines;

-- Políticas permissivas
CREATE POLICY "magazines_select_policy" ON magazines
FOR SELECT USING (true);

CREATE POLICY "magazines_insert_policy" ON magazines
FOR INSERT WITH CHECK (true);

CREATE POLICY "magazines_update_policy" ON magazines
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "magazines_delete_policy" ON magazines
FOR DELETE USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_magazines_date ON magazines(date DESC);
CREATE INDEX IF NOT EXISTS idx_magazines_is_active ON magazines(is_active);


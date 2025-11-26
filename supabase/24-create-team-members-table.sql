-- Criar tabela de membros da equipe (diretoria, colaboradores)
-- Execute este script no Editor SQL do Supabase

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('presidente', 'diretor', 'colaborador')),
  position VARCHAR(255) NOT NULL,
  photo_url TEXT,
  bio TEXT,
  contribution TEXT,
  function_description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar colunas se a tabela já existir
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS contribution TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS function_description TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Habilitar RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Remover TODAS as políticas existentes para esta tabela
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'team_members'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON team_members', pol.policyname);
    END LOOP;
END $$;

-- Políticas permissivas
CREATE POLICY "team_members_select_policy" ON team_members
FOR SELECT USING (true);

CREATE POLICY "team_members_insert_policy" ON team_members
FOR INSERT WITH CHECK (true);

CREATE POLICY "team_members_update_policy" ON team_members
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "team_members_delete_policy" ON team_members
FOR DELETE USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);


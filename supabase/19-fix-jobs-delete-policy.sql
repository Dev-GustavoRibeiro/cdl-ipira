-- CORREÇÃO DAS POLÍTICAS RLS PARA JOBS
-- Execute este script no Editor SQL do Supabase

-- Remover políticas existentes
DROP POLICY IF EXISTS "Ver apenas vagas ativas_v3" ON jobs;
DROP POLICY IF EXISTS "Admin acesso total_v3" ON jobs;
DROP POLICY IF EXISTS "Ver apenas vagas ativas" ON jobs;
DROP POLICY IF EXISTS "Admin acesso total" ON jobs;
DROP POLICY IF EXISTS "jobs_select_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_insert_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_update_policy" ON jobs;
DROP POLICY IF EXISTS "jobs_delete_policy" ON jobs;

-- Garantir que RLS está habilitado
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Política para SELECT: qualquer um pode ver todas as vagas
CREATE POLICY "jobs_select_policy" ON jobs
FOR SELECT USING (true);

-- Política para INSERT: permitir inserção
CREATE POLICY "jobs_insert_policy" ON jobs
FOR INSERT WITH CHECK (true);

-- Política para UPDATE: permitir atualização
CREATE POLICY "jobs_update_policy" ON jobs
FOR UPDATE USING (true) WITH CHECK (true);

-- Política para DELETE: permitir exclusão
CREATE POLICY "jobs_delete_policy" ON jobs
FOR DELETE USING (true);











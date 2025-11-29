-- Adicionar colunas de contato na tabela jobs
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Reforçar políticas RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Garantir que a política de insert público exista (remover anterior para evitar duplicidade se necessário ou usar CREATE OR REPLACE se suportado, mas aqui vamos dropar)
DROP POLICY IF EXISTS "Público pode criar vagas" ON jobs;

CREATE POLICY "Público pode criar vagas"
ON jobs FOR INSERT
WITH CHECK (true);

-- Garantir leitura para todos (apenas ativas)
DROP POLICY IF EXISTS "Vagas ativas são públicas" ON jobs;
CREATE POLICY "Vagas ativas são públicas"
ON jobs FOR SELECT
USING (is_active = true);

-- Admin vê tudo (assumindo role authenticated ou service_role que bypassa RLS, mas para dashboard client-side admin precisa de policy)
DROP POLICY IF EXISTS "Admins podem fazer tudo em vagas" ON jobs;
CREATE POLICY "Admins podem fazer tudo em vagas"
ON jobs FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');



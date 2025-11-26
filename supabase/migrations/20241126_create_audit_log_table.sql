-- Tabela de auditoria para registrar ações no banco de dados
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  record_title TEXT,
  user_id TEXT,
  user_name TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance nas consultas
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);

-- Habilitar RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajuste conforme necessário)
DROP POLICY IF EXISTS "Allow all for audit_log" ON audit_log;
CREATE POLICY "Allow all for audit_log" ON audit_log FOR ALL USING (true) WITH CHECK (true);

-- Comentários na tabela
COMMENT ON TABLE audit_log IS 'Tabela de auditoria para registrar todas as ações executadas no banco de dados';
COMMENT ON COLUMN audit_log.action IS 'Tipo de ação: CREATE, UPDATE, DELETE, LOGIN, LOGOUT';
COMMENT ON COLUMN audit_log.table_name IS 'Nome da tabela afetada';
COMMENT ON COLUMN audit_log.record_id IS 'ID do registro afetado';
COMMENT ON COLUMN audit_log.record_title IS 'Título/nome do registro para exibição';
COMMENT ON COLUMN audit_log.user_id IS 'ID do usuário que executou a ação';
COMMENT ON COLUMN audit_log.user_name IS 'Nome do usuário que executou a ação';
COMMENT ON COLUMN audit_log.details IS 'Detalhes adicionais da ação em JSON';
COMMENT ON COLUMN audit_log.ip_address IS 'Endereço IP do usuário';


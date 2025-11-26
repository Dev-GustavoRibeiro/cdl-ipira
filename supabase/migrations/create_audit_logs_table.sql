-- Tabela de auditoria para registrar ações no banco de dados
-- Execute este SQL no painel do Supabase (SQL Editor)

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE, LOGIN, LOGOUT, VIEW
  table_name VARCHAR(100) NOT NULL,
  record_id TEXT,
  record_title TEXT,
  user_id UUID,
  user_name VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance das consultas
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Habilitar RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção (qualquer requisição pode inserir)
CREATE POLICY "Allow insert for all" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura (qualquer requisição pode ler)
CREATE POLICY "Allow read for all" ON audit_logs
  FOR SELECT USING (true);

-- Comentários para documentação
COMMENT ON TABLE audit_logs IS 'Tabela de auditoria para registrar todas as ações executadas no banco de dados';
COMMENT ON COLUMN audit_logs.action IS 'Tipo de ação: INSERT, UPDATE, DELETE, LOGIN, LOGOUT, VIEW';
COMMENT ON COLUMN audit_logs.table_name IS 'Nome da tabela afetada pela ação';
COMMENT ON COLUMN audit_logs.record_id IS 'ID do registro afetado';
COMMENT ON COLUMN audit_logs.record_title IS 'Título ou identificador legível do registro';
COMMENT ON COLUMN audit_logs.details IS 'Detalhes adicionais da ação em formato JSON';


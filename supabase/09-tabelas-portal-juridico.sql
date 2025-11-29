-- Tabela para documentos do Portal da Transparência
CREATE TABLE IF NOT EXISTS transparency_documents (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT DEFAULT 'PDF',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para solicitações de Orientação Jurídica
CREATE TABLE IF NOT EXISTS legal_requests (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  empresa TEXT NOT NULL,
  assunto TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



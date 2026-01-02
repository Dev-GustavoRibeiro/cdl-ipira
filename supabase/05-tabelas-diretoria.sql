-- ============================================
-- PARTE 5: Tabelas de Diretoria
-- ============================================

-- Tabela para presidente
CREATE TABLE IF NOT EXISTS presidente (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT 'Presidente',
  foto TEXT NOT NULL,
  biografia TEXT NOT NULL,
  contribuicao TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para diretores
CREATE TABLE IF NOT EXISTS diretores (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  foto TEXT NOT NULL,
  contribuicao TEXT NOT NULL,
  funcao TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para colaboradores
CREATE TABLE IF NOT EXISTS colaboradores (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  foto TEXT NOT NULL,
  contribuicao TEXT NOT NULL,
  funcao TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);















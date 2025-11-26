-- ============================================
-- SCHEMA DO BANCO DE DADOS - CDL Ipirá
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABELAS DE CONTEÚDO
-- ============================================

-- Tabela para slides do Hero Carousel
CREATE TABLE IF NOT EXISTS hero_slides (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  button_link TEXT NOT NULL,
  gradient TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  image TEXT,
  pattern TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para notícias
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL,
  author TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para eventos
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  category TEXT NOT NULL,
  image TEXT,
  attendees INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'past')),
  gradient TEXT NOT NULL,
  month TEXT,
  year TEXT,
  full_date TEXT,
  participants TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para parceiros
CREATE TABLE IF NOT EXISTS partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  website TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para vídeos da TV Lojista
CREATE TABLE IF NOT EXISTS videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  video_url TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  duration TEXT,
  views TEXT DEFAULT '0',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para álbuns de fotos
CREATE TABLE IF NOT EXISTS albums (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  cover TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para fotos dentro dos álbuns
CREATE TABLE IF NOT EXISTS photos (
  id BIGSERIAL PRIMARY KEY,
  album_id BIGINT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para vagas de emprego
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL,
  location TEXT,
  date DATE,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para empresas associadas
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  logo TEXT,
  descricao TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELAS DE DIRETORIA
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

-- ============================================
-- TABELA DE AUTENTICAÇÃO
-- ============================================

-- Tabela para usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  full_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

-- Índices para hero_slides
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_index);

-- Índices para news
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- Índices para events
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);

-- Índices para partners
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_order ON partners(order_index);

-- Índices para videos
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active);
CREATE INDEX IF NOT EXISTS idx_videos_date ON videos(date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category);

-- Índices para albums
CREATE INDEX IF NOT EXISTS idx_albums_active ON albums(is_active);
CREATE INDEX IF NOT EXISTS idx_albums_category ON albums(category);
CREATE INDEX IF NOT EXISTS idx_albums_date ON albums(date DESC);

-- Índices para photos
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id);
CREATE INDEX IF NOT EXISTS idx_photos_order ON photos(album_id, order_index);

-- Índices para jobs
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_date ON jobs(date DESC);

-- Índices para companies
CREATE INDEX IF NOT EXISTS idx_companies_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(categoria);

-- Índices para presidente
CREATE INDEX IF NOT EXISTS idx_presidente_active ON presidente(is_active);

-- Índices para diretores
CREATE INDEX IF NOT EXISTS idx_diretores_active ON diretores(is_active);
CREATE INDEX IF NOT EXISTS idx_diretores_order ON diretores(order_index);

-- Índices para colaboradores
CREATE INDEX IF NOT EXISTS idx_colaboradores_active ON colaboradores(is_active);
CREATE INDEX IF NOT EXISTS idx_colaboradores_order ON colaboradores(order_index);

-- Índices para admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- ============================================
-- TRIGGERS PARA updated_at
-- ============================================

CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presidente_updated_at
  BEFORE UPDATE ON presidente
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diretores_updated_at
  BEFORE UPDATE ON diretores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colaboradores_updated_at
  BEFORE UPDATE ON colaboradores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERÇÃO DO USUÁRIO ADMIN INICIAL
-- ============================================
-- Senha: @CdlIpira@2026!
-- Hash gerado com bcrypt (custo 10)
-- Para gerar um novo hash, use: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('@CdlIpira@2026!', 10).then(h => console.log(h));"

INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'cdlipiraadmin',
  '$2b$10$rK8X9vJ5YqH3mN7pL2wZ8eF4gH6jK8mN3pL5wZ8eF4gH6jK8mN3p',
  'admin@cdlipira.org.br',
  'Administrador CDL Ipirá',
  true
)
ON CONFLICT (username) DO NOTHING;






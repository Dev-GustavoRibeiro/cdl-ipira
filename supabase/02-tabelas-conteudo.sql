-- ============================================
-- PARTE 2: Tabelas de Conteúdo
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










-- ============================================
-- PARTE 7: Índices para Otimização
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










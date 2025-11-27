-- =====================================================
-- POLÍTICAS DE SEGURANÇA - ROW LEVEL SECURITY (RLS)
-- CDL Ipirá - Segurança de Banco de Dados
-- =====================================================

-- Este script configura as políticas de segurança para todas as tabelas
-- garantindo que apenas usuários autorizados possam acessar/modificar dados

-- NOTA: Execute este script em partes se encontrar erros.
-- Algumas tabelas podem não existir no seu banco de dados.

-- =====================================================
-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- =====================================================

-- Tabela de usuários administrativos
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;

-- Tabela de notícias
ALTER TABLE IF EXISTS news ENABLE ROW LEVEL SECURITY;

-- Tabela de eventos
ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY;

-- Tabela de parceiros
ALTER TABLE IF EXISTS partners ENABLE ROW LEVEL SECURITY;

-- Tabela de vídeos
ALTER TABLE IF EXISTS videos ENABLE ROW LEVEL SECURITY;

-- Tabela de vagas
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;

-- Tabela de banners (hero_slides)
ALTER TABLE IF EXISTS hero_slides ENABLE ROW LEVEL SECURITY;

-- Tabela de auditoria
ALTER TABLE IF EXISTS audit_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. POLÍTICAS PARA TABELA admin_users
-- =====================================================

-- Nenhum acesso público
DROP POLICY IF EXISTS "admin_users_no_public_access" ON admin_users;
CREATE POLICY "admin_users_no_public_access" ON admin_users
  FOR ALL
  TO public
  USING (false);

-- Apenas service_role pode acessar (usado pelas APIs do servidor)
DROP POLICY IF EXISTS "admin_users_service_role_access" ON admin_users;
CREATE POLICY "admin_users_service_role_access" ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 3. POLÍTICAS PARA TABELAS PÚBLICAS (LEITURA)
-- =====================================================

-- NEWS: Leitura pública de notícias publicadas (usa is_published)
DROP POLICY IF EXISTS "news_public_read" ON news;
CREATE POLICY "news_public_read" ON news
  FOR SELECT
  TO public
  USING (is_published = true);

-- NEWS: Escrita apenas via service_role
DROP POLICY IF EXISTS "news_service_write" ON news;
CREATE POLICY "news_service_write" ON news
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- EVENTS: Leitura pública de eventos ativos (usa is_active)
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events
  FOR SELECT
  TO public
  USING (is_active = true);

-- EVENTS: Escrita apenas via service_role
DROP POLICY IF EXISTS "events_service_write" ON events;
CREATE POLICY "events_service_write" ON events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- PARTNERS: Leitura pública de parceiros ativos (usa is_active)
DROP POLICY IF EXISTS "partners_public_read" ON partners;
CREATE POLICY "partners_public_read" ON partners
  FOR SELECT
  TO public
  USING (is_active = true);

-- PARTNERS: Escrita apenas via service_role
DROP POLICY IF EXISTS "partners_service_write" ON partners;
CREATE POLICY "partners_service_write" ON partners
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- VIDEOS: Leitura pública de vídeos ativos (usa is_active)
DROP POLICY IF EXISTS "videos_public_read" ON videos;
CREATE POLICY "videos_public_read" ON videos
  FOR SELECT
  TO public
  USING (is_active = true);

-- VIDEOS: Escrita apenas via service_role
DROP POLICY IF EXISTS "videos_service_write" ON videos;
CREATE POLICY "videos_service_write" ON videos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- JOBS: Leitura pública de vagas ativas (usa is_active)
DROP POLICY IF EXISTS "jobs_public_read" ON jobs;
CREATE POLICY "jobs_public_read" ON jobs
  FOR SELECT
  TO public
  USING (is_active = true);

-- JOBS: Escrita apenas via service_role
DROP POLICY IF EXISTS "jobs_service_write" ON jobs;
CREATE POLICY "jobs_service_write" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- HERO_SLIDES: Leitura pública de banners ativos (usa is_active)
DROP POLICY IF EXISTS "hero_slides_public_read" ON hero_slides;
CREATE POLICY "hero_slides_public_read" ON hero_slides
  FOR SELECT
  TO public
  USING (is_active = true);

-- HERO_SLIDES: Escrita apenas via service_role
DROP POLICY IF EXISTS "hero_slides_service_write" ON hero_slides;
CREATE POLICY "hero_slides_service_write" ON hero_slides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. POLÍTICAS PARA TABELA audit_log
-- =====================================================

-- Nenhum acesso público à auditoria
DROP POLICY IF EXISTS "audit_no_public_access" ON audit_log;
CREATE POLICY "audit_no_public_access" ON audit_log
  FOR SELECT
  TO public
  USING (false);

-- Apenas service_role pode ler e inserir
DROP POLICY IF EXISTS "audit_service_role_read" ON audit_log;
CREATE POLICY "audit_service_role_read" ON audit_log
  FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "audit_service_role_insert" ON audit_log;
CREATE POLICY "audit_service_role_insert" ON audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Proibir UPDATE e DELETE em logs de auditoria (imutabilidade)
DROP POLICY IF EXISTS "audit_no_update" ON audit_log;
CREATE POLICY "audit_no_update" ON audit_log
  FOR UPDATE
  TO service_role
  USING (false);

DROP POLICY IF EXISTS "audit_no_delete" ON audit_log;
CREATE POLICY "audit_no_delete" ON audit_log
  FOR DELETE
  TO service_role
  USING (false);

-- =====================================================
-- 5. ÍNDICES PARA PERFORMANCE E SEGURANÇA
-- =====================================================

-- Índices para busca eficiente
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active) WHERE is_active = true;

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_ip ON audit_log(ip_address);

-- =====================================================
-- 6. FUNÇÃO DE VALIDAÇÃO JSON (OPCIONAL)
-- =====================================================

-- Função para validar dados de entrada (prevenir padrões perigosos em campos JSON)
CREATE OR REPLACE FUNCTION validate_jsonb_input(data JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se não contém comandos SQL perigosos
  IF data::text ~* '(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT|UPDATE|EXEC|EXECUTE|UNION|SELECT.*FROM)' THEN
    RETURN false;
  END IF;
  
  -- Verificar se não contém scripts
  IF data::text ~* '(<script|javascript:|on\w+=)' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- =====================================================
-- NOTAS DE SEGURANÇA
-- =====================================================
-- 
-- 1. Sempre use SUPABASE_SERVICE_ROLE_KEY apenas no servidor
-- 2. Nunca exponha a service key no frontend
-- 3. Use NEXT_PUBLIC_SUPABASE_ANON_KEY para operações públicas
-- 4. Revise as políticas regularmente
-- 5. Monitore os logs de auditoria para atividades suspeitas
-- 6. Mantenha backups regulares do banco de dados
-- =====================================================

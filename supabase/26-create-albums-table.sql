-- Criar tabela de álbuns da galeria
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  cover_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de fotos dos álbuns
CREATE TABLE IF NOT EXISTS album_photos (
  id SERIAL PRIMARY KEY,
  album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_album_photos_album_id ON album_photos(album_id);

-- Habilitar RLS
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;

-- Políticas para albums
DROP POLICY IF EXISTS "albums_select_policy" ON albums;
DROP POLICY IF EXISTS "albums_insert_policy" ON albums;
DROP POLICY IF EXISTS "albums_update_policy" ON albums;
DROP POLICY IF EXISTS "albums_delete_policy" ON albums;

CREATE POLICY "albums_select_policy" ON albums
  FOR SELECT USING (true);

CREATE POLICY "albums_insert_policy" ON albums
  FOR INSERT WITH CHECK (true);

CREATE POLICY "albums_update_policy" ON albums
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "albums_delete_policy" ON albums
  FOR DELETE USING (true);

-- Políticas para album_photos
DROP POLICY IF EXISTS "album_photos_select_policy" ON album_photos;
DROP POLICY IF EXISTS "album_photos_insert_policy" ON album_photos;
DROP POLICY IF EXISTS "album_photos_update_policy" ON album_photos;
DROP POLICY IF EXISTS "album_photos_delete_policy" ON album_photos;

CREATE POLICY "album_photos_select_policy" ON album_photos
  FOR SELECT USING (true);

CREATE POLICY "album_photos_insert_policy" ON album_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "album_photos_update_policy" ON album_photos
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "album_photos_delete_policy" ON album_photos
  FOR DELETE USING (true);


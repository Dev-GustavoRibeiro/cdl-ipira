-- Criar bucket de storage para fotos da galeria
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Políticas de acesso ao storage
DROP POLICY IF EXISTS "gallery_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "gallery_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "gallery_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "gallery_delete_policy" ON storage.objects;

-- Permitir leitura pública
CREATE POLICY "gallery_select_policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

-- Permitir upload
CREATE POLICY "gallery_insert_policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery');

-- Permitir atualização
CREATE POLICY "gallery_update_policy" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');

-- Permitir exclusão
CREATE POLICY "gallery_delete_policy" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery');

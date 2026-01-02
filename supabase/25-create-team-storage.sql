-- Criar bucket para fotos da equipe
-- Execute este script no Editor SQL do Supabase

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  true,
  10485760, -- 10MB para fotos
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Políticas de storage
CREATE POLICY "Leitura publica team photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-photos');

CREATE POLICY "Upload team photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "Update team photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'team-photos');

CREATE POLICY "Delete team photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-photos');











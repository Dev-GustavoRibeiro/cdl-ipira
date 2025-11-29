-- Criar bucket para revistas CDL
-- Execute este script no Editor SQL do Supabase

-- Criar o bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'magazines',
  'magazines',
  true,
  104857600, -- 100MB para revistas/PDFs maiores
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600;

-- Políticas de storage para o bucket magazines
CREATE POLICY "Leitura publica magazines"
ON storage.objects FOR SELECT
USING (bucket_id = 'magazines');

CREATE POLICY "Upload magazines"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'magazines');

CREATE POLICY "Update magazines"
ON storage.objects FOR UPDATE
USING (bucket_id = 'magazines');

CREATE POLICY "Delete magazines"
ON storage.objects FOR DELETE
USING (bucket_id = 'magazines');



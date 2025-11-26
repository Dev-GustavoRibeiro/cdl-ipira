-- Criar bucket para documentos de transparência
-- Execute este script no Editor SQL do Supabase

-- Criar o bucket (se não existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'transparency-documents',
  'transparency-documents',
  true,
  52428800, -- 50MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Políticas de storage para o bucket
DROP POLICY IF EXISTS "Permitir leitura pública" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização" ON storage.objects;
DROP POLICY IF EXISTS "Permitir exclusão" ON storage.objects;

-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública transparencia"
ON storage.objects FOR SELECT
USING (bucket_id = 'transparency-documents');

-- Permitir upload
CREATE POLICY "Permitir upload transparencia"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'transparency-documents');

-- Permitir atualização
CREATE POLICY "Permitir atualizacao transparencia"
ON storage.objects FOR UPDATE
USING (bucket_id = 'transparency-documents');

-- Permitir exclusão
CREATE POLICY "Permitir exclusao transparencia"
ON storage.objects FOR DELETE
USING (bucket_id = 'transparency-documents');


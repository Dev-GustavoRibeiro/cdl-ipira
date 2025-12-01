-- Criar bucket 'news' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('news', 'news', true)
ON CONFLICT (id) DO NOTHING;

-- Política de acesso público para leitura
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'news' );

-- Política para permitir upload para usuários autenticados (ou todos por enquanto se for admin público)
-- Ajuste conforme a autenticação do seu projeto. Aqui permitindo para todos para facilitar o teste/desenvolvimento se não houver auth forte configurada no admin.
CREATE POLICY "Allow Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'news' );

CREATE POLICY "Allow Updates"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'news' );

CREATE POLICY "Allow Deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'news' );






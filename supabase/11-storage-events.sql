-- Criar bucket 'events' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket 'events'
-- Primeiro removemos se existirem para evitar conflito
DROP POLICY IF EXISTS "Public Access Events" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads Events" ON storage.objects;
DROP POLICY IF EXISTS "Allow Updates Events" ON storage.objects;
DROP POLICY IF EXISTS "Allow Deletes Events" ON storage.objects;

-- Política de acesso público para leitura
CREATE POLICY "Public Access Events"
ON storage.objects FOR SELECT
USING ( bucket_id = 'events' );

-- Política para permitir upload
CREATE POLICY "Allow Uploads Events"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'events' );

-- Políticas adicionais para update/delete
CREATE POLICY "Allow Updates Events"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'events' );

CREATE POLICY "Allow Deletes Events"
ON storage.objects FOR DELETE
USING ( bucket_id = 'events' );

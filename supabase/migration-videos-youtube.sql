-- Script para atualizar a tabela de vídeos
-- Suporte a YouTube ID

ALTER TABLE videos ADD COLUMN IF NOT EXISTS youtube_id TEXT;
ALTER TABLE videos ALTER COLUMN video_url DROP NOT NULL;
ALTER TABLE videos ALTER COLUMN thumbnail DROP NOT NULL;

-- Se a URL já existir, tenta extrair o ID (simplificado, ideal é fazer no app)
-- UPDATE videos SET youtube_id = SUBSTRING(video_url FROM 'v=([^&]*)') WHERE video_url LIKE '%youtube.com%';
-- UPDATE videos SET youtube_id = SUBSTRING(video_url FROM 'youtu.be/([^?]*)') WHERE video_url LIKE '%youtu.be%';



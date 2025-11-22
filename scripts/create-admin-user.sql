-- Script para criar o usuário admin
-- Execute este script no Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- IMPORTANTE: Você precisa gerar um hash bcrypt para sua senha.
-- Senha sugerida: @CdlIpira@2026!
-- Você pode gerar o hash em: https://bcrypt-generator.com/ (Use 10 rounds)
-- Exemplo de hash (NÃO USE ESTE EM PRODUÇÃO SE POSSÍVEL): $2a$10$K7.O/s.O/s.O/s.O/s.O/s.O/s.O/s.O/s.O/s.O/s.O/s.O/s

INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'cdlipiraadmin',
  '$2a$10$YOUR_GENERATED_HASH_HERE', -- SUBSTITUA ISSO PELO SEU HASH GERADO
  'admin@cdlipira.org.br',
  'Administrador CDL Ipirá',
  true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active;

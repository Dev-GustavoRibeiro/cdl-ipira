-- Autenticação customizada substituída pelo Supabase Auth.
-- Rodar SOMENTE depois que o administrador conseguir entrar com o novo login.
drop function if exists public.cleanup_expired_admin_sessions();
drop table if exists public.admin_sessions;
drop table if exists public.admin_users;

-- Funções SECURITY DEFINER não devem ser chamáveis pela API pública
revoke execute on function public.validate_jsonb_input(jsonb) from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

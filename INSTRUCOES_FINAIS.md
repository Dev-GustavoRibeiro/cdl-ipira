# Instruções Finais para Conexão com Supabase

O projeto foi configurado para conectar ao Supabase e utilizar as APIs de Vagas e Notícias.

## 1. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as seguintes chaves (substitua pelos valores do seu projeto Supabase):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://emevgmeevatiirucafft.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_secreta
```

Você pode encontrar essas chaves no painel do Supabase em **Project Settings > API**.

## 2. Criar Tabelas no Banco de Dados

Acesse o **SQL Editor** no painel do Supabase e execute os scripts na pasta `supabase/` na seguinte ordem:

1. `supabase/01-funcao-updated-at.sql`
2. `supabase/02-tabelas-conteudo.sql`
3. `supabase/03-tabelas-fotos.sql`
4. `supabase/04-tabelas-empregos-empresas.sql`
5. `supabase/05-tabelas-diretoria.sql`
6. `supabase/06-tabela-admin-users.sql`
7. `supabase/07-indices.sql`
8. `supabase/08-triggers.sql`

## 3. Criar Usuário Administrador

1. Gere um hash bcrypt para sua senha (ex: usando https://bcrypt-generator.com/).
2. Edite o script `scripts/create-admin-user.sql` colocando seu hash gerado.
3. Execute o script no SQL Editor do Supabase.

## 4. Verificar Funcionalidades

Após configurar o banco e as variáveis de ambiente:
- **Vagas**: Acesse `/balcao-empregos`. As vagas cadastradas no banco aparecerão. O cadastro via formulário salvará no banco (aguardando aprovação).
- **Notícias**: Acesse `/noticias`. As notícias publicadas aparecerão.
- **Admin**: Acesse `/admin/login` e entre com as credenciais criadas.

## Observações
- A conexão direta via ferramenta falhou por timeout, por isso a configuração manual das tabelas é necessária.
- O arquivo `env.example` contém o template das variáveis.


# 🚀 Instalação e Configuração do Supabase

## Passos para Configurar o Banco de Dados

### 1. Criar Projeto no Supabase

1. Acesse https://supabase.com e crie uma conta (se ainda não tiver)
2. Crie um novo projeto
3. Anote:
   - **URL do Projeto** (ex: `https://xxxxx.supabase.co`)
   - **Service Role Key** (Settings > API > service_role key)

### 2. Executar o Schema SQL

1. No Supabase Dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie TODO o conteúdo e cole no SQL Editor
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde a execução completar

### 3. Criar o Usuário Admin

#### Gerar Hash da Senha

**Opção 1: Usando Node.js (Recomendado)**

```bash
# Instalar bcryptjs
npm install bcryptjs

# Executar o script
node scripts/generate-password-hash.js
```

Copie o hash gerado.

**Opção 2: Usando Ferramenta Online**

1. Acesse https://bcrypt-generator.com/
2. Digite a senha: `@CdlIpira@2026!`
3. Rounds: `10`
4. Clique em "Generate Hash"
5. Copie o hash gerado

#### Inserir Usuário no Banco

No SQL Editor do Supabase, execute:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'cdlipiraadmin',
  'COLE_O_HASH_GERADO_AQUI',  -- Substitua pelo hash real
  'admin@cdlipira.org.br',
  'Administrador CDL Ipirá',
  true
)
ON CONFLICT (username) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_active = EXCLUDED.is_active;
```

### 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

**⚠️ IMPORTANTE:** 
- NUNCA commite o arquivo `.env.local` no Git
- Use a **Service Role Key**, não a anon key
- A Service Role Key está em: Settings > API > service_role (secret)

### 5. Instalar Dependências

```bash
npm install
```

Isso instalará automaticamente:
- `@supabase/supabase-js`
- `bcryptjs`
- `@types/bcryptjs`

### 6. Testar a Configuração

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse http://localhost:3000/admin/login

3. Faça login com:
   - **Usuário:** `cdlipiraadmin`
   - **Senha:** `@CdlIpira@2026!`

4. Se conseguir acessar o dashboard, está tudo funcionando! ✅

## 📋 Estrutura das Tabelas Criadas

O schema cria as seguintes tabelas:

### Conteúdo do Site
- `hero_slides` - Slides do carrossel principal
- `news` - Notícias
- `events` - Eventos
- `partners` - Parceiros
- `videos` - Vídeos da TV Lojista
- `albums` - Álbuns de fotos
- `photos` - Fotos dentro dos álbuns
- `jobs` - Vagas de emprego
- `companies` - Empresas associadas

### Diretoria
- `presidente` - Informações do presidente
- `diretores` - Diretores
- `colaboradores` - Colaboradores

### Autenticação
- `admin_users` - Usuários administrativos

## 🔐 Credenciais Padrão

- **Usuário:** `cdlipiraadmin`
- **Senha:** `@CdlIpira@2026!`

**⚠️ IMPORTANTE:** Altere a senha após o primeiro acesso em produção!

## 🆘 Problemas Comuns

### Erro: "Failed to run sql query"
- Verifique sua conexão com a internet
- Tente executar o SQL em partes menores
- Verifique se há erros de sintaxe

### Erro: "Invalid credentials"
- Verifique se o usuário foi criado: `SELECT * FROM admin_users;`
- Confirme que o hash da senha está correto
- Verifique se `is_active = true`

### Erro: "Connection timeout"
- Tente executar o SQL diretamente no Supabase Dashboard
- Verifique se o projeto Supabase está ativo
- Aguarde alguns minutos e tente novamente

### Erro: "Cannot find module '@supabase/supabase-js'"
- Execute: `npm install`
- Verifique se o `package.json` foi atualizado corretamente

## 📚 Próximos Passos

Após configurar o banco de dados:

1. ✅ Tabelas criadas
2. ✅ Usuário admin criado
3. ✅ Variáveis de ambiente configuradas
4. ✅ Autenticação funcionando
5. ⏭️ Implementar APIs para CRUD de conteúdo
6. ⏭️ Conectar componentes do frontend às APIs

## 📝 Notas

- Todas as tabelas têm campos `created_at` e `updated_at` automáticos
- Triggers atualizam `updated_at` automaticamente
- Índices foram criados para otimizar consultas
- Todas as tabelas têm campo `is_active` para soft delete





# 📋 Guia Passo a Passo: Criar Tabelas no Supabase

Como o MCP está com problemas de conexão, siga estes passos para criar as tabelas manualmente no Supabase Dashboard.

## 🎯 Passo a Passo

### 1. Acessar o SQL Editor do Supabase

1. Acesse https://supabase.com e faça login
2. Selecione seu projeto
3. No menu lateral, clique em **"SQL Editor"** (ou "Editor SQL")
4. Clique em **"New Query"** (Nova Consulta)

### 2. Executar os Scripts em Ordem

Execute cada arquivo SQL na ordem abaixo, copiando e colando o conteúdo no SQL Editor:

#### ✅ Passo 1: Função updated_at
- Abra o arquivo: `supabase/01-funcao-updated-at.sql`
- Copie TODO o conteúdo
- Cole no SQL Editor do Supabase
- Clique em **"Run"** (ou pressione `Ctrl+Enter`)
- Aguarde a mensagem de sucesso: "Success. No rows returned"

#### ✅ Passo 2: Tabelas de Conteúdo
- Abra o arquivo: `supabase/02-tabelas-conteudo.sql`
- Copie TODO o conteúdo
- Cole no SQL Editor (pode limpar o anterior ou criar nova query)
- Clique em **"Run"**
- Aguarde o sucesso

#### ✅ Passo 3: Tabelas de Fotos
- Abra o arquivo: `supabase/03-tabelas-fotos.sql`
- Copie TODO o conteúdo
- Cole e execute

#### ✅ Passo 4: Empregos e Empresas
- Abra o arquivo: `supabase/04-tabelas-empregos-empresas.sql`
- Copie TODO o conteúdo
- Cole e execute

#### ✅ Passo 5: Diretoria
- Abra o arquivo: `supabase/05-tabelas-diretoria.sql`
- Copie TODO o conteúdo
- Cole e execute

#### ✅ Passo 6: Usuários Admin
- Abra o arquivo: `supabase/06-tabela-admin-users.sql`
- Copie TODO o conteúdo
- Cole e execute

#### ✅ Passo 7: Índices
- Abra o arquivo: `supabase/07-indices.sql`
- Copie TODO o conteúdo
- Cole e execute

#### ✅ Passo 8: Triggers
- Abra o arquivo: `supabase/08-triggers.sql`
- Copie TODO o conteúdo
- Cole e execute

### 3. Verificar se as Tabelas Foram Criadas

1. No Supabase Dashboard, vá em **"Table Editor"** (Editor de Tabelas)
2. Você deve ver todas estas tabelas:
   - ✅ `hero_slides`
   - ✅ `news`
   - ✅ `events`
   - ✅ `partners`
   - ✅ `videos`
   - ✅ `albums`
   - ✅ `photos`
   - ✅ `jobs`
   - ✅ `companies`
   - ✅ `presidente`
   - ✅ `diretores`
   - ✅ `colaboradores`
   - ✅ `admin_users`

### 4. Criar o Usuário Admin

#### 4.1. Gerar Hash da Senha

**Opção A: Usando Node.js**
```bash
npm install bcryptjs
node scripts/generate-password-hash.js
```
Copie o hash gerado.

**Opção B: Usando Ferramenta Online**
1. Acesse https://bcrypt-generator.com/
2. Senha: `@CdlIpira@2026!`
3. Rounds: `10`
4. Clique em "Generate Hash"
5. Copie o hash

#### 4.2. Inserir Usuário no Banco

No SQL Editor do Supabase, execute:

```sql
INSERT INTO admin_users (username, password_hash, email, full_name, is_active)
VALUES (
  'cdlipiraadmin',
  'COLE_O_HASH_AQUI',  -- Substitua pelo hash gerado
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

**⚠️ IMPORTANTE:** Substitua `COLE_O_HASH_AQUI` pelo hash real gerado!

### 5. Verificar o Usuário Criado

No SQL Editor, execute:

```sql
SELECT id, username, email, full_name, is_active, created_at 
FROM admin_users 
WHERE username = 'cdlipiraadmin';
```

Você deve ver uma linha com os dados do usuário.

## ✅ Checklist Final

- [ ] Função `update_updated_at_column` criada
- [ ] Todas as 13 tabelas criadas
- [ ] Índices criados
- [ ] Triggers criados
- [ ] Usuário admin criado com hash correto
- [ ] Usuário verificado no banco

## 🆘 Problemas Comuns

### Erro: "relation already exists"
- Significa que a tabela já existe. Pode ignorar ou usar `DROP TABLE IF EXISTS nome_tabela;` antes.

### Erro: "syntax error"
- Verifique se copiou TODO o conteúdo do arquivo
- Verifique se não há caracteres especiais estranhos
- Tente executar linha por linha para identificar o problema

### Erro: "permission denied"
- Verifique se está usando a conta correta do Supabase
- Certifique-se de que tem permissões de administrador no projeto

### Não consigo ver as tabelas
- Aguarde alguns segundos após executar o SQL
- Recarregue a página do Table Editor
- Verifique se executou todos os scripts na ordem correta

## 📝 Notas

- Execute os scripts na ordem (1, 2, 3, 4, 5, 6, 7, 8)
- Cada script pode ser executado separadamente
- Se algum script falhar, verifique a mensagem de erro
- Os scripts usam `IF NOT EXISTS`, então podem ser executados múltiplas vezes sem problemas

## 🎉 Próximo Passo

Após criar todas as tabelas e o usuário admin:

1. Configure as variáveis de ambiente (`.env.local`)
2. Instale as dependências: `npm install`
3. Teste o login em `/admin/login`





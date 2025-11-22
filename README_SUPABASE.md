# Configuração do Supabase - CDL Ipirá

Este documento descreve como configurar o banco de dados Supabase para o projeto CDL Ipirá.

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase
3. Node.js instalado (para gerar hash de senha)

## 🚀 Passo a Passo

### 1. Criar o Projeto no Supabase

1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote a URL do projeto e a Service Role Key (em Settings > API)

### 2. Executar o Schema SQL

1. Acesse o SQL Editor no Supabase Dashboard
2. Copie o conteúdo do arquivo `supabase/schema.sql`
3. Cole e execute no SQL Editor
4. Verifique se todas as tabelas foram criadas

### 3. Criar o Usuário Admin

#### Opção A: Usando o Script Node.js (Recomendado)

1. Instale as dependências:
```bash
npm install bcryptjs
```

2. Execute o script para gerar o hash da senha:
```bash
node scripts/generate-password-hash.js
```

3. Copie o hash gerado

4. Edite o arquivo `scripts/create-admin-user.sql` e substitua `YOUR_BCRYPT_HASH_HERE` pelo hash gerado

5. Execute o SQL no Supabase SQL Editor:
```sql
-- Cole o conteúdo do arquivo scripts/create-admin-user.sql
```

#### Opção B: Usando uma Ferramenta Online

1. Acesse https://bcrypt-generator.com/
2. Digite a senha: `@CdlIpira@2026!`
3. Configure o número de rounds: `10`
4. Copie o hash gerado
5. Use no script `create-admin-user.sql` como descrito acima

### 4. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 5. Instalar Dependências do Projeto

```bash
npm install @supabase/supabase-js bcryptjs
```

## 📊 Estrutura das Tabelas

O schema cria as seguintes tabelas:

### Conteúdo
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

## 🔐 Credenciais do Admin

Após executar o script de criação do usuário:

- **Usuário:** `cdlipiraadmin`
- **Senha:** `@CdlIpira@2026!`

## 🔍 Verificação

Para verificar se tudo está funcionando:

1. Execute o projeto:
```bash
npm run dev
```

2. Acesse http://localhost:3000/admin/login
3. Faça login com as credenciais acima
4. Se conseguir acessar o dashboard, está tudo configurado!

## ⚠️ Notas Importantes

- **NUNCA** commite o arquivo `.env.local` no Git
- A `SUPABASE_SERVICE_ROLE_KEY` deve ser mantida em segredo
- Em produção, use variáveis de ambiente do seu provedor de hospedagem
- O hash da senha no banco de dados é seguro (bcrypt com 10 rounds)

## 🆘 Troubleshooting

### Erro: "Failed to run sql query"
- Verifique se a conexão com o Supabase está ativa
- Tente executar o SQL em partes menores
- Verifique se há algum erro de sintaxe no SQL

### Erro: "Invalid credentials"
- Verifique se o usuário foi criado corretamente
- Confirme que o hash da senha está correto
- Verifique se `is_active = true` na tabela `admin_users`

### Erro: "Connection timeout"
- Verifique sua conexão com a internet
- Tente novamente após alguns minutos
- Execute o SQL diretamente no Supabase Dashboard





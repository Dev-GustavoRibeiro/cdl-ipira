# 🚀 Guia de Deploy - CDL Ipirá

Este guia fornece instruções detalhadas para fazer o deploy do site da CDL Ipirá.

## 📋 Pré-requisitos

Antes de fazer o deploy, certifique-se de que:

- [ ] Todas as informações de contato foram atualizadas
- [ ] As imagens foram otimizadas e adicionadas
- [ ] Os links das redes sociais estão corretos
- [ ] O site foi testado localmente em diferentes dispositivos
- [ ] Não há erros no console do navegador

## 🌐 Opções de Deploy

### 1. Vercel (Recomendado)

A Vercel é a plataforma oficial do Next.js e oferece deploy gratuito.

#### Passos:

1. **Crie uma conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub, GitLab ou Bitbucket

2. **Instale o Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Faça login no CLI**
   ```bash
   vercel login
   ```

4. **Deploy do projeto**
   ```bash
   vercel
   ```

5. **Deploy para produção**
   ```bash
   vercel --prod
   ```

#### Via GitHub (Automatizado):

1. Crie um repositório no GitHub
2. Faça push do código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/cdl-ipira.git
   git push -u origin main
   ```

3. Na Vercel:
   - Clique em "New Project"
   - Importe o repositório do GitHub
   - Configure (geralmente auto-detecta)
   - Deploy!

**Vantagens:**
- Deploy gratuito
- SSL automático
- CDN global
- Deploy automático a cada push
- Preview deployments

---

### 2. Netlify

Alternativa popular com recursos similares à Vercel.

#### Passos:

1. **Crie uma conta na Netlify**
   - Acesse [netlify.com](https://netlify.com)

2. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Deploy via Git**
   - Conecte seu repositório
   - Configure as settings
   - Deploy automático

#### Via Netlify CLI:

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Vantagens:**
- Interface intuitiva
- Formulários nativos
- Funções serverless
- Split testing A/B

---

### 3. Hospedagem Tradicional (cPanel)

Para hospedagem compartilhada tradicional.

#### Passos:

1. **Gere o build estático**
   ```bash
   npm run build
   ```

2. **Configure o next.config.ts** para export estático:
   ```typescript
   const nextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   };
   ```

3. **Gere os arquivos estáticos**
   ```bash
   npm run build
   ```
   Isso criará uma pasta `out/` com os arquivos estáticos.

4. **Upload via FTP**
   - Faça upload da pasta `out/` para `public_html/`
   - Configure o domínio no cPanel

**⚠️ Limitações:**
- Sem API Routes
- Sem ISR (Incremental Static Regeneration)
- Sem otimização de imagens automática

---

### 4. DigitalOcean App Platform

Opção com mais controle e recursos.

#### Passos:

1. **Crie uma conta no DigitalOcean**
   - Acesse [digitalocean.com](https://digitalocean.com)

2. **Crie um App**
   - Apps → Create App
   - Conecte o repositório GitHub

3. **Configure o ambiente**
   ```
   Build Command: npm run build
   Run Command: npm start
   ```

4. **Configure o plano** (a partir de $5/mês)

**Vantagens:**
- Servidor dedicado
- Controle total
- Escalabilidade
- Banco de dados integrado

---

### 5. AWS Amplify

Para quem usa ou quer usar AWS.

#### Passos:

1. **Console AWS Amplify**
   - Acesse o console AWS
   - Vá para Amplify

2. **Conecte o repositório**
   - GitHub, GitLab ou Bitbucket

3. **Configure build settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

**Vantagens:**
- Integração AWS
- SSL automático
- CI/CD integrado
- Muito escalável

---

## 🔧 Configurações Importantes

### Variáveis de Ambiente

Se você adicionar APIs ou integrações, crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.cdlipira.com.br
NEXT_PUBLIC_GOOGLE_MAPS_KEY=sua_chave_aqui
EMAIL_SERVICE_API_KEY=chave_do_servico_email
```

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env.local`
- Adicione ao `.gitignore`
- Configure as variáveis na plataforma de deploy

### .gitignore

Certifique-se de que o `.gitignore` contém:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

---

## 📊 Analytics e Monitoramento

### Google Analytics

1. **Crie uma propriedade no Google Analytics**

2. **Instale o pacote**
   ```bash
   npm install @next/third-parties
   ```

3. **Adicione ao layout.tsx**
   ```typescript
   import { GoogleAnalytics } from '@next/third-parties/google'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <GoogleAnalytics gaId="G-XXXXXXXXXX" />
         </body>
       </html>
     )
   }
   ```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🔒 Segurança

### Headers de Segurança

Adicione ao `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

---

## 🎯 Checklist Pré-Deploy

- [ ] Site funciona corretamente em localhost
- [ ] Todos os links foram testados
- [ ] Formulário de contato funciona
- [ ] Imagens carregam corretamente
- [ ] Site é responsivo (mobile, tablet, desktop)
- [ ] SEO otimizado (meta tags, sitemap)
- [ ] Favicon adicionado
- [ ] Performance testada (Lighthouse)
- [ ] Sem erros no console
- [ ] Links das redes sociais corretos
- [ ] Informações de contato atualizadas
- [ ] Google Analytics configurado (opcional)

---

## 📈 Performance

### Otimização de Imagens

Sempre use o componente `Image` do Next.js:

```typescript
import Image from 'next/image';

<Image 
  src="/imagem.jpg" 
  alt="Descrição"
  width={800}
  height={600}
  priority // Para imagens above the fold
/>
```

### Lazy Loading

Componentes pesados podem ser carregados dinamicamente:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Carregando...</p>,
});
```

---

## 🆘 Troubleshooting

### Erro: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falha
```bash
npm run build
# Verifique os erros e corrija
```

### Imagens não carregam
- Verifique se estão na pasta `public/`
- Use caminhos relativos: `/imagem.jpg`
- Configure `images.unoptimized: true` se necessário

### Formulário não funciona
- Configure um backend ou serviço de email
- Use Formspree, EmailJS ou similar
- Configure variáveis de ambiente

---

## 📞 Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **CDL Ipirá**: contato@cdlipira.com.br

---

**Boa sorte com o deploy! 🚀**


# CDL Ipirá - Site Oficial (Versão PWA + Admin)

Site institucional da Câmara de Dirigentes Lojistas de Ipirá, desenvolvido com Next.js 16 e TypeScript. Esta versão inclui um painel administrativo completo, funcionalidades de PWA (Progressive Web App) e design moderno com animações fluidas.

## 🚀 Tecnologias Utilizadas

- **Next.js 16.0.3** - Framework React para produção
- **React 19.2.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utility-first
- **Supabase** - Backend as a Service (Banco de Dados, Auth, Storage)
- **Swiper** - Carrosséis modernos e responsivos
- **Framer Motion / CSS Animations** - Animações fluidas
- **React Icons** - Biblioteca de ícones

## 📱 Funcionalidades PWA (Mobile App)

O site foi otimizado para funcionar como um aplicativo nativo em celulares:

- **Menu "Super App"**: Navegação inferior estilo app com gaveta deslizante (Bottom Sheet).
- **Instalação**: Pode ser instalado na tela inicial (Adicionar à Tela de Início).
- **Sem Barra de Navegador**: Roda em modo tela cheia (standalone).
- **Performance**: Otimização de carregamento e imagens.

## 🔐 Painel Administrativo

Acesse `/admin/login` para gerenciar o conteúdo do site.

### Funcionalidades do Admin:
- **Dashboard**: Visão geral do sistema.
- **Notícias**: Criar, editar e excluir notícias com editor de texto rico.
- **TV Lojista**: Gerenciar vídeos do YouTube.
- **Galeria de Fotos**: Upload e gerenciamento de álbuns.
- **Eventos**: Calendário de eventos da CDL.
- **Diretoria**: Gerenciar membros e cargos.
- **Parceiros**: Adicionar logos de empresas parceiras.

## 🎨 Cores e Design

O site utiliza a paleta oficial da CDL com toques modernos (Glassmorphism):

- **Azul Principal**: `#003f7f`
- **Azul Claro**: `#0066cc`
- **Verde**: `#00a859`
- **Amarelo**: `#ffd000`
- **Branco**: `#ffffff`

## 📋 Componentes da Página Inicial

### 1. Header
- Design limpo e minimalista.
- Apenas logos e busca em dispositivos móveis.
- Menu completo em desktops.

### 2. Hero Carousel (Banner Principal)
- Carrossel full-width moderno.
- Animações de texto e imagens.
- Botões de ação (CTA) com efeitos hover.

### 3. Impostômetro
- Contador em tempo real integrado via iframe oficial.
- Design responsivo que se adapta a qualquer tela.
- Remoção visual de propagandas externas.

### 4. Menu Mobile (App-like)
- Barra de navegação inferior fixa.
- Botão central "Menu" com destaque flutuante.
- Gaveta de menu com categorias e ícones grandes.

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (para o backend)

### Instalação

1. Navegue até a pasta do projeto:
```bash
cd cdl_ipira
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env.local`.
   - Preencha `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em [http://localhost:3000](http://localhost:3000)

## 🗄️ Configuração do Banco de Dados (Supabase)

Os scripts SQL para criar as tabelas estão na pasta `supabase/`:

1. `01-funcao-updated-at.sql`: Função utilitária.
2. `02-tabelas-conteudo.sql`: Tabelas principais (noticias, videos, etc).
3. `03-tabelas-fotos.sql`: Galeria de fotos.
4. `04-tabelas-empregos-empresas.sql`: Balcão de empregos.
5. `06-tabela-admin-users.sql`: Usuários do painel admin.

Execute-os no SQL Editor do seu projeto Supabase na ordem acima.

## 📝 Estrutura de Pastas

```
app/
├── admin/               # Painel Administrativo (rotas protegidas)
├── api/                 # API Routes (Next.js Backend)
├── components/          # Componentes React Reutilizáveis
│   ├── Header.tsx       # Cabeçalho Desktop
│   ├── MobileBottomNav.tsx # Menu Mobile Tipo App
│   ├── HeroCarousel.tsx # Banner Rotativo
│   └── ...
├── noticias/            # Páginas de Notícias (Público)
├── produtos/            # Páginas de Produtos
├── layout.tsx           # Layout Principal
└── page.tsx             # Página Inicial
```

## 🔒 Segurança

- **Middleware**: Proteção de rotas `/admin` e `/api/admin`.
- **Headers de Segurança**: Configurados no `next.config.ts` (XSS, Frame Options, etc).
- **Sanitização**: HTML sanitizado com `dompurify` para prevenir injeção de scripts.

## 🌐 Deploy

Recomendado usar **Vercel** para o frontend e **Supabase** para o backend.

1. Instale a Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

---

**Desenvolvido para CDL Ipirá**
**Versão**: 2.5.0 (PWA Edition)

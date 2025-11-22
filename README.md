# CDL Ipirá - Site Oficial

Site institucional da Câmara de Dirigentes Lojistas de Ipirá, desenvolvido com Next.js 16 e TypeScript, baseado fielmente no layout da CDL Sorriso.

## 🚀 Tecnologias Utilizadas

- **Next.js 16.0.3** - Framework React para produção
- **React 19.2.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Icons** - Biblioteca de ícones

## 🎨 Cores da CDL

O site utiliza a paleta oficial da CDL:

- **Azul Principal**: `#003f7f`
- **Azul Claro**: `#0066cc`
- **Verde**: `#00a859`
- **Amarelo**: `#ffd000`
- **Branco**: `#ffffff`

## 📋 Componentes da Página Inicial

### 1. Header
- Barra superior azul com informações de contato
- Logos CDL Ipirá e SPC Brasil lado a lado
- Menu horizontal com dropdowns
- Campo de busca integrado
- Menu mobile responsivo

### 2. Projeto Conduz
- Banner principal destacando o projeto social
- Imagem + texto descritivo
- Call-to-action "Saiba Mais"

### 3. Cards de Serviços
- Grid com 6 cards principais:
  - Eventos
  - Portal Transparência
  - Revista CDL
  - Baixe seu Boleto
  - Cadastre Seu Currículo
  - Compromisso da CDL
- Ícones verdes (#00a859)
- Efeito hover com elevação

### 4. Parceiros
- Logos de empresas parceiras
- Zag Seguros, Solturi Energia Solar, etc.
- Fundo cinza claro

### 5. Impostômetro
- Contador em tempo real
- Animação automática
- Fundo verde-água (teal)
- Display com milhões, mil, reais e centavos

### 6. Notícias
- Grid de 3 notícias recentes
- Cards com imagem, data, título e resumo
- Botão "Veja mais notícias"
- Fundo branco

### 7. Eventos
- Grid de 3 eventos
- Fundo azul (#003f7f)
- Cards em branco com imagens
- Botão "Veja mais Eventos"

### 8. TV Lojista
- Grid de 3 vídeos
- Thumbnails com play button
- Integração preparada para YouTube
- Botão "Veja mais TV Lojista"

### 9. Galeria de Fotos
- Grid de 3 galerias
- Contador de fotos em cada álbum
- Efeito zoom nas imagens
- Fundo cinza claro

### 10. Footer
- 5 colunas: Logos, Institucional, Imprensa, Filie-se/Benefícios, Produtos
- Informações completas de contato
- Links para redes sociais
- Seção verde (#00a859) com "Outras Informações"
- Copyright em azul escuro

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Navegue até a pasta do projeto:
```bash
cd c:\Users\josev\cdl_ipira
```

2. Instale as dependências (se necessário):
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em [http://localhost:3000](http://localhost:3000)

### Outros Comandos

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Executar linter
npm run lint

# Corrigir erros de lint automaticamente
npm run lint:fix

# Verificar tipos TypeScript
npm run type-check

# Limpar cache
npm run clean
```

## 📁 Estrutura de Componentes

```
app/
├── components/
│   ├── Header.tsx           # Cabeçalho com menu e busca
│   ├── ProjetoConduz.tsx    # Banner principal Projeto Conduz
│   ├── ServicesCards.tsx    # 6 cards de serviços principais
│   ├── Partners.tsx         # Logos de parceiros
│   ├── Impostometro.tsx     # Contador de impostos em tempo real
│   ├── NewsSection.tsx      # Seção de notícias
│   ├── EventsSection.tsx    # Seção de eventos
│   ├── TVLojista.tsx        # Vídeos da TV Lojista
│   ├── GaleriaFotos.tsx     # Galeria de fotos
│   └── Footer.tsx           # Rodapé completo
├── layout.tsx               # Layout principal
├── page.tsx                 # Página inicial
└── globals.css              # Estilos globais mínimos
```

## 🎯 Funcionalidades Implementadas

### Animações e Interatividade
- ✅ Hover effects em todos os cards
- ✅ Transições suaves
- ✅ Contador do Impostômetro em tempo real
- ✅ Menu mobile funcional
- ✅ Scroll suave

### Responsividade
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)
- ✅ Grids adaptáveis
- ✅ Menu hamburger

### SEO
- ✅ Meta tags otimizadas
- ✅ Estrutura semântica HTML5
- ✅ Alt texts em imagens
- ✅ URLs amigáveis

## 🖼️ Personalização de Imagens

Para substituir as imagens placeholder:

1. **Logos** (`Header.tsx`):
   - CDL Ipirá: linha 29
   - SPC Brasil: linha 30

2. **Projeto Conduz** (`ProjetoConduz.tsx`):
   - Imagem principal: linha 11
   - Logo do projeto: linha 19

3. **Notícias** (`NewsSection.tsx`):
   - Array `news`: linhas 7-27

4. **Eventos** (`EventsSection.tsx`):
   - Array `events`: linhas 7-21

5. **TV Lojista** (`TVLojista.tsx`):
   - Array `videos`: linhas 7-19

6. **Galeria** (`GaleriaFotos.tsx`):
   - Array `galleries`: linhas 7-21

7. **Footer** (`Footer.tsx`):
   - Logos: linhas 15-22

## 📝 Alterando Conteúdos

### Informações de Contato

Atualize em 3 locais:

1. **Header** (linha 13): Telefone no topo
2. **Footer** (linhas 114-135): Seção completa de contato
3. Links de redes sociais no Footer (linhas 19-29)

### Cores do Site

Edite `app/globals.css`:

```css
:root {
  --cdl-blue: #003f7f;        /* Azul principal */
  --cdl-blue-light: #0066cc;  /* Azul claro */
  --cdl-green: #00a859;       /* Verde */
  --cdl-yellow: #ffd000;      /* Amarelo */
  --cdl-white: #ffffff;       /* Branco */
}
```

## 🔄 Adicionando Conteúdo

### Adicionar Notícia

Em `NewsSection.tsx`, adicione no array `news`:

```typescript
{
  title: 'Título da Notícia',
  excerpt: 'Resumo da notícia...',
  image: '/caminho/para/imagem.jpg',
  date: '15/11/2024'
}
```

### Adicionar Evento

Em `EventsSection.tsx`, adicione no array `events`:

```typescript
{
  title: 'Nome do Evento',
  image: '/caminho/para/imagem.jpg',
  date: 'Data do evento'
}
```

### Adicionar Vídeo

Em `TVLojista.tsx`, adicione no array `videos`:

```typescript
{
  title: 'Título do Vídeo',
  thumbnail: '/caminho/para/thumbnail.jpg',
  embedId: 'ID_DO_VIDEO_YOUTUBE'
}
```

## 📊 Performance

O site está otimizado com:

- ✅ Next.js App Router
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ CSS otimizado com Tailwind
- ✅ Imagens responsivas (preparado para Next Image)

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Opção 2: Build Estático

```bash
npm run build
npm start
```

Consulte `DEPLOY.md` para mais opções detalhadas.

## 📱 Redes Sociais

Atualize os links em:
- **Header**: linha 13 (telefone)
- **Footer**: linhas 19-29 (ícones sociais)

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação do Next.js: [nextjs.org/docs](https://nextjs.org/docs)
2. Consulte a documentação do Tailwind: [tailwindcss.com/docs](https://tailwindcss.com/docs)
3. Entre em contato: contato@cdlipira.com.br

## ✅ Checklist de Personalização

- [ ] Substituir logo CDL Ipirá
- [ ] Substituir logo SPC Brasil
- [ ] Atualizar telefone de contato
- [ ] Atualizar e-mail
- [ ] Atualizar endereço
- [ ] Atualizar CNPJ
- [ ] Adicionar imagens do Projeto Conduz
- [ ] Adicionar notícias reais
- [ ] Adicionar eventos reais
- [ ] Adicionar vídeos reais
- [ ] Adicionar fotos das galerias
- [ ] Atualizar links de redes sociais
- [ ] Testar em dispositivos móveis
- [ ] Fazer deploy

---

**Desenvolvido com ❤️ para CDL Ipirá**

**Versão**: 2.0.0  
**Data**: Novembro 2024  
**Status**: ✅ Pronto para Produção
# cdl-ipira

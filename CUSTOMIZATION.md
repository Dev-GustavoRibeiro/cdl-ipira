# Guia de Personalização - CDL Ipirá

Este guia ajudará você a personalizar o site da CDL Ipirá de acordo com suas necessidades.

## 📝 Alterando Informações de Contato

### Header (app/components/Header.tsx)

**Linha 16-17**: Altere as redes sociais e informações de contato:
```typescript
<span className="text-sm">Contato: (75) 3000-0000 | contato@cdlipira.com.br</span>
```

**Linhas 19-31**: Links das redes sociais:
```typescript
<a href="https://www.facebook.com" target="_blank">
<a href="https://www.instagram.com" target="_blank">
<a href="https://wa.me/5575999999999" target="_blank">
```

### Footer (app/components/Footer.tsx)

**Linhas 88-108**: Informações de endereço, telefone e e-mail:
```typescript
<FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" size={18} />
<span className="text-gray-300 text-sm">
  Rua Principal, 123 - Centro<br />
  Ipirá - BA, CEP 44600-000
</span>
```

### Contato (app/components/Contact.tsx)

**Linhas 62-115**: Todas as informações de contato na seção de contato

## 🎨 Alterando Cores

### Método 1: Variáveis CSS (app/globals.css)

```css
:root {
  --primary-blue: #1e3a8a;      /* Cor principal */
  --secondary-blue: #1e40af;    /* Cor secundária */
  --light-blue: #3b82f6;        /* Azul claro */
  --dark-blue: #1e293b;         /* Azul escuro */
}
```

### Método 2: Classes Tailwind

Procure por classes como:
- `bg-blue-900` - Fundo azul escuro
- `text-blue-900` - Texto azul escuro
- `hover:bg-blue-800` - Hover azul

E substitua por outras cores do Tailwind:
- `bg-green-900`, `bg-red-900`, `bg-purple-900`, etc.

## 🖼️ Alterando Imagens

### Logo

**app/components/Header.tsx (linha 38-42)**:
```typescript
<div className="bg-blue-900 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl">
  CDL
</div>
```

Substitua por:
```typescript
<Image src="/logo.png" alt="CDL Ipirá" width={64} height={64} />
```

### Banner Principal

**app/components/Banner.tsx**: Adicione uma imagem de fundo:
```typescript
<section id="home" className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white"
         style={{backgroundImage: 'url(/banner.jpg)', backgroundSize: 'cover'}}>
```

### Notícias

**app/components/News.tsx (linhas 7-27)**: Substitua os placeholders:
```typescript
image: 'https://via.placeholder.com/400x250/1e3a8a/ffffff?text=Capacitacao+em+Vendas',
```

Por:
```typescript
image: '/noticias/capacitacao.jpg',
```

## 📄 Alterando Textos

### Banner Principal (app/components/Banner.tsx)

```typescript
<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
  CDL Ipirá
</h1>
<h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-200">
  Fortalecendo o Comércio Local
</h2>
```

### Sobre (app/components/About.tsx)

Edite todo o conteúdo da seção "Quem Somos" a partir da linha 44.

### Serviços (app/components/Services.tsx)

Array `services` (linhas 13-68): Edite título, descrição e ícones de cada serviço.

## 🔧 Adicionando Novos Serviços

**app/components/Services.tsx**:

```typescript
const services = [
  // ... serviços existentes
  {
    icon: <FaNewIcon className="text-5xl text-blue-600" />,
    title: 'Novo Serviço',
    description: 'Descrição do novo serviço aqui.',
    link: 'https://www.cdlsorriso.com.br/'
  }
];
```

## 🎯 Alterando Benefícios de Associados

**app/components/Associates.tsx (linhas 8-21)**:

```typescript
const benefits = [
  'Consultas SPC ilimitadas',
  'Assessoria jurídica gratuita',
  // Adicione ou remova benefícios aqui
];
```

## 💰 Alterando Preço da Associação

**app/components/Associates.tsx (linhas 96-99)**:

```typescript
<div className="flex items-center justify-center gap-2 mb-6">
  <span className="text-5xl font-bold text-blue-900">R$ 150</span>
  <span className="text-gray-600">/mês</span>
</div>
```

## 📰 Gerenciando Notícias

**app/components/News.tsx (linhas 7-27)**:

```typescript
const news = [
  {
    title: 'Título da Notícia',
    date: '15 de Novembro de 2024',
    excerpt: 'Resumo da notícia...',
    image: '/caminho/para/imagem.jpg',
    link: 'https://www.cdlsorriso.com.br/'
  },
  // Adicione mais notícias aqui
];
```

## 📅 Adicionando Eventos

**app/components/News.tsx (linhas 81-108)**:

```typescript
<div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
  <div className="flex items-start gap-4">
    <div className="bg-white text-blue-900 rounded-lg p-4 text-center min-w-[80px]">
      <div className="text-3xl font-bold">25</div>
      <div className="text-sm">NOV</div>
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2">Nome do Evento</h4>
      <p className="text-blue-100 mb-2">Descrição</p>
      <p className="text-sm text-blue-200">Horário: 14h às 18h</p>
    </div>
  </div>
</div>
```

## 🗺️ Alterando Localização no Mapa

**app/components/Contact.tsx (linha 122)**:

1. Acesse [Google Maps](https://www.google.com/maps)
2. Pesquise o endereço correto
3. Clique em "Compartilhar" > "Incorporar um mapa"
4. Copie o código iframe
5. Substitua o `src` do iframe atual

## 📱 Redes Sociais

Procure por todos os links de redes sociais e atualize:

```typescript
// Facebook
<a href="https://www.facebook.com/cdlipira" target="_blank">

// Instagram
<a href="https://www.instagram.com/cdlipira" target="_blank">

// WhatsApp (formato: https://wa.me/55DDNÚMERO)
<a href="https://wa.me/5575999999999" target="_blank">
```

## 🎨 Fontes

Para alterar a fonte do site:

**app/layout.tsx (linha 2)**:

```typescript
import { Inter } from "next/font/google";
```

Substitua por outra fonte do Google Fonts:

```typescript
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: "swap",
});
```

## 📊 SEO e Metadados

**app/layout.tsx (linhas 13-17)**:

```typescript
export const metadata: Metadata = {
  title: "CDL Ipirá - Câmara de Dirigentes Lojistas",
  description: "Sua descrição aqui...",
  keywords: "palavras-chave, separadas, por vírgula",
};
```

## 🔄 Depoimentos

**app/components/Associates.tsx (linhas 127-173)**:

```typescript
<div className="bg-white p-8 rounded-lg shadow-lg">
  <div className="flex items-center gap-4 mb-4">
    <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
      JM
    </div>
    <div>
      <h4 className="font-bold text-gray-900">João Miranda</h4>
      <p className="text-sm text-gray-600">Loja de Roupas</p>
    </div>
  </div>
  <p className="text-gray-700 italic">
    "Depoimento aqui..."
  </p>
</div>
```

## 🎯 Dicas Importantes

1. **Sempre teste localmente** após fazer alterações
2. **Mantenha backup** dos arquivos originais
3. **Use imagens otimizadas** (WebP, tamanho adequado)
4. **Teste em diferentes dispositivos** (mobile, tablet, desktop)
5. **Verifique os links** antes de publicar

## 🆘 Suporte

Se precisar de ajuda adicional:

1. Consulte a [documentação do Next.js](https://nextjs.org/docs)
2. Veja a [documentação do Tailwind CSS](https://tailwindcss.com/docs)
3. Procure pela comunidade no Stack Overflow

---

**Última atualização**: Novembro 2024


# 📸 Como Adicionar Imagens ao Site - CDL Ipirá

## 🎯 INSTRUÇÕES COMPLETAS

---

## 1. 📍 ONDE ADICIONAR AS IMAGENS

Todas as imagens devem ser colocadas na pasta:
```
public/
```

### Estrutura Recomendada:
```
public/
├── logo-cdl.png ✅ (já existe)
├── spc-brasil-logo.png ✅ (já existe)
├── projeto-conduz.jpg (adicionar)
├── associados.jpg (adicionar)
├── spc-consulta.jpg (adicionar)
├── eventos/
│   ├── evento1.jpg
│   ├── evento2.jpg
│   └── evento3.jpg
└── noticias/
    ├── noticia1.jpg
    ├── noticia2.jpg
    └── noticia3.jpg
```

---

## 2. 🌟 HERO CAROUSEL - Adicionar Imagens nos Slides

### Passo 1: Adicione as 3 Imagens na Pasta Public

Salve suas imagens com estes nomes (ou edite no código):
- `projeto-conduz.jpg` - Imagem do Projeto Conduz
- `associados.jpg` - Imagem de empresários/associados
- `spc-consulta.jpg` - Imagem relacionada a SPC/consultas

### Passo 2: As Imagens Já Estão Configuradas!

O código já está preparado para carregar automaticamente:

```typescript
// No arquivo: app/components/HeroCarousel.tsx
const slides = [
  {
    id: 1,
    image: '/projeto-conduz.jpg', // ← Sua imagem aqui
  },
  {
    id: 2,
    image: '/associados.jpg', // ← Sua imagem aqui
  },
  {
    id: 3,
    image: '/spc-consulta.jpg', // ← Sua imagem aqui
  }
];
```

### Passo 3: Personalizar (Opcional)

Se quiser usar nomes diferentes:

1. Abra: `app/components/HeroCarousel.tsx`
2. Encontre a linha `image: '/projeto-conduz.jpg'`
3. Altere para o nome da sua imagem: `image: '/minha-imagem.jpg'`

---

## 3. 🎨 FORMATO E TAMANHO DAS IMAGENS

### Recomendações:

#### Hero Carousel (Banner Principal)
```
Formato: JPG ou PNG
Dimensões: 1920x800px (ideal)
Peso: Máx 500KB (otimizar antes)
Proporção: 16:9 ou 21:9
```

#### Notícias
```
Formato: JPG
Dimensões: 800x500px
Peso: Máx 200KB
Proporção: 16:10
```

#### Eventos
```
Formato: JPG
Dimensões: 800x500px
Peso: Máx 200KB
Proporção: 16:10
```

#### Logos
```
Formato: PNG (com fundo transparente)
Dimensões: 300x150px
Peso: Máx 50KB
```

---

## 4. 🖼️ COMO OTIMIZAR IMAGENS

### Ferramentas Online (Grátis):

1. **TinyPNG** - https://tinypng.com/
   - Comprime JPG e PNG
   - Mantém a qualidade

2. **Squoosh** - https://squoosh.app/
   - Ferramenta do Google
   - Muitas opções de compressão

3. **iLoveIMG** - https://www.iloveimg.com/pt
   - Redimensionar e comprimir
   - Interface em português

### Passo a Passo:

1. **Redimensionar** a imagem para o tamanho recomendado
2. **Comprimir** usando TinyPNG ou Squoosh
3. **Salvar** na pasta `public/`
4. **Atualizar** o código (se necessário)

---

## 5. 📝 ATUALIZANDO OUTRAS SEÇÕES

### Notícias (NewsCarousel.tsx)

Localize o array `news` e atualize:

```typescript
const news = [
  {
    id: 1,
    title: 'Sua notícia',
    image: '/noticias/noticia1.jpg', // ← Adicione aqui
  }
];
```

### Eventos (EventsCarousel.tsx)

Localize o array `events` e atualize:

```typescript
const events = [
  {
    id: 1,
    title: 'Seu evento',
    image: '/eventos/evento1.jpg', // ← Adicione aqui
  }
];
```

---

## 6. ✅ CHECKLIST - IMAGENS

### Logos (Já Funcionando)
- [x] Logo CDL Ipirá
- [x] Logo SPC Brasil

### Hero Carousel (Adicionar)
- [ ] Projeto Conduz (`projeto-conduz.jpg`)
- [ ] Associados (`associados.jpg`)
- [ ] SPC Consulta (`spc-consulta.jpg`)

### Notícias (Opcional)
- [ ] Notícia 1
- [ ] Notícia 2
- [ ] Notícia 3

### Eventos (Opcional)
- [ ] Evento 1
- [ ] Evento 2
- [ ] Evento 3

---

## 7. 🔍 TESTANDO AS IMAGENS

### Depois de adicionar as imagens:

1. **Salve** as imagens na pasta `public/`
2. **Reinicie** o servidor (se necessário):
   ```bash
   npm run dev
   ```
3. **Acesse**: http://localhost:3000
4. **Verifique** se as imagens aparecem

### Se as Imagens Não Aparecerem:

1. Verifique o **nome do arquivo** (deve ser exato)
2. Verifique a **extensão** (.jpg, .png)
3. Confirme que está na pasta **public/**
4. Limpe o cache do navegador (Ctrl+F5)

---

## 8. 📱 IMAGENS RESPONSIVAS

As imagens já estão configuradas para:
- ✅ Ajustar automaticamente ao tamanho da tela
- ✅ Manter a proporção
- ✅ Carregar com transições suaves
- ✅ Fallback caso não carreguem

---

## 9. 🎨 DICAS DE DESIGN

### Para Melhores Resultados:

1. **Use imagens de alta qualidade**
   - Evite imagens pixelizadas
   - Prefira fotos profissionais

2. **Mantenha consistência**
   - Mesma proporção em todas
   - Estilo visual similar

3. **Considere o texto**
   - Hero: Área à esquerda para texto
   - Evite áreas muito claras onde tem texto branco

4. **Cores CDL**
   - Use imagens que combinem com:
   - Azul (#003f7f)
   - Verde (#00a859)
   - Amarelo (#ffd000)

---

## 10. 🚀 EXEMPLO COMPLETO

### Estrutura Final:

```
public/
├── logo-cdl.png ✅
├── spc-brasil-logo.png ✅
├── projeto-conduz.jpg ✅
├── associados.jpg ✅
├── spc-consulta.jpg ✅
├── eventos/
│   ├── conexao-growth.jpg
│   ├── pascoa-encantada.jpg
│   └── posse-diretoria.jpg
└── noticias/
    ├── bndes.jpg
    ├── comercio.jpg
    └── graos.jpg
```

### Código Atualizado Automaticamente:

Depois de adicionar as imagens, o site vai:
1. ✅ Carregar automaticamente
2. ✅ Mostrar com transição fade
3. ✅ Aplicar overlay gradient
4. ✅ Adaptar ao tamanho da tela

---

## 11. ❓ PERGUNTAS FREQUENTES

**P: As imagens precisam ter exatamente esses nomes?**
R: Não, mas você precisa atualizar o nome no código.

**P: Posso usar PNG em vez de JPG?**
R: Sim, mas JPG é recomendado para fotos (menor tamanho).

**P: E se a imagem for muito grande?**
R: Use as ferramentas de otimização mencionadas acima.

**P: As imagens funcionam sem reiniciar?**
R: Sim, mas às vezes é necessário limpar o cache do navegador.

---

## 12. 🆘 SUPORTE

Se precisar de ajuda:
1. Verifique se o nome do arquivo está correto
2. Confirme que está na pasta `public/`
3. Limpe o cache do navegador
4. Reinicie o servidor de desenvolvimento

---

**Última atualização**: 15/11/2024  
**Versão do Site**: 2.2.1


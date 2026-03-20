# Product Requirements Document (PRD) - CMS CDL Ipirá

## 1. Visão Geral do Produto
O CMS da CDL Ipirá é uma plataforma web progressiva desenvolvida para gerenciar e apresentar conteúdo institucional, serviços, produtos e benefícios da Câmara de Dirigentes Lojistas de Ipirá. O sistema atua como um portal público interativo para lojistas e cidadãos, além de um painel administrativo (dashboard) completo para o controle unificado das mídias, comunicados e do balcão de empregos local.

## 2. Objetivos
- Digitalizar e centralizar todas as comunicações da CDL Ipirá em uma única plataforma.
- Oferecer um portal transparente, fácil de navegar e voltado para as necessidades reais dos associados e cidadãos.
- Facilitar a criação, edição e gestão de conteúdos contínuos (notícias, eventos, TV Lojista, galeria de fotos, revistas) por uma equipe administrativa, sem necessidade de conhecimento técnico.
- Promover uma conexão direta e fluida entre as empresas do município e novos talentos utilizando o sistema do Balcão de Empregos com envio de currículos.

## 3. Público-Alvo
- **Lojistas e Associados:** Usuários que buscam informações, novos benefícios, acesso a produtos oferecidos, orientação jurídica constante e cadastro para eventos ou reuniões da câmara.
- **População em Geral:** Entes sociais que buscam vagas de emprego pelo portal, informativos (Revistas e TV) e transparência nas ações locais em prol do desenvolvimento varejista e comunitário.
- **Equipe Administrativa CDL:** Usuários gerenciadores que utilizam o CMS diariamente para moderar o site.

## 4. Escopo de Funcionalidades Principais

### 4.1. Portal Público (Front-end)
- **Institucional & Diretoria:** Apresentação da missão, visão, história da entidade e vitrine ilustrada de todos os membros e responsáveis que constituem a diretoria.
- **Benefícios & Produtos:** Listagem detalhada dos produtos mantidos e dos convênios e parcerias em vigência na CDL.
- **Notícias & Portal de Imprensa:** Feed escalável voltado para os informes e os press releases regionais, com textos ilustrados.
- **Eventos:** Calendário e detalhes dos eventos com estrutura interna e painel de formulário próprio para o cômputo de inscrições digitais (`inscricoes_eventos`).
- **Galerias (TV Lojista e Fotos):** Álbum ilustrativo das iniciativas locais e sincronia de links com o YouTube.
- **Balcão de Empregos:** Espaço para divulgar as oportunidades ofertadas pelas empresas associadas com formulários integrados para submissão digital de currículos (`resumes`).
- **Áreas Documentais:** Portal da Transparência (documentos vitais da organização) e seção perene voltada para Orientação Jurídica.

### 4.2. Painel Administrativo (Módulo CMS Dashboard)
Área restrita de gestão modular de informações (App `/admin/dashboard`):
- **Segurança e Acesso:** Sistema bloqueável sob autenticação para os usuários catalogados em `admin_users`.
- **Controle de Vagas e Currículos:** Aprovação, edição e arquivamento de publicações de emprego, atreladas às páginas de empresas parceiras, e controle dos currículos recebidos em formato de recrutamento e seleção digital.
- **Motor de Publicação Institucional (Notícias, Revistas, Diretoria, TV Lojista):** CRUD (Create, Read, Update e Delete) com upload de imagem e uso nativo dos `Supabase Storage Buckets` para mídias longas.
- **Administração de Eventos:** Elaboração de turmas/eventos abertos e coleta estruturada de participantes.
- **Portal de Documentos e Transparência:** Gestor voltado para a subida regular de atas, regimentos e manuais, classificados corretamente de acordo com pautas institucionais de interesse municipal e legal.
- **Registros de Auditoria (`auditoria`):** Log sistêmico de todas as manipulações em painel para conformidade institucional e rastro de mudanças.

## 5. Requisitos Técnicos
- **Frontend & App Router Ecosystem:** Next.js (via React 19).
- **Estilização Ágil (UI):** Utilização de Tailwind CSS (v4) combinado com componentes otimizados usando `postcss`.
- **Serviço de Backend & Armazenamento (BaaS):** Adoção de Supabase - gerenciando o Auth de administradores, Banco de Dados (PostgreSQL) usando RLS policies seguras, e os buckets para as fotos da Galeria, Revista, Transparência e Currículos.
- **Interação, UI e Segurança:** Utilização das bibliotecas `swiper` para carrosséis dinâmicos, `sonner` para popups, e `react-icons` para vetores visuais; `bcryptjs` e sanitizações preventivas via `isomorphic-dompurify`.
- **Estratégia e Padrão de Codificação:** Todo projeto implementado com uso de TypeScript `strict`. 

## 6. Estrutura Abstrata do Banco de Dados
Mapeamento lógico obtido pelo subdiretório local de migrações (`/supabase`):
- Utilizadores: `admin_users`.
- Conteúdos de consumo direto: `conteudo`, `magazines`, `videos_youtube`, `portal_juridico`.
- Registros Fotográficos: `fotos`, `albums` e as interligações via schema local.
- Categoria Institucional: `diretoria` e `team_members`.
- Componente de Networking (Empregabilidade): `empresas`, unidas com `empregos` as quais, posteriormente, recebem atrelagem perante de dezenas dos dados de `resumes`.
- Gestão e Legalidade: `transparency_documents`.

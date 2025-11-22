import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

// Dados das notícias (em produção, isso viria de uma API ou banco de dados)
const allNews = [
  {
    id: 1,
    title: 'Operações de crédito do BNDES chegam a R$ 230 bilhões',
    excerpt: 'CDL Ipirá orienta sobre funcionamento do comércio nas feriados de 15 e 20 de novembro. Saiba mais sobre as orientações para o período.',
    content: `
      <p>As operações de crédito do BNDES atingiram a marca histórica de R$ 230 bilhões, representando um crescimento significativo no apoio ao desenvolvimento econômico do país. A CDL Ipirá está atenta a essas oportunidades e orienta seus associados sobre como aproveitar esses recursos.</p>
      
      <p>Este marco representa um aumento de 15% em relação ao ano anterior, demonstrando o fortalecimento do apoio financeiro às empresas brasileiras. O BNDES tem sido um parceiro fundamental no desenvolvimento econômico, oferecendo linhas de crédito com condições favoráveis para diversos setores.</p>
      
      <h2>Oportunidades para Comerciantes</h2>
      <p>Para os associados da CDL Ipirá, essas operações de crédito representam uma excelente oportunidade de investimento e crescimento. O BNDES oferece diversas linhas de financiamento que podem ser utilizadas para:</p>
      <ul>
        <li>Expansão de negócios</li>
        <li>Modernização de equipamentos</li>
        <li>Investimento em tecnologia</li>
        <li>Melhoria da infraestrutura</li>
        <li>Capacitação de equipes</li>
      </ul>
      
      <h2>Como Acessar</h2>
      <p>A CDL Ipirá está disponibilizando orientações e suporte para associados que desejam acessar essas linhas de crédito. Nossa equipe está preparada para auxiliar no processo de solicitação e análise de viabilidade.</p>
      
      <p>Entre em contato conosco para mais informações sobre como aproveitar essas oportunidades de financiamento e fortalecer seu negócio.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/003f7f/ffffff?text=BNDES',
    date: '15/11/2024',
    category: 'Economia',
    color: 'from-[#003f7f] to-[#0066cc]',
    author: 'CDL Ipirá',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Vendas no comércio caem 0,3% em setembro',
    excerpt: 'Seis em cada dez consumidores fazem compras por impulso na internet, aponta pesquisa realizada pelo setor.',
    content: `
      <p>As vendas no comércio varejista caíram 0,3% em setembro, segundo dados divulgados pelo IBGE. A pesquisa também revelou que seis em cada dez consumidores fazem compras por impulso na internet, destacando a importância de estratégias de marketing digital para os comerciantes.</p>
      
      <h2>Análise do Setor</h2>
      <p>A queda nas vendas reflete um cenário de cautela do consumidor, que tem sido mais seletivo em suas compras. No entanto, o crescimento do e-commerce continua forte, com muitos consumidores optando por compras online.</p>
      
      <h2>Compras por Impulso</h2>
      <p>A pesquisa revelou que 60% dos consumidores brasileiros fazem compras por impulso na internet. Este comportamento representa uma oportunidade importante para comerciantes que investem em marketing digital e estratégias de vendas online.</p>
      
      <h2>Recomendações</h2>
      <p>Para os associados da CDL Ipirá, recomendamos:</p>
      <ul>
        <li>Investir em presença digital</li>
        <li>Desenvolver estratégias de marketing online</li>
        <li>Otimizar a experiência de compra</li>
        <li>Oferecer facilidades de pagamento</li>
      </ul>
    `,
    image: 'https://via.placeholder.com/1200x600/00a859/ffffff?text=Comercio',
    date: '14/11/2024',
    category: 'Comércio',
    color: 'from-[#00a859] to-[#00d670]',
    author: 'CDL Ipirá',
    readTime: '4 min'
  },
  {
    id: 3,
    title: 'Brasil estima colheita de 354,8 milhões de toneladas de grãos',
    excerpt: '39,5 milhões de consumidores pagaram pelo menos um jogo online no último ano, mostrando o crescimento do setor digital.',
    content: `
      <p>O Brasil estima uma colheita recorde de 354,8 milhões de toneladas de grãos na safra atual. Paralelamente, o setor de games online também cresce, com 39,5 milhões de consumidores pagando por jogos no último ano.</p>
      
      <h2>Recorde na Produção</h2>
      <p>A estimativa de colheita representa um crescimento de 8% em relação à safra anterior, consolidando o Brasil como um dos maiores produtores mundiais de grãos. Este desempenho positivo impacta diretamente a economia local e nacional.</p>
      
      <h2>Crescimento Digital</h2>
      <p>O setor de games online também mostra crescimento significativo, com 39,5 milhões de brasileiros pagando por jogos no último ano. Este mercado representa novas oportunidades de negócio para comerciantes que investem em produtos digitais.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/ffd000/003f7f?text=Graos',
    date: '13/11/2024',
    category: 'Agronegócio',
    color: 'from-[#ffd000] to-[#ffed4e]',
    author: 'CDL Ipirá',
    readTime: '3 min'
  },
  {
    id: 4,
    title: 'Black Friday: Dicas para aumentar suas vendas',
    excerpt: 'Especialistas dão orientações sobre como aproveitar melhor a data comercial mais importante do ano.',
    content: `
      <p>A Black Friday está chegando e é fundamental que os comerciantes se preparem adequadamente. Especialistas da CDL Ipirá compartilham dicas valiosas sobre estratégias de precificação, marketing, atendimento ao cliente e logística para maximizar as vendas durante este período.</p>
      
      <h2>Planejamento Estratégico</h2>
      <p>O sucesso na Black Friday começa com um planejamento cuidadoso. É importante definir quais produtos terão desconto, calcular a margem de lucro e preparar o estoque adequadamente.</p>
      
      <h2>Marketing e Comunicação</h2>
      <p>Uma boa estratégia de marketing é essencial. Utilize redes sociais, e-mail marketing e outros canais para comunicar suas ofertas e atrair clientes.</p>
      
      <h2>Atendimento ao Cliente</h2>
      <p>Durante a Black Friday, o volume de atendimento aumenta significativamente. Prepare sua equipe e tenha canais de atendimento eficientes para garantir a satisfação dos clientes.</p>
      
      <h2>Logística e Entrega</h2>
      <p>Organize sua logística com antecedência. Negocie prazos de entrega com fornecedores e parceiros de transporte para garantir que os produtos cheguem aos clientes no prazo prometido.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/003f7f/ffffff?text=Black+Friday',
    date: '12/11/2024',
    category: 'Dicas',
    color: 'from-[#003f7f] to-[#0066cc]',
    author: 'CDL Ipirá',
    readTime: '6 min'
  },
  {
    id: 5,
    title: 'CDL promove capacitação em vendas',
    excerpt: 'Curso gratuito para associados ensina técnicas modernas de vendas e atendimento ao cliente.',
    content: `
      <p>A CDL Ipirá está promovendo um curso gratuito de capacitação em vendas para todos os associados. O curso aborda técnicas modernas de vendas, atendimento ao cliente, negociação e relacionamento com clientes, visando aumentar a competitividade dos comerciantes locais.</p>
      
      <h2>Conteúdo do Curso</h2>
      <p>O curso é dividido em módulos que cobrem:</p>
      <ul>
        <li>Técnicas de abordagem ao cliente</li>
        <li>Comunicação eficaz</li>
        <li>Negociação e fechamento de vendas</li>
        <li>Gestão de relacionamento com clientes</li>
        <li>Uso de tecnologia em vendas</li>
      </ul>
      
      <h2>Inscrições</h2>
      <p>As inscrições estão abertas e podem ser feitas através do site da CDL Ipirá ou diretamente na sede. O curso é totalmente gratuito para associados e oferece certificado de participação.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/00a859/ffffff?text=Capacitacao',
    date: '11/11/2024',
    category: 'Eventos',
    color: 'from-[#00a859] to-[#00d670]',
    author: 'CDL Ipirá',
    readTime: '5 min'
  },
  {
    id: 6,
    title: 'Novo sistema de consulta SPC disponível',
    excerpt: 'Associados da CDL Ipirá agora têm acesso a um sistema mais rápido e eficiente para consultas de crédito.',
    content: `
      <p>A CDL Ipirá lançou um novo sistema de consulta SPC mais moderno e eficiente. O sistema oferece respostas mais rápidas, interface intuitiva e relatórios detalhados, facilitando a gestão de crédito pelos associados.</p>
      
      <h2>Novas Funcionalidades</h2>
      <p>O novo sistema inclui:</p>
      <ul>
        <li>Interface moderna e intuitiva</li>
        <li>Respostas em tempo real</li>
        <li>Relatórios detalhados e personalizados</li>
        <li>Histórico completo de consultas</li>
        <li>Integração com sistemas de gestão</li>
      </ul>
      
      <h2>Como Acessar</h2>
      <p>Os associados podem acessar o novo sistema através do portal online da CDL Ipirá. O acesso é seguro e requer autenticação.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/003f7f/ffffff?text=SPC',
    date: '10/11/2024',
    category: 'Serviços',
    color: 'from-[#003f7f] to-[#0066cc]',
    author: 'CDL Ipirá',
    readTime: '4 min'
  },
  {
    id: 7,
    title: 'Workshop de gestão financeira para pequenos negócios',
    excerpt: 'Evento gratuito ensina técnicas de controle financeiro e planejamento para empresários.',
    content: `
      <p>A CDL Ipirá realizará um workshop gratuito sobre gestão financeira para pequenos negócios. O evento abordará temas como controle de fluxo de caixa, planejamento financeiro, análise de indicadores e estratégias para melhorar a saúde financeira do negócio.</p>
      
      <h2>Temas Abordados</h2>
      <ul>
        <li>Controle de fluxo de caixa</li>
        <li>Planejamento financeiro estratégico</li>
        <li>Análise de indicadores financeiros</li>
        <li>Gestão de custos e despesas</li>
        <li>Estratégias de crescimento sustentável</li>
      </ul>
      
      <h2>Inscrições</h2>
      <p>As inscrições são gratuitas e podem ser feitas através do site ou na sede da CDL Ipirá. Vagas limitadas!</p>
    `,
    image: 'https://via.placeholder.com/1200x600/00a859/ffffff?text=Workshop',
    date: '09/11/2024',
    category: 'Eventos',
    color: 'from-[#00a859] to-[#00d670]',
    author: 'CDL Ipirá',
    readTime: '5 min'
  },
  {
    id: 8,
    title: 'CDL Ipirá participa de feira de negócios regional',
    excerpt: 'Instituição marca presença em importante evento comercial da região, promovendo networking e oportunidades.',
    content: `
      <p>A CDL Ipirá participou ativamente da Feira de Negócios Regional, promovendo networking entre associados e apresentando os serviços oferecidos pela instituição. O evento foi uma excelente oportunidade para fortalecer parcerias e gerar novos negócios.</p>
      
      <h2>Resultados do Evento</h2>
      <p>A participação da CDL Ipirá na feira foi muito positiva, com diversos contatos estabelecidos e oportunidades de negócio identificadas. O evento também serviu para fortalecer a presença da instituição na região.</p>
    `,
    image: 'https://via.placeholder.com/1200x600/ffd000/003f7f?text=Feira',
    date: '08/11/2024',
    category: 'Eventos',
    color: 'from-[#ffd000] to-[#ffed4e]',
    author: 'CDL Ipirá',
    readTime: '3 min'
  },
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const news = allNews.find(n => n.id === parseInt(params.id));
  
  if (!news) {
    return {
      title: 'Notícia não encontrada - CDL Ipirá',
    };
  }

  return {
    title: `${news.title} - CDL Ipirá`,
    description: news.excerpt,
  };
}

export default function NoticiaDetailPage({ params }: { params: { id: string } }) {
  const news = allNews.find(n => n.id === parseInt(params.id));

  if (!news) {
    notFound();
  }

  // Encontrar notícias relacionadas (mesma categoria, excluindo a atual)
  const relatedNews = allNews
    .filter(n => n.category === news.category && n.id !== news.id)
    .slice(0, 3);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link 
              href="/noticias" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Notícias
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold line-clamp-1">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden">
        <div className={`absolute inset-0 bg-linear-to-br ${news.color} opacity-90`}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-transparent"></div>
        
        {/* Badge categoria */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-black shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00a859] rounded-full"></span>
            {news.category}
          </span>
        </div>
      </section>

      {/* Main Content */}
      <article className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header do Artigo */}
            <header className="mb-6 sm:mb-8 animate-blur-fade-in">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4 sm:mb-6 leading-tight">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-semibold">{news.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{news.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{news.readTime} de leitura</span>
                </div>
              </div>

              <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full"></div>
            </header>

            {/* Conteúdo do Artigo */}
            <div 
              className="prose prose-lg sm:prose-xl max-w-none mb-8 sm:mb-12 animate-blur-fade-in"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
              style={{
                lineHeight: '1.8',
              }}
            />

            {/* Share Buttons */}
            <div className="border-t border-gray-200 pt-6 sm:pt-8 mb-8 sm:mb-12">
              <h3 className="text-lg sm:text-xl font-bold text-[#003f7f] mb-4">Compartilhar:</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1877f2] text-white rounded-full font-bold hover:bg-[#166fe5] transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1da1f2] text-white rounded-full font-bold hover:bg-[#1a91da] transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#0077b5] text-white rounded-full font-bold hover:bg-[#006399] transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
                <button className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#00a859] text-white rounded-full font-bold hover:bg-[#008f4d] transition-all duration-300 hover:scale-105 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342c8.288 0 12.316-6.846 12.316-12.788 0-.19 0-.38-.014-.57A8.837 8.837 0 0022.5 2.892a8.967 8.967 0 01-2.52.69 4.32 4.32 0 001.896-2.38 8.824 8.824 0 01-2.742 1.05 4.304 4.304 0 00-6.331 3.926 12.204 12.204 0 01-8.86-4.49 4.302 4.302 0 001.33 5.746 4.25 4.25 0 01-1.948-.538v.054a4.31 4.31 0 003.454 4.22 4.305 4.305 0 01-1.942.074 4.32 4.32 0 004.027 2.99 8.636 8.636 0 01-5.354 1.84A8.592 8.592 0 013 18.407a12.184 12.184 0 006.594 1.927c7.909 0 12.233-6.55 12.233-12.22 0-.186-.004-.372-.012-.558a8.75 8.75 0 002.146-2.23z" />
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="mb-8 sm:mb-12">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-[#003f7f] font-bold hover:text-[#0066cc] transition-colors group text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Voltar para Notícias
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Notícias Relacionadas */}
      {relatedNews.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-6 sm:mb-8 text-center">
                Notícias Relacionadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                {relatedNews.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/noticias/${item.id}`}
                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`relative h-40 xs:h-48 sm:h-56 bg-linear-to-br ${item.color} overflow-hidden shrink-0`}>
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] xs:text-xs font-black shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6 flex flex-col grow">
                      <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs xs:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 grow text-justify">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <span className="text-[#00a859] font-bold text-xs sm:text-sm group-hover:gap-2 transition-all inline-flex items-center gap-1">
                          Ler
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}


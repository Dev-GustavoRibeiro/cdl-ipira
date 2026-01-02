'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative } from 'swiper/modules';
import NewsModal from './NewsModal';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  color: string;
  author?: string;
  image?: string;
}

const NewsCarousel = () => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedNews, setSelectedNews] = React.useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/noticias?limit=6');
        if (response.ok) {
          const data = await response.json();

          // Map database fields to NewsItem interface
          const mappedNews: NewsItem[] = data.map((item: any, index: number) => {
            // Generate a consistent color based on index
            const colors = [
              'from-[#003f7f] to-[#0066cc]', // Blue
              'from-[#00a859] to-[#00d674]', // Green
              'from-[#e6b800] to-[#ffd000]', // Yellow (darker start for contrast)
              'from-[#cc0000] to-[#ff3333]', // Red
              'from-[#4b0082] to-[#8a2be2]', // Purple
              'from-[#008080] to-[#00ced1]', // Teal
            ];

            return {
              id: item.id,
              title: item.title,
              excerpt: item.summary || item.content?.substring(0, 120) + '...' || 'Sem resumo disponível',
              content: item.content || '',
              date: new Date(item.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }),
              category: item.category || 'Notícias',
              color: colors[index % colors.length],
              author: item.author || 'CDL Ipirá',
              image: item.image
            };
          });

          setNews(mappedNews);
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const openModal = (item: NewsItem) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-linear-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza a estrutura mesmo sem notícias
  if (news.length === 0) {
    return (
      <section className="py-20 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-visible">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-block bg-[#ffd000] text-[#003f7f] px-4 py-2 rounded-full text-sm font-bold mb-4">
                📰 Últimas Notícias
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-[#003f7f] mb-3 bg-clip-text">
                Fique por Dentro
              </h2>
              <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full"></div>
            </div>
            <Link
              href="/imprensa/noticias"
              className="hidden md:flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              Ver Todas
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhuma notícia disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-visible">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-block bg-[#ffd000] text-[#003f7f] px-4 py-2 rounded-full text-sm font-bold mb-4">
              📰 Últimas Notícias
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-[#003f7f] mb-3 bg-clip-text">
              Fique por Dentro
            </h2>
            <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full"></div>
          </div>
          <Link
            href="/imprensa/noticias"
            className="hidden md:flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            Ver Todas
            <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 relative overflow-visible">
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectCreative]}
              spaceBetween={24}
              slidesPerView={1}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                nextEl: '.news-button-next',
                prevEl: '.news-button-prev',
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1.2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 32,
                },
              }}
              className="news-carousel-modern pb-20!"
            >
              {news.map((item) => (
                <SwiperSlide key={item.id} className="h-auto">
                  <article
                    onClick={() => openModal(item)}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full cursor-pointer border border-gray-100/50"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openModal(item);
                      }
                    }}
                  >
                    {/* Seção superior colorida */}
                    <div className={`relative h-56 bg-gradient-to-br ${item.color} overflow-hidden shrink-0`}>
                      {/* Decorative pattern */}
                      <div className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10 mix-blend-overlay"></div>

                      {item.image && (
                        <>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        </>
                      )}

                      {/* Badge categoria */}
                      <div className="absolute top-5 left-5 z-10">
                        <span className="bg-white/90 backdrop-blur-md text-[#003f7f] px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-2 tracking-wide uppercase">
                          <span className="w-1.5 h-1.5 bg-[#00a859] rounded-full"></span>
                          {item.category}
                        </span>
                      </div>

                      {/* Data flutuante */}
                      <div className="absolute top-5 right-5 z-10">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                          <div className="text-[#003f7f] text-xl font-black text-center leading-none">
                            {item.date.split('/')[0]}
                          </div>
                          <div className="text-[#00a859] text-[10px] font-bold mt-1 uppercase tracking-wider">
                            {new Date(item.date.split('/').reverse().join('-')).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-8 relative flex flex-col grow bg-white min-h-[260px]">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 grow text-sm md:text-base opacity-90">
                        {item.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {item.author}
                        </div>
                        <span
                          className="group/btn inline-flex items-center gap-2 text-[#00a859] font-bold hover:gap-3 transition-all duration-300 text-sm"
                        >
                          <span className="relative">
                            Leia mais
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a859] group-hover/btn:w-full transition-all duration-300"></span>
                          </span>
                          <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navegação customizada com cor azul */}
          <div className="news-button-prev absolute left-2 sm:left-4 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 cursor-pointer group hover:-translate-x-1 transition-transform duration-300 hidden md:block">
            <div className="w-14 h-14 bg-white text-[#003f7f] rounded-full flex items-center justify-center hover:bg-[#003f7f] hover:text-white transition-all duration-300 shadow-xl border border-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>

          <div className="news-button-next absolute right-2 sm:right-4 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-20 cursor-pointer group hover:translate-x-1 transition-transform duration-300 hidden md:block">
            <div className="w-14 h-14 bg-white text-[#003f7f] rounded-full flex items-center justify-center hover:bg-[#003f7f] hover:text-white transition-all duration-300 shadow-xl border border-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/imprensa/noticias"
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Ver Todas as Notícias
          </Link>
        </div>
      </div>

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        news={selectedNews}
      />

      <style jsx global>{`
        .news-carousel-modern {
          position: relative;
          padding-bottom: 60px !important;
          padding-top: 20px !important;
        }
        .news-carousel-modern .swiper-pagination {
          position: absolute;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          display: flex;
          gap: 6px;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .news-carousel-modern .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #ccc;
          opacity: 0.5;
          transition: all 0.3s ease;
          margin: 0 !important;
        }
        .news-carousel-modern .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 4px;
          opacity: 1;
          background: #003f7f;
        }
        /* Esconder setas padrão do Swiper (usamos setas customizadas) */
        .news-carousel-modern .swiper-button-next,
        .news-carousel-modern .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </section>
  );
};

export default NewsCarousel;
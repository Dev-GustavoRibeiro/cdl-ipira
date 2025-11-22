'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  color: string;
}

const NewsCarousel = () => {
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/news?limit=5').then(res => res.json()).then(setNews)
    const fetchNews = async () => {
      try {
        // const response = await fetch('/api/news?limit=5');
        // const data = await response.json();
        // setNews(data);
        setNews([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

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
              href="/noticias"
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
            href="/noticias"
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
              spaceBetween={16}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
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
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
              }}
              className="news-carousel-modern pb-20!"
            >
            {news.map((item) => (
              <SwiperSlide key={item.id}>
                <article className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 flex flex-col h-full min-h-[500px]">
                {/* Seção superior colorida - SEM IMAGEM */}
                <div className={`relative h-48 sm:h-52 md:h-56 bg-linear-to-br ${item.color} overflow-hidden shrink-0`}>
                  {/* Badge categoria - branco/verde claro */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/90 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-black shadow-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#00a859] rounded-full"></span>
                      {item.category}
                    </span>
                  </div>

                  {/* Data flutuante - card branco */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg">
                      <div className="text-[#003f7f] text-base sm:text-lg font-bold text-center leading-none">
                        {item.date.split('/')[0]}
                      </div>
                      <div className="text-[#00a859] text-xs font-semibold mt-1">
                        {item.date.split('/')[1]}/{item.date.split('/')[2]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 sm:p-8 relative flex flex-col grow bg-white min-h-[280px]">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-[#003f7f] transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3 grow">
                    {item.excerpt}
                  </p>
                  
                  <Link
                    href={`/noticias/${item.id}`}
                    className="group/btn inline-flex items-center gap-2 sm:gap-3 text-[#00a859] font-bold hover:gap-4 sm:hover:gap-5 transition-all duration-300 text-sm sm:text-base mt-auto"
                  >
                    <span className="relative">
                      Leia mais
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00a859] group-hover/btn:w-full transition-all duration-300"></span>
                    </span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/btn:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </article>
            </SwiperSlide>
            ))}
            </Swiper>
          </div>
          
          {/* Navegação customizada com cor azul */}
          <div className="news-button-prev absolute left-2 sm:left-4 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#003f7f]/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-[#003f7f]/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          
          <div className="news-button-next absolute right-2 sm:right-4 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#003f7f]/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-[#003f7f]/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 md:hidden">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Ver Todas as Notícias
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .news-carousel-modern {
          position: relative;
          padding-bottom: 60px !important;
        }
        .news-carousel-modern .swiper-pagination {
          position: absolute;
          bottom: 0 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: auto !important;
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .news-carousel-modern .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #003f7f;
          opacity: 0.3;
          transition: all 0.3s ease;
          margin: 0 !important;
        }
        .news-carousel-modern .swiper-pagination-bullet-active {
          width: 32px;
          border-radius: 6px;
          opacity: 1;
          background: linear-gradient(135deg, #003f7f 0%, #0066cc 100%);
          box-shadow: 0 4px 15px rgba(0, 63, 127, 0.5);
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

'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const EventsCarousel = () => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/events?limit=5').then(res => res.json()).then(setEvents)
    const fetchEvents = async () => {
      try {
        // const response = await fetch('/api/events?limit=5');
        // const data = await response.json();
        // setEvents(data);
        setEvents([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza a estrutura mesmo sem eventos
  if (events.length === 0) {
    return (
      <section className="py-24 bg-linear-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
              📅 Próximos Eventos
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 bg-clip-text">
              Eventos em Destaque
            </h2>
            <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          </div>

          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum evento disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-linear-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header da Seção */}
        <div className="text-center mb-16">
          <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
            📅 Agenda de Eventos CDL Ipirá
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#003f7f] mb-4">
            Próximos Eventos
          </h2>
          <div className="w-32 h-2 bg-linear-to-r from-[#ffd000] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Participe dos eventos que fortalecem o comércio e a comunidade de Ipirá
          </p>
        </div>

        {/* Carrossel de Eventos */}
        <div className="relative max-w-7xl mx-auto">
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              centeredSlides={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: false,
              }}
              navigation={{
              nextEl: '.events-button-next',
              prevEl: '.events-button-prev',
            }}
              loop={true}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                  centeredSlides: true,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                  centeredSlides: true,
                },
              }}
              className="events-modern-carousel pb-20!"
            >
            {events.map((event) => (
              <SwiperSlide key={event.id}>
                <article className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col min-h-[650px]">
                  {/* Imagem do Evento */}
                  <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden shrink-0">
                    <div className={`absolute inset-0 bg-linear-to-br ${event.gradient} opacity-90`}></div>
                    <Image 
                      src={event.image} 
                      alt={event.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Calendário 3D - estilo correto */}
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-white rounded-2xl shadow-2xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 overflow-hidden">
                        <div className="bg-[#003f7f] text-white text-center py-3 px-5 rounded-t-2xl font-bold text-sm uppercase">
                          {event.month}
                        </div>
                        <div className="px-5 py-4 text-center bg-white rounded-b-2xl">
                          <div className="text-5xl font-black text-[#003f7f] leading-none">{event.date}</div>
                          <div className="text-xs font-semibold text-gray-600 mt-1">{event.year}</div>
                        </div>
                      </div>
                    </div>

                    {/* Categoria Badge - amarelo com texto azul */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-[#ffd000] text-[#003f7f] px-4 py-2 rounded-full text-xs font-black shadow-lg">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-4 sm:p-6 md:p-8 flex flex-col grow min-h-[350px]">
                    {/* Título */}
                    <h3 className="text-xl sm:text-2xl md:text-2xl font-black text-gray-900 mb-2 sm:mb-3 group-hover:text-[#003f7f] transition-colors leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                    
                    {/* Data Completa */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a859]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{event.fullDate}</span>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3 grow">
                      {event.description}
                    </p>

                    {/* Informações Extras */}
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 border-t border-gray-100 pt-4 sm:pt-6">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-semibold mb-1">LOCAL</div>
                          <div className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2">{event.location}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-500 font-semibold mb-1">PÚBLICO</div>
                          <div className="text-xs sm:text-sm font-bold text-gray-800">{event.participants}</div>
                        </div>
                      </div>
                    </div>

                    {/* Botão igual ao Hero */}
                    <button className="group/btn relative bg-white border-2 border-[#003f7f] text-[#003f7f] px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full mt-auto">
                      <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                        Saiba Mais
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover/btn:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-[#003f7f] to-[#0066cc] transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left"></div>
                    </button>
                  </div>

                  {/* Barra colorida inferior animada */}
                  <div className={`h-2 bg-linear-to-r ${event.gradient} animate-shine`} style={{backgroundSize: '200% 100%'}}></div>
                </article>
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
          
          {/* Navegação customizada com cor azul */}
          <div className="events-button-prev absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#003f7f]/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-[#003f7f]/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
          
          <div className="events-button-next absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-[#003f7f]/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-[#003f7f]/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#003f7f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Botão Ver Todos */}
        <div className="text-center mt-12 sm:mt-16">
          <button className="group relative bg-[#003f7f] text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl magic-card">
            <span className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
              Ver Calendário Completo
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transform group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-[#ffd000] to-[#ffed4e] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>

      <style jsx global>{`
        .events-modern-carousel {
          position: relative;
          padding-bottom: 60px !important;
        }
        .events-modern-carousel .swiper-pagination {
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
        .events-modern-carousel .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: #003f7f;
          opacity: 0.3;
          transition: all 0.3s ease;
          margin: 0 !important;
        }
        .events-modern-carousel .swiper-pagination-bullet-active {
          width: 50px;
          border-radius: 7px;
          opacity: 1;
          background: linear-gradient(135deg, #003f7f 0%, #0066cc 100%);
          box-shadow: 0 4px 20px rgba(0, 63, 127, 0.5);
        }
        
        /* Remover setas padrão do Swiper */
        .events-modern-carousel .swiper-button-next,
        .events-modern-carousel .swiper-button-prev {
          display: none !important;
        }
        
        /* Card central destacado */
        .events-modern-carousel .swiper-slide {
          transition: transform 0.3s ease;
        }
        .events-modern-carousel .swiper-slide-active {
          transform: scale(1.05);
        }
        
        /* Botão com efeito de preenchimento */}
        .group\/btn:hover span {
          color: white;
        }
      `}</style>
    </section>
  );
};

export default EventsCarousel;

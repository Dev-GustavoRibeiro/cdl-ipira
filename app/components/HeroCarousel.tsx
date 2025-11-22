'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroCarousel = () => {
  interface Slide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    gradient: string;
    accentColor: string;
    image?: string;
    pattern?: string;
  }

  const [slides, setSlides] = React.useState<Slide[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/hero-slides').then(res => res.json()).then(setSlides)
    const fetchSlides = async () => {
      try {
        // const response = await fetch('/api/hero-slides');
        // const data = await response.json();
        // setSlides(data);
        setSlides([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar slides:', error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSlides();
  }, []);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
      </section>
    );
  }

  // Renderiza a estrutura mesmo sem slides, mas sem conteúdo
  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-linear-to-br from-gray-100 via-gray-200 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Nenhum slide disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax]}
        effect="fade"
        parallax={true}
        speed={1000}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          nextEl: '.hero-button-next',
          prevEl: '.hero-button-prev',
        }}
        loop={true}
        className="hero-carousel-modern"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className={`relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-linear-to-br ${slide.gradient} overflow-hidden`}>
              {/* Imagem de fundo (se existir) */}
              {slide.image && (
                <div className="absolute inset-0">
                  <Image 
                    src={slide.image} 
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover opacity-30"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Padrões de fundo animados */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </div>

              {/* Padrão geométrico */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`pattern-${slide.id}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <circle cx="50" cy="50" r="2" fill="white"/>
                      <circle cx="0" cy="0" r="2" fill="white"/>
                      <circle cx="100" cy="100" r="2" fill="white"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#pattern-${slide.id})`}/>
                </svg>
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full relative z-10">
                <div className="flex items-center justify-center lg:justify-start min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
                  {/* Conteúdo com parallax */}
                  <div className="relative z-10 text-white py-8 sm:py-10 md:py-12 max-w-3xl text-center lg:text-left animate-blur-fade-in" data-swiper-parallax="-300">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-tight drop-shadow-2xl" 
                        data-swiper-parallax="-200">
                      {slide.title}
                    </h1>
                    
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 sm:mb-6 text-white/90 drop-shadow-lg" 
                        data-swiper-parallax="-100">
                      {slide.subtitle}
                    </h2>
                    
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-white/95 drop-shadow-md px-4 sm:px-0" 
                       data-swiper-parallax="-50">
                      {slide.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0" data-swiper-parallax="0">
                      <Link
                        href={slide.buttonLink}
                        className="group relative bg-white text-[#003f7f] px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl magic-card inline-flex items-center justify-center"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                          {slide.buttonText}
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-[#ffd000] to-[#ffed4e] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      </Link>
                      
                      <Link
                        href={slide.buttonLink}
                        className="border-2 sm:border-3 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-[#003f7f] transition-all duration-300 shadow-lg backdrop-blur-sm inline-flex items-center justify-center"
                      >
                        Ver Mais Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navegação customizada ultra moderna */}
      <div className="hero-button-prev absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>
      
      <div className="hero-button-next absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 cursor-pointer group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-300 shadow-2xl group-hover:scale-110">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <style jsx global>{`
        .hero-carousel-modern .swiper-pagination {
          bottom: 30px !important;
        }
        .hero-carousel-modern .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-carousel-modern .swiper-pagination-bullet-active {
          width: 48px;
          background: #ffd000;
          border-radius: 6px;
          opacity: 1;
          box-shadow: 0 4px 20px rgba(255, 208, 0, 0.5);
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroCarousel;

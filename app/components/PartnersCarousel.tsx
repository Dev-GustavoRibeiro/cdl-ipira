'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const PartnersCarousel = () => {
  const [partners, setPartners] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Substituir por chamada de API real
    // Exemplo: fetch('/api/partners').then(res => res.json()).then(setPartners)
    const fetchPartners = async () => {
      try {
        // const response = await fetch('/api/partners');
        // const data = await response.json();
        // setPartners(data);
        setPartners([]); // Array vazio até implementar a API
      } catch (error) {
        console.error('Erro ao carregar parceiros:', error);
        setPartners([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 sm:py-24 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza a estrutura mesmo sem parceiros
  if (partners.length === 0) {
    return (
      <section className="py-20 sm:py-24 bg-linear-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffd000]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header da Seção */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
              🤝 Parcerias Estratégicas
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 bg-clip-text">
              Nossos Parceiros
            </h2>
            
            <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
            
            <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              Juntos, fortalecemos o comércio de Ipirá
            </p>
          </div>

          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum parceiro disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-24 bg-linear-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffd000]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header da Seção */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 py-3 rounded-full text-sm font-black mb-6 shadow-2xl">
            🤝 Parcerias Estratégicas
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 bg-clip-text">
            Nossos Parceiros
          </h2>
          
          <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
          
          <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Juntos, fortalecemos o comércio de Ipirá
          </p>
        </div>
        
        {/* Carrossel de Parceiros */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-visible">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1.5}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 32,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 48,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 56,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 64,
              },
            }}
            className="partners-carousel-modern py-4"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id} className="h-auto">
                <div className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] w-full overflow-hidden border-2 border-transparent hover:border-[#003f7f]/20 magic-card">
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#003f7f]/0 via-[#00a859]/0 to-[#ffd000]/0 group-hover:from-[#003f7f]/5 group-hover:via-[#00a859]/5 group-hover:to-[#ffd000]/5 transition-all duration-500"></div>
                  
                  {/* Logo */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <Image 
                      src={partner.logo} 
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="h-14 sm:h-16 md:h-20 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 filter drop-shadow-sm group-hover:drop-shadow-md"
                    />
                  </div>
                  
                  {/* Barra colorida inferior */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Texto de apoio */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-gray-600 text-sm sm:text-base">
            Parceiros que confiam e investem no crescimento do comércio de Ipirá
          </p>
        </div>
      </div>

      <style jsx global>{`
        .partners-carousel-modern {
          padding-left: 0 !important;
          padding-right: 0 !important;
          overflow: visible !important;
        }
        .partners-carousel-modern .swiper-wrapper {
          padding-left: 0;
          padding-right: 0;
        }
        .partners-carousel-modern .swiper-slide {
          transition: all 0.3s ease;
          width: auto !important;
        }
        .partners-carousel-modern .swiper-slide > div {
          margin: 0 auto;
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;


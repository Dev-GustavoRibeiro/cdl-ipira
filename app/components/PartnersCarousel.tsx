'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface Partner {
  id: number;
  name: string;
  logo: string;
  website?: string;
}

const PartnersCarousel = () => {
  const [partners, setPartners] = React.useState<Partner[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/parceiros');
        if (!response.ok) throw new Error('Erro ao buscar parceiros');
        const data = await response.json();
        // Mapear dados do banco para o formato esperado pelo componente
        const formattedPartners = data.map((p: Partner) => ({
          id: p.id,
          name: p.name,
          logo: p.logo,
          website: p.website
        }));
        setPartners(formattedPartners);
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
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[150px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#003f7f]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Renderiza a estrutura mesmo sem parceiros
  if (partners.length === 0) {
    return (
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Header da Seção */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#003f7f] mb-3">
              Nossos Parceiros
            </h2>
            <div className="w-20 h-1 bg-[#003f7f] mx-auto"></div>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum parceiro disponível no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  // Duplicar parceiros para garantir continuidade visual
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header da Seção */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#003f7f] mb-3">
            Nossos Parceiros
          </h2>
          <div className="w-20 h-1 bg-[#003f7f] mx-auto"></div>
        </div>
        
        {/* Carrossel de Parceiros - Estilo com Destaque Central */}
        <div className="overflow-hidden py-8">
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            speed={600}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            autoplay={{
              delay: 1500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
              },
              480: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 5,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="partners-coverflow"
          >
            {duplicatedPartners.map((partner, index) => (
              <SwiperSlide key={`${partner.id}-${index}`}>
                <div className="flex items-center justify-center h-[140px] sm:h-[180px] md:h-[200px] px-4 partner-slide">
                  <Image 
                    src={partner.logo} 
                    alt={partner.name}
                    width={300}
                    height={150}
                    className="h-16 sm:h-24 md:h-28 w-auto max-w-[260px] sm:max-w-[300px] md:max-w-[340px] object-contain transition-all duration-500"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .partners-coverflow .swiper-slide {
          transition: all 0.2s ease;
          opacity: 0.4;
          filter: grayscale(100%);
        }
        
        .partners-coverflow .swiper-slide-active {
          opacity: 1;
          filter: grayscale(0%);
          transform: scale(1.3) !important;
          z-index: 10;
        }
        
        .partners-coverflow .swiper-slide-prev,
        .partners-coverflow .swiper-slide-next {
          opacity: 0.6;
          filter: grayscale(50%);
        }
        
        .partners-coverflow .swiper-slide img {
          transition: all 0.3s ease;
        }
      `}</style>
    </section>
  );
};

export default PartnersCarousel;

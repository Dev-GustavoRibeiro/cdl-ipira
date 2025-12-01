'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaImages, FaCamera, FaArrowRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

interface Gallery {
  id: number;
  title: string;
  image: string;
  photos: number;
  category?: string;
  date?: string;
}

const GaleriaFotos = () => {
  const [galleries, setGalleries] = React.useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch('/api/albums?limit=8');
        if (response.ok) {
          const data = await response.json();
          setGalleries(data);
        } else {
          setGalleries([]);
        }
      } catch (error) {
        console.error('Erro ao carregar galerias:', error);
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  // Duplicar para garantir loop suave
  const displayGalleries = galleries.length > 0 && galleries.length < 5 
    ? [...galleries, ...galleries, ...galleries] 
    : galleries;

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#003f7f]/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#003f7f]/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#003f7f] text-white px-5 py-2.5 rounded-full text-sm font-bold mb-5 shadow-lg">
            <FaCamera className="w-4 h-4" />
            <span>Galeria de Fotos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
            Momentos Especiais
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Reviva os melhores momentos dos eventos e ações da CDL Ipirá
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mt-5"></div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-[#003f7f] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Carregando galerias...</p>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-20 bg-gray-100 rounded-3xl max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[#003f7f]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaImages className="w-10 h-10 text-[#003f7f]" />
            </div>
            <p className="text-gray-700 text-xl font-semibold mb-2">Nenhuma galeria disponível</p>
            <p className="text-gray-500 text-sm">Novos álbuns serão adicionados em breve!</p>
          </div>
        ) : (
          <>
            {/* Carrossel Coverflow */}
            <div className="relative py-8">
              <Swiper
                modules={[Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                speed={800}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 200,
                  modifier: 1.5,
                  slideShadows: false,
                }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                className="gallery-coverflow !overflow-visible"
              >
                {displayGalleries.map((gallery, index) => (
                  <SwiperSlide 
                    key={`${gallery.id}-${index}`}
                    className="!w-[280px] sm:!w-[340px] md:!w-[400px]"
                  >
                    <Link
                      href="/imprensa/galeria-fotos"
                      className="group block"
                    >
                      <article className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {gallery.image && gallery.image !== '/placeholder-gallery.jpg' ? (
                            <Image 
                              src={gallery.image} 
                              alt={gallery.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#003f7f] to-[#0052a3] flex items-center justify-center">
                              <FaImages className="w-20 h-20 text-white/20" />
                            </div>
                          )}
                          
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70"></div>

                          {/* Photo Count - Top Right */}
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#003f7f] px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                            <FaCamera className="w-3.5 h-3.5" />
                            <span>{gallery.photos}</span>
                          </div>

                          {/* Category Badge - Top Left */}
                          {gallery.category && (
                            <div className="absolute top-4 left-4 bg-[#ffd000] text-[#003f7f] px-3 py-1.5 rounded-full text-xs font-black shadow-lg">
                              {gallery.category}
                            </div>
                          )}

                          {/* Content - Bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                              {gallery.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <FaImages className="w-4 h-4" />
                              <span>Ver álbum completo</span>
                              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10 sm:mt-14">
              <Link 
                href="/imprensa/galeria-fotos"
                className="inline-flex items-center gap-3 bg-[#003f7f] text-white px-8 py-4 rounded-full font-bold hover:bg-[#0052a3] transition-all shadow-xl hover:shadow-2xl text-sm sm:text-base group"
              >
                <FaImages className="w-5 h-5" />
                <span>Ver Todas as Galerias</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .gallery-coverflow .swiper-slide {
          transition: all 0.5s ease;
          opacity: 0.4;
          filter: blur(2px);
          transform: scale(0.85);
        }
        
        .gallery-coverflow .swiper-slide-active {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
          z-index: 10;
        }
        
        .gallery-coverflow .swiper-slide-prev,
        .gallery-coverflow .swiper-slide-next {
          opacity: 0.7;
          filter: blur(0);
          transform: scale(0.9);
        }
      `}</style>
    </section>
  );
};

export default GaleriaFotos;

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FaImages, FaCamera, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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

  const shouldLoop = galleries.length >= 4;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-gray-50">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Abstract Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#003f7f]/5 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ffd000]/10 rounded-full blur-[100px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/pattern-grid.svg')] opacity-[0.03]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#003f7f] font-bold tracking-wider text-sm uppercase mb-4">
              <span className="w-8 h-0.5 bg-[#ffd000]"></span>
              <span>Nossa Galeria</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] tracking-tight leading-[1.1] mb-6">
              Momentos que <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#003f7f] to-[#0066cc]">Fazem História</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Navegue pelos registros fotográficos dos principais eventos, ações e celebrações realizados pela CDL Ipirá.
            </p>
          </div>

          <div className={`hidden md:flex gap-4 ${galleries.length <= 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <button className="swiper-button-prev-custom w-14 h-14 rounded-full border border-[#003f7f]/10 bg-white text-[#003f7f] flex items-center justify-center hover:bg-[#003f7f] hover:text-white hover:scale-105 transition-all duration-300 shadow-sm">
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button className="swiper-button-next-custom w-14 h-14 rounded-full bg-[#003f7f] text-white flex items-center justify-center hover:bg-[#0052a3] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#003f7f]/20">
              <FaChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#003f7f]"></div>
          </div>
        ) : galleries.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[2rem] shadow-sm border border-gray-100">
            <FaImages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Sem galerias no momento</h3>
            <p className="text-gray-500">Volte em breve para ver novos registros.</p>
          </div>
        ) : (
          <div className="relative -mr-[calc((100vw-100%)/2)]"> {/* Overflow to right edge */}
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={'auto'}
              centeredSlides={true}
              loop={shouldLoop}
              speed={1000}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              autoplay={shouldLoop ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              } : false}
              breakpoints={{
                0: { slidesPerView: 1.1, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                1024: { slidesPerView: 3.2, spaceBetween: 24 },
                1280: { slidesPerView: 3.5, spaceBetween: 32 },
              }}
              className="!pb-20 !pr-4"
            >
              {galleries.map((gallery, index) => (
                <SwiperSlide
                  key={`${gallery.id}-${index}`}
                  className="!h-auto"
                >
                  <Link href="/imprensa/galeria-fotos" className="group block h-full">
                    <article className="relative h-[450px] sm:h-[550px] rounded-[2rem] overflow-hidden bg-gray-900 isolate">
                      {/* Main Image */}
                      {gallery.image && gallery.image !== '/placeholder-gallery.jpg' ? (
                        <Image
                          src={gallery.image}
                          alt={gallery.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#003f7f] to-[#001f3f] flex items-center justify-center">
                          <FaImages className="w-20 h-20 text-white/10" />
                        </div>
                      )}

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00152b] via-transparent to-transparent opacity-90"></div>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>

                      {/* Content Card (Glassmorphism) */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-6 transition-all duration-300 group-hover:bg-white/15 group-hover:translate-y-[-5px]">

                          {/* Badges Row */}
                          <div className="flex items-center justify-between mb-4">
                            {gallery.category && (
                              <span className="inline-block px-3 py-1 bg-[#ffd000] text-[#003f7f] text-xs font-bold uppercase tracking-wider rounded-full">
                                {gallery.category}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium bg-black/30 px-3 py-1 rounded-full">
                              <FaCamera className="w-3 h-3" />
                              <span>{gallery.photos}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-4 line-clamp-2 group-hover:text-[#ffd000] transition-colors">
                            {gallery.title}
                          </h3>

                          {/* Action */}
                          <div className="flex items-center gap-3 text-white/80 text-sm group/btn">
                            <span className="font-medium">Visualizar Galeria</span>
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-[#ffd000] group-hover/btn:text-[#003f7f] transition-all duration-300">
                              <FaArrowRight className="w-3 h-3 -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/imprensa/galeria-fotos"
            className="inline-flex items-center gap-2 text-[#003f7f] font-bold border-b-2 border-[#003f7f] pb-0.5 hover:text-[#0052a3] hover:border-[#0052a3] transition-colors"
          >
            <span>Ver todas as galerias</span>
            <FaArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GaleriaFotos;

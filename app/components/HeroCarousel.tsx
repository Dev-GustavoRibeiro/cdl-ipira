'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  gradient: string;
  accentColor: string;
  image: string;
  pattern: string;
  order: number;
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const response = await fetch('/api/hero');
        if (response.ok) {
          const data = await response.json();
          // Se vier da API (snake_case), converter para camelCase
          const formattedSlides = data.map((s: { id: number; title: string; subtitle: string; description: string; button_text?: string; buttonText?: string; button_link?: string; buttonLink?: string; gradient: string; accent_color?: string; accentColor?: string; image?: string; pattern?: string; order_index?: number; order?: number }) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            description: s.description,
            buttonText: s.button_text || s.buttonText,
            buttonLink: s.button_link || s.buttonLink,
            gradient: s.gradient,
            accentColor: s.accent_color || s.accentColor,
            image: s.image,
            pattern: s.pattern,
            order: s.order_index || s.order
          }));
          setSlides(formattedSlides);
        } else {
          // Fallback para mock data se falhar
          setSlides(initialSlides);
        }
      } catch (error) {
        console.error('Erro ao carregar slides:', error);
        setSlides(initialSlides);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading || slides.length === 0) {
    return (
      <div className="relative h-[600px] w-full bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f]"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[500px] sm:h-[600px] w-full overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background com Gradiente */}
          <div className={`absolute inset-0 bg-linear-to-br ${slide.gradient} opacity-90 z-10`}></div>
          
          {/* Imagem de Fundo (opcional) */}
          {slide.image && (
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover mix-blend-overlay opacity-20"
              priority={index === 0}
            />
          )}

          {/* Padrão Geométrico (opcional) */}
          <div className="absolute inset-0 opacity-10 z-10" 
               style={{ backgroundImage: `url('/patterns/${slide.pattern}.svg')` }}>
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 container mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white animate-slide-up">
              <div className={`inline-block px-4 py-1 rounded-full text-xs sm:text-sm font-bold mb-4 ${slide.accentColor} text-[#003f7f]`}>
                {slide.subtitle}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 font-light max-w-2xl leading-relaxed">
                {slide.description}
              </p>
              <Link
                href={slide.buttonLink}
                className={`inline-flex items-center gap-2 ${slide.accentColor} text-[#003f7f] px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg hover:shadow-xl`}
              >
                {slide.buttonText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Setas de Navegação */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-all hidden sm:block"
        aria-label="Slide anterior"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm text-white transition-all hidden sm:block"
        aria-label="Próximo slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}

const initialSlides: Slide[] = [
  {
    id: 1,
    title: 'Projeto Conduz',
    subtitle: 'Construindo um futuro melhor!',
    description: 'Aulas gratuitas de Violão, Cajon, Ukulele, Capoeira, Yoga, Judô e Palestras Educacionais para crianças e adolescentes.',
    buttonText: 'Saiba Mais',
    buttonLink: '/projeto-conduz',
    gradient: 'from-[#003f7f] via-[#0052a3] to-[#0066cc]',
    accentColor: 'bg-[#ffd000]',
    image: '/projeto-conduz.jpg',
    pattern: 'music',
    order: 1
  },
  {
    id: 2,
    title: 'Seja um Associado',
    subtitle: 'Faça parte da maior rede de empresários',
    description: 'Tenha acesso a consultas SPC ilimitadas, assessoria jurídica, certificado digital e muito mais! Invista no crescimento do seu negócio.',
    buttonText: 'Associe-se Agora',
    buttonLink: '/seja-associado',
    gradient: 'from-[#00a859] via-[#00c46a] to-[#00d670]',
    accentColor: 'bg-[#ffd000]',
    image: '/associados.jpg',
    pattern: 'business',
    order: 2
  }
];

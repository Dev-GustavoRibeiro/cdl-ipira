'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHistory, FaUsers, FaHandshake, FaAward, FaRocket, FaHeart, FaBuilding, FaChartLine, FaStar, FaQuoteLeft, FaCalendarAlt, FaMapMarkerAlt, FaFlag, FaGem, FaShieldAlt, FaLightbulb } from 'react-icons/fa';

// Componente de contador animado
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count}{suffix}</div>;
};

export default function HistoriaPage() {
  const timelineEvents = [
    {
      year: 'Fundação',
      title: 'Nascimento da CDL Ipirá',
      description: 'Um grupo de empresários visionários se uniu para criar uma entidade que representasse e fortalecesse o comércio local.',
      icon: FaFlag,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
    {
      year: 'Crescimento',
      title: 'Expansão dos Serviços',
      description: 'Implantação do SPC Brasil e novos serviços de proteção ao crédito, beneficiando comerciantes de toda a região.',
      icon: FaChartLine,
      color: 'from-[#00a859] to-[#00d670]'
    },
    {
      year: 'Modernização',
      title: 'Era Digital',
      description: 'Adoção de tecnologias modernas, certificação digital e sistemas online para melhor atender os associados.',
      icon: FaLightbulb,
      color: 'from-[#ffd000] to-[#ffed4e]'
    },
    {
      year: 'Presente',
      title: 'Referência Regional',
      description: 'Hoje somos referência em representação comercial, com mais de 100 associados e uma visão ambiciosa para 2030.',
      icon: FaStar,
      color: 'from-[#003f7f] to-[#0066cc]'
    },
  ];

  const conquistas = [
    { icon: FaUsers, number: 100, suffix: '+', label: 'Associados Ativos' },
    { icon: FaCalendarAlt, number: 30, suffix: '+', label: 'Anos de História' },
    { icon: FaHandshake, number: 500, suffix: '+', label: 'Parcerias Realizadas' },
    { icon: FaAward, number: 15, suffix: '+', label: 'Reconhecimentos' },
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/70">Institucional</span>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">História</span>
          </nav>
        </div>
      </div>

      {/* Hero Section Premium */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background com imagem e overlay */}
        <div className="absolute inset-0">
          <Image
            src="/cdl-ipira-sede.jpg"
            alt="Sede CDL Ipirá"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#003f7f]/95 via-[#003f7f]/80 to-[#003f7f]/60"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#003f7f] via-transparent to-transparent"></div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#ffd000]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00a859]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold mb-8 border border-white/20">
              <FaHistory className="text-[#ffd000]" />
              <span>Nossa Trajetória</span>
            </div>
            
            {/* Título */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[0.9]">
              Uma História de
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#ffd000] via-[#ffed4e] to-[#ffd000]">
                Sucesso
              </span>
            </h1>
            
            <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-2xl leading-relaxed mb-10">
              Mais de três décadas dedicadas ao fortalecimento do comércio de Ipirá e ao sucesso de cada associado.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/institucional/diretoria"
                className="inline-flex items-center justify-center gap-2 bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold text-base hover:bg-white transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                Conheça a Diretoria
                <FaUsers className="group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/institucional/missao-visao-valores"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-base border-2 border-white/30 hover:bg-white hover:text-[#003f7f] transition-all duration-300"
              >
                Missão e Valores
              </Link>
            </div>
          </div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Números e Conquistas */}
      <section className="py-16 sm:py-20 bg-white relative -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {conquistas.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <item.icon className="text-white text-2xl sm:text-3xl" />
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-2">
                  <AnimatedCounter end={item.number} suffix={item.suffix} />
                </div>
                <p className="text-gray-600 font-medium text-sm sm:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citação Inspiradora */}
      <section className="py-12 sm:py-16 bg-linear-to-r from-[#003f7f] via-[#0052a3] to-[#003f7f]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative">
            <FaQuoteLeft className="absolute -top-4 -left-2 sm:-top-6 sm:-left-4 text-white/10 text-5xl sm:text-7xl" />
            <blockquote className="text-center px-8 sm:px-12">
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-white italic leading-relaxed mb-6">
                &quot;Construímos nossa história com <span className="text-[#ffd000] font-semibold">trabalho</span>, <span className="text-[#ffd000] font-semibold">dedicação</span> e o compromisso inabalável de ver o comércio de Ipirá <span className="text-[#ffd000] font-semibold">prosperar</span>.&quot;
              </p>
              <footer className="text-white/70 text-sm sm:text-base">
                <cite className="not-italic font-bold text-white">— Fundadores da CDL Ipirá</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Nossa História - Texto Principal */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Imagem com efeito */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-linear-to-r from-[#003f7f] to-[#00a859] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative">
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/cdl-ipira-sede.jpg"
                    alt="CDL Ipirá - Nossa História"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#003f7f]/60 via-transparent to-transparent"></div>
                </div>
                
                {/* Badge flutuante */}
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-xl flex items-center justify-center">
                      <FaBuilding className="text-[#003f7f] text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 font-medium">Sede própria</p>
                      <p className="text-lg sm:text-xl font-black text-[#003f7f]">Centro de Ipirá</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-[#003f7f]/10 text-[#003f7f] px-4 py-2 rounded-full text-sm font-bold mb-6">
                <FaGem className="text-[#ffd000]" />
                <span>Nossa Fundação</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-6 leading-tight">
                O Início de Uma
                <span className="block text-[#00a859]">Grande Jornada</span>
              </h2>

              <div className="space-y-5 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg text-justify">
                  A <strong className="text-[#003f7f]">Câmara de Dirigentes Lojistas de Ipirá (CDL Ipirá)</strong> nasceu do sonho de um grupo de empresários visionários que acreditavam no poder da união para fortalecer o comércio local.
                </p>

                <p className="text-base sm:text-lg text-justify">
                  Desde sua fundação, a CDL Ipirá tem sido uma instituição fundamental para o <strong className="text-[#00a859]">desenvolvimento econômico e social</strong> de nossa cidade, oferecendo serviços essenciais como o SPC Brasil, assessoria jurídica, certificado digital e muito mais.
                </p>

                <p className="text-base sm:text-lg text-justify">
                  Ao longo dos anos, expandimos nossa atuação, sempre inovando e buscando as melhores soluções para nossos associados. Promovemos eventos, cursos e ações que fortalecem não apenas o setor comercial, mas toda a comunidade.
                </p>
              </div>

              {/* Destaque */}
              <div className="mt-8 p-6 bg-linear-to-r from-[#003f7f]/5 to-[#00a859]/5 rounded-2xl border-l-4 border-[#003f7f]">
                <p className="text-[#003f7f] font-bold text-lg mb-2">
                  Nossa missão continua
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Com uma trajetória marcada pela dedicação, continuamos sendo parceiros essenciais para o sucesso dos negócios em Ipirá.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline da História */}
      <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg">
              <FaHistory />
              <span>Nossa Trajetória</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
              Marcos da Nossa História
            </h2>
            <div className="w-24 sm:w-32 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Cada momento da nossa jornada representa um passo em direção ao sucesso.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Linha central */}
              <div className="absolute left-4 sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full"></div>

              {/* Eventos */}
              <div className="space-y-12 sm:space-y-16">
                {timelineEvents.map((event, index) => (
                  <div key={index} className={`relative flex items-start sm:items-center ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                    {/* Card */}
                    <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-40px)] ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-gray-200 group">
                        {/* Badge de ano */}
                        <div className={`inline-flex items-center gap-2 bg-linear-to-r ${event.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                          <event.icon />
                          <span>{event.year}</span>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 group-hover:text-[#0066cc] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Ponto central */}
                    <div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#003f7f] z-10">
                      <event.icon className="text-[#003f7f] text-sm sm:text-lg" />
                    </div>

                    {/* Espaçador */}
                    <div className="hidden sm:block sm:w-[calc(50%-40px)]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Pilares */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f] mb-4">
              Nossos Pilares
            </h2>
            <div className="w-24 sm:w-32 h-1.5 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Os fundamentos que guiam nossa atuação desde o primeiro dia.
            </p>
          </div>

          {/* Cards de Pilares */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Missão */}
            <Link href="/institucional/missao-visao-valores" className="group">
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#003f7f]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                  <FaRocket className="text-white text-2xl sm:text-3xl" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#0066cc] transition-colors">
                  Missão
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Promover o fortalecimento dos nossos associados através da representatividade e entrega de soluções para o desenvolvimento de Ipirá.
                </p>
                
                <div className="flex items-center gap-2 text-[#003f7f] font-bold text-sm group-hover:gap-3 transition-all">
                  <span>Saiba mais</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Visão */}
            <Link href="/institucional/missao-visao-valores" className="group">
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#00a859]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                  <FaChartLine className="text-white text-2xl sm:text-3xl" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#00a859] transition-colors">
                  Visão
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Ser reconhecida como a melhor entidade da Bahia até 2030, destacando-se em excelência e soluções inovadoras.
                </p>
                
                <div className="flex items-center gap-2 text-[#00a859] font-bold text-sm group-hover:gap-3 transition-all">
                  <span>Saiba mais</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Valores */}
            <Link href="/institucional/missao-visao-valores" className="group">
              <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 hover:border-[#ffd000]/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg relative z-10">
                  <FaHeart className="text-[#003f7f] text-2xl sm:text-3xl" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-[#003f7f] mb-4 group-hover:text-[#ffd000] transition-colors">
                  Valores
                </h3>
                
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                  Foco no associado, comprometimento, eficiência, ética, inovação e excelência em tudo o que fazemos.
                </p>
                
                <div className="flex items-center gap-2 text-[#003f7f] font-bold text-sm group-hover:gap-3 transition-all">
                  <span>Saiba mais</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffd000] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <FaShieldAlt className="text-[#ffd000] text-3xl sm:text-4xl" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
              Faça Parte Desta
              <span className="block text-[#ffd000]">História de Sucesso</span>
            </h2>
            
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
              Junte-se a mais de 100 empresários que confiam na CDL Ipirá para impulsionar seus negócios.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#ffd000] text-[#003f7f] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg hover:bg-white transition-all duration-300 hover:scale-105 shadow-2xl group"
              >
                <span>Associe-se Agora</span>
                <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <Link
                href="/institucional/diretoria"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white hover:text-[#003f7f] transition-all duration-300"
              >
                Conheça a Diretoria
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

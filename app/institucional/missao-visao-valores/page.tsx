'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaBullseye, FaEye, FaHeart, FaUsers, FaHandshake, FaRocket, FaStar, FaShieldAlt, FaLightbulb, FaChartLine, FaQuoteLeft, FaAward, FaTrophy, FaFlag, FaGem, FaCheck } from 'react-icons/fa';

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

// Partículas flutuantes com posições fixas
const particles = [
  { left: '5%', top: '10%', delay: '0s', duration: '8s' },
  { left: '15%', top: '80%', delay: '1s', duration: '10s' },
  { left: '25%', top: '30%', delay: '2s', duration: '7s' },
  { left: '35%', top: '60%', delay: '0.5s', duration: '9s' },
  { left: '45%', top: '20%', delay: '1.5s', duration: '11s' },
  { left: '55%', top: '70%', delay: '2.5s', duration: '8s' },
  { left: '65%', top: '40%', delay: '3s', duration: '10s' },
  { left: '75%', top: '90%', delay: '0.8s', duration: '7s' },
  { left: '85%', top: '50%', delay: '1.8s', duration: '9s' },
  { left: '95%', top: '15%', delay: '2.8s', duration: '12s' },
  { left: '10%', top: '45%', delay: '3.5s', duration: '8s' },
  { left: '30%', top: '85%', delay: '4s', duration: '10s' },
  { left: '50%', top: '5%', delay: '0.3s', duration: '11s' },
  { left: '70%', top: '65%', delay: '1.3s', duration: '9s' },
  { left: '90%', top: '35%', delay: '2.3s', duration: '7s' },
];

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particles.map((p, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
        style={{
          left: p.left,
          top: p.top,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }}
      />
    ))}
  </div>
);

export default function MissaoVisaoValoresPage() {
  const valores = [
    {
      icon: FaUsers,
      title: 'Foco no Associado',
      description: 'Excelência no atendimento, comunicação constante e gerar valor ao associado.',
      fullDescription: 'Colocamos nossos associados no centro de tudo. Cada decisão, cada serviço e cada iniciativa é pensada para agregar valor real aos negócios de quem confia em nós.',
      color: 'from-[#003f7f] to-[#0066cc]',
      lightColor: 'bg-blue-50',
      accentColor: '#003f7f'
    },
    {
      icon: FaHandshake,
      title: 'Comprometimento',
      description: 'Compromisso com a verdade, espírito de equipe, integridade, inovação, valor e paixão.',
      fullDescription: 'Honramos nossos compromissos com transparência e dedicação. Nossa equipe trabalha unida com paixão pelo que faz.',
      color: 'from-[#00a859] to-[#00d670]',
      lightColor: 'bg-green-50',
      accentColor: '#00a859'
    },
    {
      icon: FaRocket,
      title: 'Eficiência',
      description: 'Gestão da qualidade, fidelização, inovação, performance e solução ao associado.',
      fullDescription: 'Buscamos sempre os melhores resultados com processos otimizados e soluções que realmente fazem a diferença.',
      color: 'from-[#ffd000] to-[#ffed4e]',
      lightColor: 'bg-yellow-50',
      accentColor: '#ffd000'
    },
    {
      icon: FaShieldAlt,
      title: 'Ética',
      description: 'Transparência em todas as ações, respeito aos associados e à comunidade.',
      fullDescription: 'Agimos com integridade absoluta. A confiança dos nossos associados é nosso maior patrimônio.',
      color: 'from-[#003f7f] to-[#0066cc]',
      lightColor: 'bg-blue-50',
      accentColor: '#003f7f'
    },
    {
      icon: FaLightbulb,
      title: 'Inovação',
      description: 'Busca constante por novas soluções e tecnologias para melhor atender.',
      fullDescription: 'Estamos sempre à frente, buscando as melhores tecnologias e práticas do mercado para beneficiar nossos associados.',
      color: 'from-[#00a859] to-[#00d670]',
      lightColor: 'bg-green-50',
      accentColor: '#00a859'
    },
    {
      icon: FaChartLine,
      title: 'Excelência',
      description: 'Compromisso com a qualidade em tudo o que fazemos para nossos associados.',
      fullDescription: 'Não nos contentamos com o bom, buscamos sempre o excepcional em cada entrega.',
      color: 'from-[#ffd000] to-[#ffed4e]',
      lightColor: 'bg-yellow-50',
      accentColor: '#ffd000'
    },
  ];

  const diferenciais = [
    { icon: FaAward, text: 'Reconhecimento regional', number: '15+', label: 'Prêmios' },
    { icon: FaTrophy, text: 'Excelência em serviços', number: '98%', label: 'Satisfação' },
    { icon: FaUsers, text: 'Rede de associados', number: '100+', label: 'Empresas' },
    { icon: FaFlag, text: 'Anos de tradição', number: '30+', label: 'Anos' },
  ];

  return (
    <>
      {/* Estilos de animação */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-float { animation: float linear infinite; }
        .animate-shimmer { 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

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
            <Link href="/institucional/historia" className="hover:text-[#ffd000] transition-colors">
              Institucional
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Missão, Visão e Valores</span>
          </nav>
        </div>
      </div>

      {/* Hero Section Ultra Premium */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Background complexo */}
                <div className="absolute inset-0">
          {/* Gradiente base */}
          <div className="absolute inset-0 bg-linear-to-br from-[#001a33] via-[#003f7f] to-[#0066cc]"></div>
          
          {/* Malha de gradiente */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00a859] rounded-full blur-[150px] transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ffd000] rounded-full blur-[150px] transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#0066cc] rounded-full blur-[100px] transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
                
          {/* Grid de linhas */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>

          {/* Partículas */}
          <FloatingParticles />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              {/* Badge animado */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold mb-8 border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer"></div>
                <FaGem className="text-[#ffd000] relative z-10" />
                <span className="relative z-10">Nossos Fundamentos</span>
                      </div>
              
              {/* Título com efeito */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9]">
                <span className="block">Missão</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#ffd000] via-[#ffed4e] to-[#ffd000]">
                          Visão
                </span>
                <span className="block">Valores</span>
              </h1>
              
              <p className="text-white/80 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                Os pilares que sustentam nossa atuação e impulsionam o comércio de Ipirá rumo ao futuro.
              </p>
                        </div>

            {/* Contadores animados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16">
              {diferenciais.map((item, index) => (
                <div 
                  key={index}
                  className="relative group"
                >
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 text-center">
                    {/* Ícone com anel pulsante */}
                    <div className="relative inline-flex mb-3 sm:mb-4">
                      <div className="absolute inset-0 bg-[#ffd000]/30 rounded-full animate-pulse-ring"></div>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#ffd000] to-[#ffed4e] rounded-full flex items-center justify-center relative z-10">
                        <item.icon className="text-[#003f7f] text-xl sm:text-2xl" />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1">
                      <AnimatedCounter end={parseInt(item.number)} suffix={item.number.includes('%') ? '%' : '+'} />
                        </div>
                    <div className="text-white/60 text-xs sm:text-sm font-medium uppercase tracking-wider">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Onda SVG melhorada */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 200L48 183.3C96 166.7 192 133.3 288 116.7C384 100 480 100 576 108.3C672 116.7 768 133.3 864 141.7C960 150 1056 150 1152 141.7C1248 133.3 1344 116.7 1392 108.3L1440 100V200H1392C1344 200 1248 200 1152 200C1056 200 960 200 864 200C768 200 672 200 576 200C480 200 384 200 288 200C192 200 96 200 48 200H0Z" fill="white"/>
                      </svg>
        </div>
      </section>

      {/* Citação Inspiradora */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative">
            <FaQuoteLeft className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 text-[#003f7f]/10 text-5xl sm:text-7xl" />
            <blockquote className="text-center px-8 sm:px-12">
              <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-700 italic leading-relaxed mb-6">
                &quot;Construímos diariamente uma entidade forte, comprometida com o <span className="text-[#003f7f] font-semibold">sucesso de cada associado</span> e com o <span className="text-[#00a859] font-semibold">desenvolvimento</span> de toda nossa comunidade.&quot;
              </p>
              <footer className="text-gray-500 text-sm sm:text-base">
                <cite className="not-italic font-bold text-[#003f7f]">— Diretoria CDL Ipirá</cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Missão e Visão - Design Premium */}
      <section className="py-16 sm:py-20 md:py-24 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Missão */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-[#003f7f] to-[#0066cc] rounded-3xl sm:rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl h-full">
                {/* Header com ícone */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#003f7f] to-[#0066cc] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <FaBullseye className="text-white text-2xl sm:text-3xl" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ffd000] rounded-full flex items-center justify-center shadow-md">
                      <FaCheck className="text-[#003f7f] text-xs" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#003f7f]/60 text-xs sm:text-sm font-bold uppercase tracking-widest">Propósito</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f]">
                      Missão
                    </h2>
                  </div>
                </div>

                <div className="w-full h-1 bg-linear-to-r from-[#003f7f] via-[#0066cc] to-transparent rounded-full mb-8"></div>
                
                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify">
                  Promover o <strong className="text-[#003f7f]">fortalecimento de nossos associados</strong> através da representatividade e entrega de soluções, defendendo, orientando e contribuindo para o <strong className="text-[#003f7f]">desenvolvimento econômico e social</strong> de Ipirá e região.
                </p>

                {/* Lista de pontos */}
                <div className="mt-8 space-y-3">
                  {['Representatividade', 'Soluções eficazes', 'Desenvolvimento regional'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-2 h-2 bg-[#003f7f] rounded-full"></div>
                      <span className="text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
                </div>

            {/* Visão */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-[#00a859] to-[#00d670] rounded-3xl sm:rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 shadow-xl h-full">
                {/* Header com ícone */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-[#00a859] to-[#00d670] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <FaEye className="text-white text-2xl sm:text-3xl" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#ffd000] rounded-full flex items-center justify-center shadow-md">
                      <FaStar className="text-[#003f7f] text-xs" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[#00a859]/60 text-xs sm:text-sm font-bold uppercase tracking-widest">Futuro</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#003f7f]">
                      Visão
                    </h2>
                  </div>
                    </div>

                <div className="w-full h-1 bg-linear-to-r from-[#00a859] via-[#00d670] to-transparent rounded-full mb-8"></div>
                
                <p className="text-gray-700 text-lg sm:text-xl leading-relaxed text-justify">
                  Ser reconhecida como a <strong className="text-[#00a859]">melhor entidade da Bahia até 2030</strong>, destacando-se em práticas de compliance, excelência na fidelização e na entrega de <strong className="text-[#00a859]">soluções inovadoras e eficazes</strong>.
                </p>

                {/* Barra de progresso para 2030 */}
                <div className="mt-8 bg-gray-100 rounded-full p-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-[#00a859] to-[#00d670] rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-[#00a859]">2030</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores - Grid Interativo Premium */}
      <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#003f7f]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a859]/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#ffd000] to-[#ffed4e] text-[#003f7f] px-6 py-3 rounded-full text-sm font-black mb-6 shadow-lg">
              <FaHeart className="animate-pulse" />
              <span>O que nos move</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4">
              Nossos Valores
            </h2>
            <div className="w-32 h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
              Princípios que norteiam cada decisão e ação da CDL Ipirá.
            </p>
          </div>

          {/* Grid de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 hover:-translate-y-2">
                  {/* Ícone */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${valor.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <valor.icon className={`text-2xl sm:text-3xl ${valor.color.includes('ffd000') ? 'text-[#003f7f]' : 'text-white'}`} />
                  </div>

                  {/* Conteúdo */}
                  <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 group-hover:text-[#0066cc] transition-colors">
                    {valor.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {valor.fullDescription}
                  </p>

                  {/* Decoração */}
                  <div className={`absolute -bottom-4 -right-4 w-32 h-32 bg-linear-to-br ${valor.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-2xl`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nosso Compromisso - Nova Seção */}
      <section className="py-16 sm:py-20 bg-linear-to-r from-[#003f7f] via-[#0052a3] to-[#003f7f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
              <FaAward className="text-[#ffd000] text-3xl sm:text-4xl" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              Nosso Compromisso
            </h2>
            
            <p className="text-white/90 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto">
              Trabalhamos todos os dias para sermos mais do que uma entidade — somos <span className="text-[#ffd000] font-bold">parceiros reais</span> no crescimento de cada associado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: FaShieldAlt, text: 'Proteção e segurança' },
                { icon: FaRocket, text: 'Crescimento contínuo' },
                { icon: FaHeart, text: 'Atendimento humanizado' },
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-white/10 hover:bg-white/20 transition-all">
                  <item.icon className="text-[#ffd000] text-2xl sm:text-3xl mx-auto mb-3" />
                  <p className="text-white font-medium text-sm sm:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Premium */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 overflow-hidden">
              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd000]/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
                  Faça Parte da
                  <span className="block text-[#ffd000]">Nossa História</span>
                </h2>
                
                <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
                  Junte-se a mais de 100 empresários que confiam na CDL Ipirá.
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
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaFileAlt, FaVideo, FaPhone, FaMicrophone, FaNewspaper, FaUsers, FaChartLine, FaBullhorn, FaArrowRight } from 'react-icons/fa';

const CDLMidiaPage = () => {
  const initiatives = [
    {
      id: 1,
      title: 'CDL Conecta',
      icon: FaUsers,
      description: 'Conectando empresas e fortalecendo relacionamentos através de conteúdo estratégico e networking digital.',
      color: 'from-[#003f7f] to-[#0066cc]',
      iconBg: 'bg-[#003f7f]'
    },
    {
      id: 2,
      title: 'Minha Empresa Faz História',
      icon: FaFileAlt,
      description: 'Destaque a trajetória e os valores da sua empresa através de histórias inspiradoras e conteúdo relevante.',
      color: 'from-[#00a859] to-[#00d670]',
      iconBg: 'bg-[#00a859]'
    },
    {
      id: 3,
      title: 'CDL Cast',
      icon: FaMicrophone,
      description: 'Podcasts exclusivos com informações estratégicas, entrevistas e conteúdos que inspiram o empreendedorismo.',
      color: 'from-[#ffd000] to-[#ffed4e]',
      iconBg: 'bg-[#ffd000]'
    },
    {
      id: 4,
      title: 'CDL News',
      icon: FaNewspaper,
      description: 'Notícias, atualizações e informações relevantes sobre o mercado, economia e oportunidades de negócio.',
      color: 'from-[#ff6b6b] to-[#ff8787]',
      iconBg: 'bg-[#ff6b6b]'
    }
  ];

  const platforms = [
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: '#1877F2',
      description: 'Conteúdo exclusivo, eventos e interação com a comunidade empresarial'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      color: '#E4405F',
      description: 'Stories, reels e posts visuais que destacam sua empresa'
    },
    {
      name: 'YouTube',
      icon: FaYoutube,
      color: '#FF0000',
      description: 'Vídeos institucionais, entrevistas e conteúdo educativo'
    }
  ];

  const benefits = [
    {
      icon: FaBullhorn,
      title: 'Visibilidade',
      description: 'Sua empresa sempre em destaque nas redes sociais da CDL'
    },
    {
      icon: FaChartLine,
      title: 'Reconhecimento',
      description: 'Fortaleça a imagem e a credibilidade do seu negócio'
    },
    {
      icon: FaUsers,
      title: 'Comunidade',
      description: 'Conecte-se com outros empresários e potenciais clientes'
    },
    {
      icon: FaVideo,
      title: 'Conteúdo Exclusivo',
      description: 'Vídeos de boas-vindas, podcasts e histórias inspiradoras'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-[#003f7f] text-white py-3">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <a href="/" className="hover:text-[#ffd000] transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href="/produtos" className="hover:text-[#ffd000] transition-colors">Produtos</a>
            <span className="mx-2">/</span>
            <span className="text-white/80">CDL Mídia</span>
          </nav>
        </div>
      </div>

      {/* Hero Section com Layout em Duas Colunas */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Coluna Esquerda - Banner Visual */}
            <div className="relative bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#00a859] rounded-3xl overflow-hidden shadow-2xl min-h-[500px] flex flex-col justify-between p-8 lg:p-12">
              {/* Elementos Decorativos */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>

              {/* Ícone de Mídia (Envelope, Documento, Câmera) */}
              <div className="relative z-10">
                <div className="bg-[#ffd000] rounded-xl p-4 inline-flex items-center gap-3 mb-6">
                  <FaEnvelope className="w-6 h-6 text-[#003f7f]" />
                  <FaFileAlt className="w-6 h-6 text-[#003f7f]" />
                  <FaVideo className="w-6 h-6 text-[#003f7f]" />
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                  CDL MÍDIA
                </h1>
                <p className="text-white text-lg lg:text-xl mb-6 leading-relaxed font-semibold">
                  Sua empresa sempre na vitrine!
                </p>
                <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                  A CDL Ipirá está presente no Facebook, Instagram e YouTube, oferecendo canais 
                  exclusivos que dão voz e protagonismo à sua empresa.
                </p>
              </div>

              {/* Logo CDL no rodapé do banner */}
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-6">
                <p className="text-white font-bold text-sm">CDL Ipirá</p>
              </div>
            </div>

            {/* Coluna Direita - Informações Textuais */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-[#003f7f] mb-6">
                  CDL Mídia
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  A CDL Ipirá está presente no Facebook, Instagram e YouTube, oferecendo canais 
                  exclusivos que dão voz e protagonismo aos seus associados.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Iniciativas como <strong className="text-[#003f7f]">CDL Conecta</strong>, 
                  <strong className="text-[#003f7f]"> Minha Empresa Faz História</strong>, 
                  <strong className="text-[#003f7f]"> CDL Cast</strong> e 
                  <strong className="text-[#003f7f]"> CDL News</strong> geram visibilidade, 
                  reconhecimento e fortalecem a imagem dos negócios.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Desde vídeos de boas-vindas até podcasts, compartilhamos informações estratégicas, 
                  incentivamos o empreendedorismo e contribuímos para o crescimento econômico. 
                  Histórias inspiradoras que fortalecem os laços da comunidade com credibilidade, 
                  relevância e valor.
                </p>
              </div>

              {/* CTA e Contato */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#003f7f]/10">
                <p className="text-gray-800 font-semibold text-lg mb-4">
                  Quer destacar sua empresa? Entre em contato conosco.
                </p>
                <a
                  href="tel:557532541599"
                  className="flex items-center gap-3 text-[#003f7f] font-bold text-lg hover:text-[#0066cc] transition-colors"
                >
                  <div className="bg-[#003f7f] text-white p-3 rounded-lg">
                    <FaPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Central de Atendimento CDL Ipirá</p>
                    <p className="text-xl">(75) 3254-1599</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plataformas de Mídia */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Nossas Plataformas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos presentes nas principais redes sociais para dar visibilidade à sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              const IconComponent = platform.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 text-center"
                >
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: platform.color }}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{platform.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{platform.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Iniciativas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Nossas Iniciativas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Projetos exclusivos que geram visibilidade e reconhecimento para sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((initiative) => {
              const IconComponent = initiative.icon;
              return (
                <div
                  key={initiative.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
                >
                  <div className={`bg-linear-to-br ${initiative.color} p-6 text-white`}>
                    <div className={`${initiative.iconBg} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-black mb-2">{initiative.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">{initiative.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Benefícios para sua Empresa
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vantagens que fazem a diferença na visibilidade do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center border-2 border-gray-100"
                >
                  <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tipos de Conteúdo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-[#003f7f] mb-4">
                Tipos de Conteúdo
              </h2>
              <p className="text-xl text-gray-600">
                Diversos formatos para destacar sua empresa
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <FaVideo className="w-12 h-12 text-[#003f7f] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vídeos de Boas-Vindas</h3>
                <p className="text-gray-600">
                  Apresente sua empresa aos associados da CDL com vídeos personalizados e profissionais.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <FaMicrophone className="w-12 h-12 text-[#00a859] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Podcasts</h3>
                <p className="text-gray-600">
                  Participe de entrevistas e compartilhe conhecimento através do CDL Cast.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <FaFileAlt className="w-12 h-12 text-[#ffd000] mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Histórias Inspiradoras</h3>
                <p className="text-gray-600">
                  Conte a trajetória da sua empresa no projeto "Minha Empresa Faz História".
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-linear-to-br from-[#003f7f] via-[#0066cc] to-[#003f7f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Destaque sua Empresa nas Redes Sociais
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Faça parte da CDL Mídia e coloque sua empresa sempre na vitrine. 
              Visibilidade, reconhecimento e crescimento para o seu negócio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/imprensa/contato"
                className="bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
              >
                <span>Quero Participar</span>
                <FaArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:557532541599"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300 flex items-center gap-3"
              >
                <FaPhone className="w-5 h-5" />
                <span>(75) 3254-1599</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CDLMidiaPage;




'use client';

import React from 'react';
import { FaCheckCircle, FaShieldAlt, FaFileSignature, FaUserMd, FaGavel, FaBuilding, FaUser, FaVideo, FaPhone, FaClock, FaLock, FaCertificate, FaArrowRight } from 'react-icons/fa';

const CertificadoDigitalPage = () => {
  const certificateTypes = [
    {
      id: 1,
      title: 'Pessoa Física e Jurídica',
      icon: FaBuilding,
      description: 'Certificado digital ICP-Brasil para pessoas físicas e jurídicas. Ideal para realizar transações online, assinar documentos e acessar serviços governamentais com total segurança.',
      features: [
        'Assinatura digital de documentos',
        'Acesso a serviços governamentais',
        'Transações bancárias online',
        'Declaração de Imposto de Renda',
        'Validade jurídica garantida'
      ],
      color: 'from-[#003f7f] to-[#0066cc]',
      iconBg: 'bg-[#003f7f]'
    },
    {
      id: 2,
      title: 'e-Jurídico',
      icon: FaGavel,
      description: 'Certificado digital exclusivo para advogados. Permite assinar petições, acessar sistemas do Poder Judiciário e realizar atos processuais com validade jurídica.',
      features: [
        'Assinatura de petições digitais',
        'Acesso ao PJe (Processo Judicial Eletrônico)',
        'Validade jurídica em processos',
        'Agilidade em atos processuais',
        'Conformidade com normas do CNJ'
      ],
      color: 'from-[#00a859] to-[#00d670]',
      iconBg: 'bg-[#00a859]'
    },
    {
      id: 3,
      title: 'e-Saúde',
      icon: FaUserMd,
      description: 'Certificado digital ideal para médicos, enfermeiros e profissionais da saúde. Permite assinar receitas digitais, prontuários eletrônicos e documentos médicos com segurança.',
      features: [
        'Assinatura de receitas digitais',
        'Prontuários eletrônicos',
        'Prescrições médicas digitais',
        'Conformidade com normas da ANVISA',
        'Validade legal em documentos médicos'
      ],
      color: 'from-[#ffd000] to-[#ffed4e]',
      iconBg: 'bg-[#ffd000]'
    }
  ];

  const benefits = [
    {
      icon: FaShieldAlt,
      title: 'Segurança Total',
      description: 'Proteção garantida com criptografia de alto nível e validade jurídica'
    },
    {
      icon: FaFileSignature,
      title: 'Assinatura Digital',
      description: 'Assine documentos online com a mesma validade de uma assinatura física'
    },
    {
      icon: FaLock,
      title: 'Autenticidade',
      description: 'Garante a identidade do signatário e a integridade dos documentos'
    },
    {
      icon: FaVideo,
      title: 'Atendimento Online',
      description: 'Emissão por videoconferência, sem sair de casa ou do escritório'
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
            <span className="text-white/80">Certificado Digital</span>
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

              {/* Ícones Digitais */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <FaShieldAlt className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <FaLock className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <FaCertificate className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Conteúdo Principal */}
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
                  CERTIFICADO
                  <span className="block text-[#ffd000]">DIGITAL</span>
                </h1>
                <p className="text-white text-lg lg:text-xl mb-6 leading-relaxed">
                  Realize transações online e troca de documentos virtuais com segurança!
                </p>
                <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                  Oferecemos certificados digitais ICP-Brasil destinados à pessoa física e pessoa jurídica, 
                  e-jurídica destinado a advogados, e-saúde para enfermeiros e médicos de acordo com a 
                  necessidade de cada cliente.
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
                  Certificado Digital - Segurança e praticidade na palma da sua mão
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  O Certificado Digital é um documento eletrônico que funciona como uma identidade virtual, 
                  garantindo validade jurídica e total segurança em transações online. Ele é essencial para 
                  quem busca agilidade, autenticidade e proteção nas atividades digitais.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Na CDL Ipirá, você encontra certificados digitais da ICP-Brasil, com opções pensadas para 
                  diferentes perfis e necessidades:
                </p>
              </div>

              {/* Lista de Tipos */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">
                    <strong className="text-[#003f7f]">Pessoa Física e Jurídica</strong> - Certificado ICP-Brasil para uso geral
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">
                    <strong className="text-[#003f7f]">e-Jurídico</strong> - Exclusivo para advogados
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="w-6 h-6 text-[#00a859] flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">
                    <strong className="text-[#003f7f]">e-Saúde</strong> - Ideal para médicos, enfermeiros e profissionais da saúde
                  </span>
                </li>
              </ul>

              <div className="bg-[#003f7f]/5 rounded-xl p-6 border-l-4 border-[#003f7f]">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  Tudo com atendimento ágil, prático e seguro — inclusive por videoconferência, para sua 
                  maior comodidade, emita seu certificado de onde estiver.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Simplifique sua rotina com tecnologia, confiança e credibilidade.
                </p>
              </div>

              {/* CTA e Contato */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#003f7f]/10">
                <p className="text-gray-800 font-semibold text-lg mb-4">
                  Quer saber mais? Entre em contato conosco.
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

      {/* Tipos de Certificados Detalhados */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Tipos de Certificado Digital
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o certificado ideal para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certificateTypes.map((cert) => {
              const IconComponent = cert.icon;
              return (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100"
                >
                  <div className={`bg-linear-to-br ${cert.color} p-8 text-white`}>
                    <div className={`${cert.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-3">{cert.title}</h3>
                    <p className="text-white/90 leading-relaxed">{cert.description}</p>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-gray-900 mb-4">Principais funcionalidades:</h4>
                    <ul className="space-y-3">
                      {cert.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <FaCheckCircle className={`w-5 h-5 ${cert.iconBg} text-white rounded-full flex-shrink-0 mt-0.5`} />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[#003f7f] mb-4">
              Por que escolher o Certificado Digital?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Vantagens que fazem a diferença no seu dia a dia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
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

      {/* Processo de Emissão */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-[#003f7f] mb-4">
                Como Emitir seu Certificado Digital
              </h2>
              <p className="text-xl text-gray-600">
                Processo simples, rápido e seguro
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Contato', desc: 'Entre em contato com a CDL Ipirá' },
                { step: 2, title: 'Documentação', desc: 'Envie os documentos necessários' },
                { step: 3, title: 'Videoconferência', desc: 'Realize a validação por vídeo' },
                { step: 4, title: 'Emissão', desc: 'Receba seu certificado digital' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="bg-[#003f7f] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
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
              Emita seu Certificado Digital Agora
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Atendimento por videoconferência. Emita de onde estiver, com total segurança e praticidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contato"
                className="bg-[#ffd000] text-[#003f7f] px-8 py-4 rounded-full font-bold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3"
              >
                <span>Solicitar Certificado</span>
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

export default CertificadoDigitalPage;




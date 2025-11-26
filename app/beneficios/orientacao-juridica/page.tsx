'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaGavel, FaFileContract, FaHandshake, FaShieldAlt, FaQuestionCircle, FaPhone, FaEnvelope, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    title: 'Consultoria Jurídica',
    description: 'Orientações jurídicas personalizadas para questões trabalhistas, tributárias, contratuais e empresariais.',
    icon: <FaGavel className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
  {
    id: 2,
    title: 'Análise de Contratos',
    description: 'Revisão e análise de contratos comerciais, parcerias, fornecedores e acordos diversos.',
    icon: <FaFileContract className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'from-[#00a859] to-[#00d670]'
  },
  {
    id: 3,
    title: 'Mediação e Conciliação',
    description: 'Serviços de mediação para resolução de conflitos comerciais de forma rápida e eficiente.',
    icon: <FaHandshake className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'from-[#ffd000] to-[#ffed4e]'
  },
  {
    id: 4,
    title: 'Proteção Legal',
    description: 'Assessoria para proteção dos direitos do comerciante e orientações sobre legislação comercial.',
    icon: <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: 'from-[#003f7f] to-[#0066cc]'
  },
];

const faqs = [
  {
    id: 1,
    question: 'Quem pode utilizar o serviço de Orientação Jurídica?',
    answer: 'O serviço é exclusivo para associados da CDL Ipirá. Basta estar em dia com as mensalidades para ter acesso gratuito às orientações jurídicas.'
  },
  {
    id: 2,
    question: 'Quais tipos de questões podem ser orientadas?',
    answer: 'Oferecemos orientação em questões trabalhistas, tributárias, contratuais, comerciais, consumeristas e outras relacionadas ao comércio e negócios.'
  },
  {
    id: 3,
    question: 'Como agendar uma consulta?',
    answer: 'Você pode agendar através do formulário abaixo, por telefone ou pessoalmente na sede da CDL Ipirá. Nossa equipe entrará em contato para confirmar o horário.'
  },
  {
    id: 4,
    question: 'O serviço é gratuito?',
    answer: 'Sim, a orientação jurídica é um benefício gratuito para todos os associados da CDL Ipirá em dia com suas obrigações.'
  },
  {
    id: 5,
    question: 'Posso receber orientação por telefone ou online?',
    answer: 'Sim, oferecemos atendimento presencial, por telefone e online, conforme a disponibilidade e necessidade do associado.'
  },
];

export default function OrientacaoJuridicaPage() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setFormStatus('idle');

    const formData = new FormData(e.currentTarget);
    const requestData = {
      nome: formData.get('nome'),
      empresa: formData.get('empresa'),
      contato: formData.get('contato'),
      email: formData.get('email'),
      assunto: formData.get('assunto'),
      descricao: formData.get('descricao'),
      dataSolicitacao: new Date().toISOString(),
    };

    try {
      // Aqui você pode substituir pela URL real da sua API
      // const response = await fetch('/api/orientacao-juridica', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestData),
      // });

      // Simulação de envio
      console.log('Solicitação de orientação jurídica:', requestData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus('success');
      e.currentTarget.reset();
      
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setFormStatus('error');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-[#003f7f] text-white py-2.5 sm:py-3">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="hover:text-[#ffd000] transition-colors flex items-center gap-1 group"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-[-2px] transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Início</span>
            </Link>
            <span className="text-white/40">/</span>
            <Link 
              href="#" 
              className="hover:text-[#ffd000] transition-colors"
            >
              Benefícios
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Orientação Jurídica</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <div className="inline-block bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black mb-4 sm:mb-6 shadow-2xl">
              ⚖️ Orientação Jurídica
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-3 sm:mb-4 leading-tight">
              Orientação Jurídica
            </h1>
            <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4 text-justify">
              Proteja seu negócio com orientações jurídicas especializadas. Serviço exclusivo e gratuito para associados da CDL Ipirá.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços Oferecidos */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
              Serviços Oferecidos
            </h2>
            <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br ${service.color} rounded-full flex items-center justify-center mb-4 sm:mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Por que escolher nossa Orientação Jurídica?
              </h2>
              <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                    <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Gratuito para Associados
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Serviço totalmente gratuito para associados em dia com suas obrigações.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                    <FaUsers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Profissionais Qualificados
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Equipe de advogados especializados em direito comercial e empresarial.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0">
                    <FaClock className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Atendimento Rápido
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Respostas ágeis para suas dúvidas jurídicas, sem burocracia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                    <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-2">
                      Proteção do Seu Negócio
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-justify">
                      Orientações para proteger seus direitos e evitar problemas jurídicos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Solicitação */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-200">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                  Solicite sua Orientação
                </h2>
                <p className="text-gray-700 text-sm sm:text-base text-justify">
                  Preencha o formulário abaixo e nossa equipe entrará em contato para agendar sua orientação jurídica.
                </p>
              </div>

              {/* Mensagem de Sucesso */}
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-[#00a859] text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                  <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <div>
                    <p className="font-bold">Solicitação enviada com sucesso!</p>
                    <p className="text-sm text-white/90">Nossa equipe entrará em contato em breve.</p>
                  </div>
                </div>
              )}

              {/* Mensagem de Erro */}
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500 text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-bold">Erro ao enviar solicitação</p>
                    <p className="text-sm text-white/90">Tente novamente ou entre em contato conosco.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      required
                      disabled={isFormSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      required
                      disabled={isFormSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="contato"
                      required
                      disabled={isFormSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={isFormSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Assunto da Consulta *
                  </label>
                  <input
                    type="text"
                    name="assunto"
                    required
                    placeholder="Ex: Questão trabalhista, análise de contrato, etc."
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Descrição da Situação *
                  </label>
                  <textarea
                    name="descricao"
                    required
                    rows={5}
                    placeholder="Descreva sua situação ou dúvida jurídica..."
                    disabled={isFormSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isFormSubmitting || formStatus === 'success'}
                    className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isFormSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Solicitação
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 animate-blur-fade-in">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-3 sm:mb-4">
                Perguntas Frequentes
              </h2>
              <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => setSelectedFaq(selectedFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 sm:p-5 md:p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <FaQuestionCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#003f7f] flex-1">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f] shrink-0 transition-transform ${selectedFaq === faq.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {selectedFaq === faq.id && (
                    <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pl-12 sm:pl-14 md:pl-16">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contato Rápido */}
      <section className="py-8 sm:py-12 md:py-16 bg-linear-to-br from-[#003f7f] via-[#0052a3] to-[#0066cc] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-blur-fade-in">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black mb-4 sm:mb-6">
              Precisa de Ajuda Imediata?
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Entre em contato conosco através dos canais abaixo para atendimento rápido.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <a
                href="tel:+5575999999999"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#003f7f] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#ffd000] hover:text-[#003f7f] transition-all duration-300 hover:scale-105 shadow-xl group"
              >
                <FaPhone className="w-4 h-4 sm:w-5 sm:h-5" />
                Ligar Agora
              </a>
              <a
                href="mailto:juridico@cdlipira.com.br"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-[#003f7f] transition-all duration-300 group"
              >
                <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5" />
                Enviar E-mail
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


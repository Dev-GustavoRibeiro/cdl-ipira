'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaSearch, FaFileAlt, FaTimes } from 'react-icons/fa';
import JobModal from '@/app/components/JobModal';

interface Job {
  id: number;
  title: string;
  company: string;
  quantity: number;
  description: string;
  location?: string;
  date?: string;
  category?: string;
}


const categories = ['Todas', 'Administrativo', 'Vendas', 'Gestão', 'Serviços Gerais'];

export default function BalcaoEmpregosPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Estado para o Modal de Visualização de Vaga
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/vagas');
        if (response.ok) {
          const data = await response.json();
          // Mapear dados do Supabase para o formato da interface se necessário
          // A interface espera: id, title, company, quantity, description, location, date, category
          // O banco retorna: id, title, company, quantity, description, location, date, category
          const mappedData = data.map((item: any) => ({
            ...item,
            // Formatar data se necessário
            date: item.date ? new Date(item.date).toLocaleDateString('pt-BR') : ''
          }));
          setJobs(mappedData);
        } else {
          console.error('Erro na resposta da API');
          setJobs([]); 
        }
      } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const categoryMatch = selectedCategory === 'Todas' || job.category === selectedCategory;
    const searchMatch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  useEffect(() => {
    if (isModalOpen || isJobModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen, isJobModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitStatus('idle');
    setIsSubmitting(false);
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(form);
    const empresa = formData.get('empresa') as string;
    const cargo = formData.get('cargo') as string;
    const descricao = formData.get('descricao') as string;
    const quantidade = formData.get('quantidade') as string;
    const localizacao = formData.get('localizacao') as string;
    const contato = formData.get('contato') as string;
    const email = formData.get('email') as string;

    const message = `Olá, gostaria de cadastrar uma nova vaga no Balcão de Empregos da CDL:\n\n` +
      `🏢 *Empresa:* ${empresa}\n` +
      `💼 *Cargo:* ${cargo}\n` +
      `📝 *Descrição:* ${descricao}\n` +
      `🔢 *Quantidade:* ${quantidade}\n` +
      `📍 *Localização:* ${localizacao}\n` +
      `👤 *Contato:* ${contato}\n` +
      `📧 *Email:* ${email}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5575992191260&text=${encodeURIComponent(message)}`;

    // Pequeno atraso para UX
    setTimeout(() => {
        // Abrir WhatsApp em nova aba
        window.open(whatsappUrl, '_blank');
        
        setSubmitStatus('success');
        form.reset();
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
            closeModal();
            setSubmitStatus('idle');
        }, 3000);
        
        setIsSubmitting(false);
    }, 500);
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
              Produtos
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white font-semibold">Balcão de Empregos</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Imagem à Esquerda */}
            <div className="order-2 lg:order-1 animate-blur-fade-in">
              <div className="relative w-full h-[400px] xs:h-[450px] sm:h-[500px] md:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl bg-linear-to-br from-[#003f7f] to-[#0066cc]">
                <div className="absolute inset-0 bg-linear-to-br from-[#003f7f] to-[#0066cc] opacity-90">
                  {/* Placeholder para imagem da carteira de trabalho */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/20">
                      <FaFileAlt className="w-48 h-48 sm:w-64 sm:h-64" />
                    </div>
                  </div>
                </div>
                
                {/* Overlay com texto */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 z-10">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#ffd000] mb-4 sm:mb-6 drop-shadow-2xl text-center">
                    BALCÃO DE EMPREGOS
                  </h2>
                  <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-center drop-shadow-lg">
                    Oportunidades de emprego, você encontra no site da CDL.
                  </p>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg text-center">
                    www.cdlipira.com.br
                  </p>
                </div>

                {/* Ícone de lupa decorativo */}
                <div className="absolute top-1/4 right-1/4 z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 sm:p-6">
                    <FaSearch className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Texto à Direita */}
            <div className="order-1 lg:order-2 animate-blur-fade-in">
              <div className="sticky top-24">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-[#003f7f] mb-4 sm:mb-6 leading-tight">
                  Contrate agora!
                </h1>
                
                <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-linear-to-r from-[#003f7f] via-[#00a859] to-[#ffd000] rounded-full mb-6 sm:mb-8"></div>

                <p className="text-gray-700 text-sm xs:text-base sm:text-lg leading-relaxed text-justify mb-6 sm:mb-8">
                  Com o CDL Balcão de Empregos, você terá acesso aos currículos dos melhores profissionais da cidade!
                </p>

                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00a859] rounded-full flex items-center justify-center shrink-0">
                      <FaBriefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                        Acesso a Talentos
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 text-justify">
                        Encontre profissionais qualificados e prontos para contribuir com seu negócio.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#003f7f] rounded-full flex items-center justify-center shrink-0">
                      <FaUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                        Processo Simplificado
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 text-justify">
                        Cadastre suas vagas e receba currículos de candidatos interessados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffd000] rounded-full flex items-center justify-center shrink-0">
                      <FaFileAlt className="w-5 h-5 sm:w-6 sm:h-6 text-[#003f7f]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#003f7f] mb-1">
                        Gratuito para Associados
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 text-justify">
                        Serviço exclusivo e gratuito para associados da CDL Ipirá.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={openModal}
                    className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    Cadastre sua vaga
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Busca e Filtros */}
      <section className="py-6 sm:py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Busca */}
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar vagas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-[#003f7f] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-[#003f7f] hover:text-white border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Vagas */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Coluna Principal - Vagas */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f] mb-6 sm:mb-8">
                Vagas Disponíveis
              </h2>
              
              {isLoading ? (
                <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003f7f] mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg sm:text-xl">Carregando vagas...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
                  <FaBriefcase className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg sm:text-xl">Nenhuma vaga encontrada com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {filteredJobs.map((job, index) => (
                    <article
                      key={job.id}
                      className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:border-[#003f7f] hover:shadow-lg transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1">
                          <h3 
                            onClick={() => openJobModal(job)}
                            className="text-lg sm:text-xl md:text-2xl font-bold text-[#003f7f] mb-2 cursor-pointer hover:underline"
                          >
                            {job.title}
                          </h3>
                          {job.company && (
                            <p className="text-sm sm:text-base text-gray-600 mb-2">
                              {job.company}
                            </p>
                          )}
                        </div>
                        <div className="bg-[#003f7f] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base ml-3 sm:ml-4 shrink-0">
                          {job.quantity.toString().padStart(2, '0')}
                        </div>
                      </div>

                      <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-5 leading-relaxed text-justify line-clamp-3">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        {job.location && (
                          <div className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#00a859]" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.date && (
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffd000]" />
                            <span>{job.date}</span>
                          </div>
                        )}
                        {job.category && (
                          <div className="flex items-center gap-1.5">
                            <FaBriefcase className="w-3 h-3 sm:w-4 sm:h-4 text-[#003f7f]" />
                            <span>{job.category}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-200">
                        <button 
                          onClick={() => openJobModal(job)}
                          className="text-[#00a859] font-bold hover:text-[#0066cc] transition-colors text-sm sm:text-base inline-flex items-center gap-2 group"
                        >
                          Ver detalhes
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Quer Contratar */}
            <div className="lg:col-span-1">
              <div className="bg-linear-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 sticky top-24">
                <h3 className="text-xl sm:text-2xl font-black text-[#003f7f] mb-3 sm:mb-4">
                  Quer contratar?
                </h3>
                <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 leading-relaxed text-justify">
                  Inicie seu recrutamento completo e preencha suas vagas!
                </p>
                <button
                  onClick={openModal}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#003f7f] text-white px-5 sm:px-6 py-3 sm:py-4 rounded-full font-bold hover:bg-[#0066cc] transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base group"
                >
                  Cadastre sua vaga
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                  <h4 className="text-base sm:text-lg font-bold text-[#003f7f] mb-3 sm:mb-4">
                    Benefícios
                  </h4>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#00a859] font-bold shrink-0">✓</span>
                      <span className="text-justify">Acesso a currículos qualificados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00a859] font-bold shrink-0">✓</span>
                      <span className="text-justify">Divulgação gratuita para associados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00a859] font-bold shrink-0">✓</span>
                      <span className="text-justify">Processo de recrutamento simplificado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#00a859] font-bold shrink-0">✓</span>
                      <span className="text-justify">Suporte da equipe CDL</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Cadastro de Vaga */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#003f7f]">
                Cadastre sua Vaga
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                aria-label="Fechar"
              >
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <p className="text-gray-700 text-sm sm:text-base mb-6 sm:mb-8 text-justify">
              Preencha os dados abaixo para enviar as informações da sua vaga diretamente para nossa equipe via WhatsApp.
            </p>

            {/* Mensagem de Sucesso */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-[#00a859] text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Redirecionando para o WhatsApp...</p>
                  <p className="text-sm text-white/90">Finalize o cadastro enviando a mensagem.</p>
                </div>
              </div>
            )}

            {/* Mensagem de Erro */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500 text-white rounded-xl flex items-center gap-3 animate-blur-fade-in">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold">Erro ao cadastrar vaga</p>
                  <p className="text-sm text-white/90">Tente novamente ou entre em contato conosco.</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Cargo/Vaga *
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
              </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Descrição da Vaga *
                  </label>
                  <textarea
                    name="descricao"
                    required
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  ></textarea>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Quantidade de Vagas *
                  </label>
                  <input
                    type="number"
                    name="quantidade"
                    min="1"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    name="localizacao"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contato *
                  </label>
                  <input
                    type="text"
                    name="contato"
                    required
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003f7f] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || submitStatus === 'success'}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-linear-to-r from-[#003f7f] to-[#0066cc] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar via WhatsApp
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Vaga */}
      <JobModal 
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        job={selectedJob}
      />
    </>
  );
}

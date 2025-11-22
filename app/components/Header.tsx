'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPhone, FaSearch, FaChevronRight, FaBuilding, FaNewspaper, FaBox, FaGift, FaHistory, FaUsers, FaBullseye, FaFileAlt, FaVideo, FaImages, FaCalendarAlt, FaEnvelope, FaShieldAlt, FaMobileAlt, FaCertificate, FaBolt, FaHeartbeat, FaTooth, FaCreditCard, FaStore, FaBroadcastTower, FaBriefcase, FaGraduationCap, FaHandshake, FaBalanceScale, FaStoreAlt, FaInfoCircle, FaMusic } from 'react-icons/fa';

const Header = () => {
  const [isInstitucionalOpen, setIsInstitucionalOpen] = useState(false);
  const [isImprensaOpen, setIsImprensaOpen] = useState(false);
  const [isProdutosOpen, setIsProdutosOpen] = useState(false);
  const [isBeneficiosOpen, setIsBeneficiosOpen] = useState(false);
  
  // Refs para os dropdowns (para melhor controle)
  const institucionalRef = useRef<HTMLDivElement>(null);
  const imprensaRef = useRef<HTMLDivElement>(null);
  const produtosRef = useRef<HTMLDivElement>(null);
  const beneficiosRef = useRef<HTMLDivElement>(null);
  
  // Timeouts para delay no fechamento
  const closeTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  
  // Função para abrir dropdown com delay no fechamento
  const handleMouseEnter = (dropdown: string) => {
    // Cancela qualquer timeout de fechamento pendente
    if (closeTimeouts.current[dropdown]) {
      clearTimeout(closeTimeouts.current[dropdown]);
      delete closeTimeouts.current[dropdown];
    }
    
    switch(dropdown) {
      case 'institucional':
        setIsInstitucionalOpen(true);
        break;
      case 'imprensa':
        setIsImprensaOpen(true);
        break;
      case 'produtos':
        setIsProdutosOpen(true);
        break;
      case 'beneficios':
        setIsBeneficiosOpen(true);
        break;
    }
  };
  
  // Função para fechar dropdown com delay
  const handleMouseLeave = (dropdown: string) => {
    const timeout = setTimeout(() => {
      switch(dropdown) {
        case 'institucional':
          setIsInstitucionalOpen(false);
          break;
        case 'imprensa':
          setIsImprensaOpen(false);
          break;
        case 'produtos':
          setIsProdutosOpen(false);
          break;
        case 'beneficios':
          setIsBeneficiosOpen(false);
          break;
      }
      delete closeTimeouts.current[dropdown];
    }, 200); // 200ms de delay
    
    closeTimeouts.current[dropdown] = timeout;
  };

  return (
    <>
      {/* Barra azul superior */}
      <div className="bg-[#003f7f] text-white py-2 sm:py-2.5">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-center sm:justify-end items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
            <span className="hidden sm:inline">Central de Atendimento</span>
            <a href="tel:5575999145061" className="flex items-center gap-1.5 sm:gap-2 font-semibold hover:text-[#ffd000] transition-colors whitespace-nowrap">
              <FaPhone className="text-xs sm:text-sm" /> 
              <span className="text-xs sm:text-sm">(75) 99914-5061</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Logos */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image 
                  src="/logo-cdl.png" 
                  alt="CDL Ipirá" 
                  width={280}
                  height={112}
                  className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain cursor-pointer"
                  priority
                />
              </Link>
              <a 
                href="https://www.spcbrasil.org.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity hidden sm:block"
              >
                <Image 
                  src="/spc-brasil-logo.png" 
                  alt="SPC Brasil" 
                  width={280}
                  height={112}
                  className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-auto object-contain cursor-pointer"
                  priority
                />
              </a>
            </div>

            {/* Menu Desktop - Tablet e Desktop */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 flex-wrap">
              <div 
                ref={institucionalRef}
                className="relative group"
                onMouseEnter={() => handleMouseEnter('institucional')}
                onMouseLeave={() => handleMouseLeave('institucional')}
              >
                <button className={`text-gray-700 font-medium text-sm lg:text-base flex items-center gap-2 transition-all whitespace-nowrap px-2 py-1 rounded-md ${isInstitucionalOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaBuilding className="w-3.5 h-3.5" />
                  <span>Institucional</span>
                  <svg className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 ${isInstitucionalOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isInstitucionalOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden">
                    <div className="bg-gradient-to-r from-[#003f7f] to-[#0066cc] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaBuilding className="w-3 h-3" />
                        Institucional
                      </h4>
                    </div>
                    <Link 
                      href="/historia" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaHistory className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">História</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/diretoria" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaUsers className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Diretoria</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/missao-visao-valores" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaBullseye className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Missão Visão e Valores</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <div 
                ref={imprensaRef}
                className="relative group"
                onMouseEnter={() => handleMouseEnter('imprensa')}
                onMouseLeave={() => handleMouseLeave('imprensa')}
              >
                <button className={`text-gray-700 font-medium text-sm lg:text-base flex items-center gap-2 transition-all whitespace-nowrap px-2 py-1 rounded-md ${isImprensaOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaNewspaper className="w-3.5 h-3.5" />
                  <span>Imprensa</span>
                  <svg className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 ${isImprensaOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu Imprensa */}
                {isImprensaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden">
                    <div className="bg-gradient-to-r from-[#00a859] to-[#00d670] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaNewspaper className="w-3 h-3" />
                        Imprensa
                      </h4>
                    </div>
                    <Link 
                      href="/noticias" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaFileAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Notícias</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/tv-lojista" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaVideo className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">TV Lojista</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/galeria-fotos" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaImages className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Galeria Fotos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/eventos" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaCalendarAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Eventos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/contato" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaEnvelope className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Contato</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <a href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#003f7f] font-medium text-sm lg:text-base transition-colors whitespace-nowrap">
                Filie-se
              </a>

              <div 
                ref={produtosRef}
                className="relative group"
                onMouseEnter={() => handleMouseEnter('produtos')}
                onMouseLeave={() => handleMouseLeave('produtos')}
              >
                <button className={`text-gray-700 font-medium text-sm lg:text-base flex items-center gap-2 transition-all whitespace-nowrap px-2 py-1 rounded-md ${isProdutosOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaBox className="w-3.5 h-3.5" />
                  <span>Produtos</span>
                  <svg className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 ${isProdutosOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu Produtos */}
                {isProdutosOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[500px] overflow-y-auto animate-blur-fade-in scrollbar-thin scrollbar-thumb-[#003f7f] scrollbar-track-gray-100">
                    <div className="bg-gradient-to-r from-[#ffd000] to-[#ffed4e] px-4 py-2 mb-1 sticky top-0">
                      <h4 className="text-[#003f7f] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaBox className="w-3 h-3" />
                        Produtos & Serviços
                      </h4>
                    </div>
                    <Link 
                      href="/produtos/spc-brasil" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaShieldAlt className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">SPC Brasil</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cdl-celular" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaMobileAlt className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">CDL Celular</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/certificado-digital" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaCertificate className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">Certificado Digital</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cdl-energia" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaBolt className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">CDL Energia</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cdl-saude" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaHeartbeat className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">CDL Saúde</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cdl-odonto" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaTooth className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">CDL Odonto</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cartao-credito-cdl" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaCreditCard className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">Cartão de Crédito CDL</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/espaco-cdl" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaStore className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">Espaço CDL</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cdl-midia" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaBroadcastTower className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">CDL Mídia</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/balcao-empregos" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaBriefcase className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">Balcão de Empregos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/produtos/cursos-palestras" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaGraduationCap className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors flex-shrink-0" />
                      <span className="flex-1">Cursos e Palestras</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <div 
                ref={beneficiosRef}
                className="relative group"
                onMouseEnter={() => handleMouseEnter('beneficios')}
                onMouseLeave={() => handleMouseLeave('beneficios')}
              >
                <button className={`text-gray-700 font-medium text-sm lg:text-base flex items-center gap-2 transition-all whitespace-nowrap px-2 py-1 rounded-md ${isBeneficiosOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaGift className="w-3.5 h-3.5" />
                  <span>Benefícios</span>
                  <svg className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-200 ${isBeneficiosOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Dropdown Menu Benefícios */}
                {isBeneficiosOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden">
                    <div className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8787] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaGift className="w-3 h-3" />
                        Benefícios
                      </h4>
                    </div>
                    <Link 
                      href="/beneficios/projeto-conduz" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaMusic className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Projeto Conduz</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/beneficios/cartao-convenio" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaCreditCard className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Cartão Convênio</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/beneficios/orientacao-juridica" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaBalanceScale className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Orientação Jurídica</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/beneficios/convenios" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaHandshake className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Convênios</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/beneficios/empresas" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaStoreAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Empresas</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link 
                      href="/beneficios/nucleo-informacoes" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaInfoCircle className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Núcleo de Informações</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Campo de Busca - Desktop */}
            <div className="hidden xl:flex items-center gap-2 bg-gray-100 rounded-full px-3 lg:px-4 py-1.5 lg:py-2 flex-1 max-w-md ml-4">
              <input 
                type="text" 
                placeholder="Pesquise em cdlipira.com.br"
                className="bg-transparent outline-none flex-1 text-xs lg:text-sm"
              />
              <button className="bg-[#003f7f] text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm hover:bg-[#0066cc] transition-colors font-medium whitespace-nowrap">
                Pesquisar
              </button>
            </div>

            {/* Botão de Busca Mobile/Tablet */}
            <button 
              className="xl:hidden text-[#003f7f] text-lg sm:text-xl p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Pesquisar"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

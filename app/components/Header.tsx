'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPhone, FaSearch, FaChevronRight, FaBuilding, FaNewspaper, FaBox, FaGift, FaHistory, FaUsers, FaBullseye, FaFileAlt, FaVideo, FaImages, FaCalendarAlt, FaEnvelope, FaShieldAlt, FaCertificate, FaBroadcastTower, FaBriefcase, FaHandshake, FaBalanceScale, FaStoreAlt, FaTimes, FaBullhorn } from 'react-icons/fa';

type Dropdown = 'institucional' | 'imprensa' | 'produtos' | 'beneficios';

const Header = () => {
  const router = useRouter();
  // Apenas um dropdown aberto por vez
  const [openDropdown, setOpenDropdown] = useState<Dropdown | null>(null);
  const isInstitucionalOpen = openDropdown === 'institucional';
  const isImprensaOpen = openDropdown === 'imprensa';
  const isProdutosOpen = openDropdown === 'produtos';
  const isBeneficiosOpen = openDropdown === 'beneficios';
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Função para realizar a pesquisa
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValue = formData.get('search') as string || '';
    // Usa o valor do FormData ou do state como fallback
    const query = (formValue || searchTerm).trim();

    if (query.length >= 2) {
      router.push(`/pesquisa?q=${encodeURIComponent(query)}`);
      setSearchTerm('');
      setIsMobileSearchOpen(false);
    }
  };

  // Função para abrir busca mobile
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (!isMobileSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const stickyRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Publica a altura real do header fixo em --header-height (usada pelas barras de filtro sticky)
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty('--header-height', `${el.offsetHeight}px`);
    update();
    // iOS < 13.4 não tem ResizeObserver: fica com a medida inicial
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--header-height');
    };
  }, []);

  // Fecha o dropdown ao clicar/tocar fora do menu
  useEffect(() => {
    if (!openDropdown) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openDropdown]);

  // Timeouts para delay no fechamento
  const closeTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  // Tipo do último ponteiro que pressionou um botão do menu (mouse, touch, pen)
  const lastPointerType = useRef('');

  const cancelClose = (dropdown: Dropdown) => {
    if (closeTimeouts.current[dropdown]) {
      clearTimeout(closeTimeouts.current[dropdown]);
      delete closeTimeouts.current[dropdown];
    }
  };

  const closeDropdown = (dropdown: Dropdown) => {
    setOpenDropdown((current) => (current === dropdown ? null : current));
  };

  // Cada dropdown identifica seu wrapper com data-dropdown (handlers únicos para os 4 menus)
  const dropdownOf = (el: Element) => el.closest<HTMLElement>('[data-dropdown]')?.dataset.dropdown as Dropdown;

  // Hover só para mouse: no toque o dropdown abre/fecha pelo clique
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const dropdown = dropdownOf(e.currentTarget);
    cancelClose(dropdown);
    setOpenDropdown(dropdown);
  };

  // Fecha com delay ao tirar o mouse
  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const dropdown = dropdownOf(e.currentTarget);
    closeTimeouts.current[dropdown] = setTimeout(() => {
      closeDropdown(dropdown);
      delete closeTimeouts.current[dropdown];
    }, 200); // 200ms de delay
  };

  // Esc fecha e devolve o foco ao botão do menu
  const handleDropdownKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dropdown = dropdownOf(e.currentTarget);
    if (e.key === 'Escape' && openDropdown === dropdown) {
      closeDropdown(dropdown);
      e.currentTarget.querySelector('button')?.focus();
    }
  };

  // Fecha quando o foco vai para outro elemento fora do dropdown (Tab para fora).
  // Sem relatedTarget (clique em área sem foco) quem fecha é o pointerdown externo.
  const handleDropdownBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) closeDropdown(dropdownOf(e.currentTarget));
  };

  const handleButtonPointerDown = (e: React.PointerEvent) => {
    lastPointerType.current = e.pointerType;
  };

  // Clique: com mouse o hover já abriu, então mantém aberto; toque e teclado alternam
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dropdown = dropdownOf(e.currentTarget);
    const keepOpen = lastPointerType.current === 'mouse';
    lastPointerType.current = '';
    cancelClose(dropdown);
    setOpenDropdown((current) => (current === dropdown && !keepOpen ? null : dropdown));
  };

  return (
    <>
      {/* Wrapper sticky para mobile e desktop */}
      <div ref={stickyRef} className="sticky top-0 z-50">
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
      <header className="bg-white shadow-md" suppressHydrationWarning>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* Logos */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
              <Link href="/" className="hover:opacity-80 transition-opacity flex items-center h-14 sm:h-20 md:h-24 lg:h-28 xl:h-32">
                <Image
                  src="/logo-cdl.png"
                  alt="CDL Ipirá"
                  width={350}
                  height={140}
                  className="w-auto h-full object-contain cursor-pointer"
                  priority
                />
              </Link>
              <a
                href="https://www.spcbrasil.org.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity hidden sm:flex items-center h-14 sm:h-20 md:h-24 lg:h-28 xl:h-32"
              >
                <Image
                  src="/spc-brasil-logo.png"
                  alt="SPC Brasil"
                  width={350}
                  height={140}
                  className="w-auto h-full object-contain cursor-pointer"
                  priority
                />
              </a>
            </div>

            {/* Menu Desktop - Tablet e Desktop */}
            <nav ref={navRef} aria-label="Menu principal" className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-4 shrink-0" suppressHydrationWarning>
              <div
                className="relative group"
                data-dropdown="institucional"
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onKeyDown={handleDropdownKeyDown}
                onBlur={handleDropdownBlur}
                suppressHydrationWarning
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'institucional'}
                  onPointerDown={handleButtonPointerDown}
                  onClick={handleButtonClick}
                  className={`text-gray-700 font-medium text-sm 2xl:text-base flex items-center gap-1.5 transition-all whitespace-nowrap px-2 py-1.5 rounded-md ${isInstitucionalOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaBuilding className="hidden xl:block w-3.5 h-3.5 shrink-0" />
                  <span>Institucional</span>
                  <svg className={`w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-200 ${isInstitucionalOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isInstitucionalOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden" onClick={() => setOpenDropdown(null)}>
                    <div className="bg-linear-to-r from-[#003f7f] to-[#0066cc] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaBuilding className="w-3 h-3" />
                        Institucional
                      </h4>
                    </div>
                    <Link
                      href="/institucional/historia"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaHistory className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">História</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/institucional/diretoria"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaUsers className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Diretoria</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/institucional/missao-visao-valores"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaBullseye className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Missão Visão e Valores</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/institucional/compromisso-cdl"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaHandshake className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Compromisso CDL</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/institucional/portal-transparencia"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item"
                    >
                      <FaFileAlt className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Portal Transparência</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <div
                className="relative group"
                data-dropdown="imprensa"
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onKeyDown={handleDropdownKeyDown}
                onBlur={handleDropdownBlur}
                suppressHydrationWarning
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'imprensa'}
                  onPointerDown={handleButtonPointerDown}
                  onClick={handleButtonClick}
                  className={`text-gray-700 font-medium text-sm 2xl:text-base flex items-center gap-1.5 transition-all whitespace-nowrap px-2 py-1.5 rounded-md ${isImprensaOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaNewspaper className="hidden xl:block w-3.5 h-3.5 shrink-0" />
                  <span>Imprensa</span>
                  <svg className={`w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-200 ${isImprensaOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu Imprensa */}
                {isImprensaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden" onClick={() => setOpenDropdown(null)}>
                    <div className="bg-linear-to-r from-[#00a859] to-[#00d670] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaNewspaper className="w-3 h-3" />
                        Imprensa
                      </h4>
                    </div>
                    <Link
                      href="/imprensa/noticias"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaFileAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Notícias</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/campanhas"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaBullhorn className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Campanhas</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/tv-lojista"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaVideo className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">TV Lojista</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/galeria-fotos"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaImages className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Galeria Fotos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/eventos"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaCalendarAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Eventos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/revista-cdl"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaFileAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Revista CDL</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/imprensa/contato"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaEnvelope className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Contato</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <a href="https://app.higestor.com.br/inscricao/empresa/cdl-ipira" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#003f7f] hover:bg-gray-50 font-medium text-sm 2xl:text-base transition-colors whitespace-nowrap px-2 py-1.5 rounded-md">
                Filie-se
              </a>

              <div
                className="relative group"
                data-dropdown="produtos"
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onKeyDown={handleDropdownKeyDown}
                onBlur={handleDropdownBlur}
                suppressHydrationWarning
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'produtos'}
                  onPointerDown={handleButtonPointerDown}
                  onClick={handleButtonClick}
                  className={`text-gray-700 font-medium text-sm 2xl:text-base flex items-center gap-1.5 transition-all whitespace-nowrap px-2 py-1.5 rounded-md ${isProdutosOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaBox className="hidden xl:block w-3.5 h-3.5 shrink-0" />
                  <span>Produtos</span>
                  <svg className={`w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-200 ${isProdutosOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu Produtos */}
                {isProdutosOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[500px] overflow-y-auto animate-blur-fade-in scrollbar-thin scrollbar-thumb-[#003f7f] scrollbar-track-gray-100" onClick={() => setOpenDropdown(null)}>
                    <div className="bg-linear-to-r from-[#ffd000] to-[#ffed4e] px-4 py-2 mb-1 sticky top-0">
                      <h4 className="text-[#003f7f] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaBox className="w-3 h-3" />
                        Produtos & Serviços
                      </h4>
                    </div>
                    <Link
                      href="/produtos/spc-brasil"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaShieldAlt className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors shrink-0" />
                      <span className="flex-1">SPC Brasil</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/produtos/certificado-digital"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaCertificate className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors shrink-0" />
                      <span className="flex-1">Certificado Digital</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/produtos/cdl-midia"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaBroadcastTower className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors shrink-0" />
                      <span className="flex-1">CDL Mídia</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/produtos/balcao-empregos"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#003f7f] hover:text-white transition-all group/item border-b border-gray-100 last:border-0"
                    >
                      <FaBriefcase className="w-4 h-4 text-[#003f7f] group-hover/item:text-white transition-colors shrink-0" />
                      <span className="flex-1">Balcão de Empregos</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>

              <div
                className="relative group"
                data-dropdown="beneficios"
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onKeyDown={handleDropdownKeyDown}
                onBlur={handleDropdownBlur}
                suppressHydrationWarning
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'beneficios'}
                  onPointerDown={handleButtonPointerDown}
                  onClick={handleButtonClick}
                  className={`text-gray-700 font-medium text-sm 2xl:text-base flex items-center gap-1.5 transition-all whitespace-nowrap px-2 py-1.5 rounded-md ${isBeneficiosOpen ? 'text-[#003f7f] bg-blue-50' : 'hover:text-[#003f7f] hover:bg-gray-50'}`}>
                  <FaGift className="hidden xl:block w-3.5 h-3.5 shrink-0" />
                  <span>Benefícios</span>
                  <svg className={`w-3 h-3 2xl:w-4 2xl:h-4 transition-transform duration-200 ${isBeneficiosOpen ? 'rotate-180 text-[#003f7f]' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu Benefícios */}
                {isBeneficiosOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-blur-fade-in overflow-hidden" onClick={() => setOpenDropdown(null)}>
                    <div className="bg-linear-to-r from-[#ff6b6b] to-[#ff8787] px-4 py-2 mb-1">
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <FaGift className="w-3 h-3" />
                        Benefícios
                      </h4>
                    </div>
                    <Link
                      href="/beneficios/orientacao-juridica"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaBalanceScale className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Orientação Jurídica</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                      href="/beneficios/empresas"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-[#00a859] hover:text-white transition-all group/item"
                    >
                      <FaStoreAlt className="w-4 h-4 text-[#00a859] group-hover/item:text-white transition-colors" />
                      <span className="flex-1">Associados</span>
                      <FaChevronRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Campo de Busca - Desktop */}
            <form onSubmit={handleSearch} className="hidden 2xl:flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-md min-w-0">
              <input
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquise em cdlipira.com.br"
                aria-label="Pesquisar no site"
                className="bg-transparent outline-none flex-1 min-w-0 text-sm"
              />
              <button
                type="submit"
                className="bg-[#003f7f] text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm hover:bg-[#0066cc] transition-colors font-medium whitespace-nowrap"
              >
                Pesquisar
              </button>
            </form>

            {/* Botão de Busca Mobile/Tablet */}
            <button
              suppressHydrationWarning
              onClick={toggleMobileSearch}
              className="2xl:hidden shrink-0 text-[#003f7f] text-lg sm:text-xl p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Pesquisar"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        {isMobileSearchOpen && (
          <div className="2xl:hidden border-t border-gray-200 bg-white px-3 sm:px-4 py-3 animate-slide-down">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  name="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="O que você está procurando?"
                  aria-label="Pesquisar no site"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#003f7f]/30 transition-all"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="bg-[#003f7f] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#0066cc] transition-colors whitespace-nowrap"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={toggleMobileSearch}
                className="text-gray-500 hover:text-gray-700 p-2 transition-colors"
                aria-label="Fechar pesquisa"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </header>
      </div>
    </>
  );
};

export default Header;

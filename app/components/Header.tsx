'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaArrowRight, FaChevronDown, FaPhoneAlt, FaSearch, FaUserCircle, FaUserPlus, FaWhatsapp } from 'react-icons/fa';
import { ACCENT_TILE, ASSOCIE_URL, CONTACT, NAV_GROUPS, PORTAL_URL, isActivePath } from './navigation/navItems';
import { setOverlay, useOverlay } from './navigation/overlayStore';
import SmartLink from './navigation/SmartLink';
import SearchDialog from './navigation/SearchDialog';

const OPEN_DELAY = 120; // intenção de hover: passar o mouse de raspão não abre o painel
const CLOSE_DELAY = 250;

const Header = () => {
  const pathname = usePathname();
  const overlay = useOverlay();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isStuck, setIsStuck] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const barRef = useRef<HTMLDivElement>(null);
  const utilityRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Tipo do último ponteiro que pressionou um botão do menu (mouse, touch, pen)
  const lastPointerType = useRef('');

  // Troca de rota fecha o mega menu (ajuste de estado durante o render, sem effect)
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenGroup(null);
  }

  // Menu da barra inferior e busca também fecham ao navegar (ex.: voltar do navegador)
  useEffect(() => setOverlay(null), [pathname]);

  // Refração do liquid glass só no Chromium (o único que aplica filtro SVG no backdrop-filter; navigator.userAgentData
  // existe só nele). Nos demais o vidro fica igual, sem a ondulação.
  useEffect(() => {
    if ('userAgentData' in navigator) document.documentElement.classList.add('lg-refract');
  }, []);

  // Publica a altura VISÍVEL da barra fixa em --header-height (barras de filtro sticky e scroll-mt grudam nela,
  // inclusive quando ela encolhe ao rolar)
  useEffect(() => {
    const el = barRef.current;
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

  // A barra de contatos rola junto com a página; quando sai da tela a barra principal fixa ganha sombra e desfoque
  useEffect(() => {
    const el = utilityRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsStuck(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ctrl/Cmd + K abre a busca
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenGroup(null);
        setOverlay('search');
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Fecha o mega menu ao clicar/tocar fora dele
  useEffect(() => {
    if (!openGroup) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openGroup]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Logos: tamanhos oficiais no topo da página; compactos depois que a barra de contatos sai da tela
  const logoSize = isStuck ? 'h-11 sm:h-12 md:h-14 lg:h-16 xl:h-[4.5rem]' : 'h-14 sm:h-20 md:h-24 lg:h-28 xl:h-32';

  const groupOf = (el: Element) => el.closest<HTMLElement>('[data-group]')?.dataset.group ?? null;

  // Hover só para mouse: no toque o painel abre/fecha pelo clique
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const id = groupOf(e.currentTarget);
    clearTimeout(timer.current);
    if (openGroup) setOpenGroup(id);
    else timer.current = setTimeout(() => setOpenGroup(id), OPEN_DELAY);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const id = groupOf(e.currentTarget);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpenGroup((current) => (current === id ? null : current)), CLOSE_DELAY);
  };

  // Esc fecha e devolve o foco ao botão do grupo. preventDefault: o aviso de cookies aberto ignora esse Esc (fecha só o menu)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && openGroup === groupOf(e.currentTarget)) {
      e.preventDefault();
      setOpenGroup(null);
      e.currentTarget.querySelector('button')?.focus();
    }
  };

  // Fecha quando o foco sai do grupo (Tab para fora). Sem relatedTarget quem fecha é o pointerdown externo.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const id = groupOf(e.currentTarget);
    if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpenGroup((current) => (current === id ? null : current));
  };

  // Clique: com mouse o hover já abriu, então mantém aberto; toque e teclado alternam
  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = groupOf(e.currentTarget);
    const keepOpen = lastPointerType.current === 'mouse';
    lastPointerType.current = '';
    clearTimeout(timer.current);
    setOpenGroup((current) => (current === id && !keepOpen ? null : id));
  };

  const openSearch = () => {
    setOpenGroup(null);
    setOverlay('search');
  };

  return (
    <>
      {/* Barra de contatos (só no layout desktop, variante desk): rola com a página; só a barra principal fica fixa.
          Fora dele o wrapper fica com altura 0 e segue servindo de sentinela do IntersectionObserver (sombra ao rolar).
          Landmark próprio: o leitor de tela acha telefone, WhatsApp e portal pela lista de regiões. */}
      <div ref={utilityRef} className="bg-[#003f7f] text-white">
        <nav aria-label="Central de Atendimento" className="container mx-auto hidden h-9 items-center justify-between gap-2 px-6 text-[13px] desk:flex">
          <div className="flex min-w-0 items-center gap-4">
            <span className="text-white/70">Central de Atendimento</span>
            <a href={CONTACT.phone.href} className="flex h-9 items-center gap-1.5 whitespace-nowrap px-1 font-semibold transition-colors hover:text-[#ffd000]">
              <FaPhoneAlt aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="sr-only">Telefone: </span>
              {CONTACT.phone.label}
            </a>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-1.5 whitespace-nowrap px-1 font-semibold transition-colors hover:text-[#ffd000]"
            >
              <FaWhatsapp aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-1 font-semibold transition-colors hover:text-[#ffd000]"
          >
            <FaUserCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            Portal do Associado
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </nav>
      </div>

      {/* Barra principal fixa. Ao rolar ela encolhe (logos menores, menos respiro) para liberar a tela. A caixa do
          <header> guarda a altura cheia (min-h = --bar-full de globals.css: logo + padding do estado de topo, em rem para
          acompanhar o texto ampliado), então o conteúdo não pula; a parte que sobra fica transparente e deixa passar cliques. */}
      <header
        className="pointer-events-none sticky top-0 z-50 min-h-[var(--bar-full)]"
        suppressHydrationWarning
      >
        <div
          ref={barRef}
          // Liquid glass (globals.css): o conteúdo que passa por baixo aparece desfocado e saturado através da barra.
          // Opaco o bastante para o menu navy de 15px manter 4,5:1 sobre foto ou seção escura (com preto atrás: #003f7f
          // a 5,2:1 e #001a3d a 8,8:1); mais transparente, caía para 1,5:1 sobre o rodapé e as fotos.
          className="liquid-glass pointer-events-auto rounded-b-[1.75rem] [--lg-alpha:0.72] md:rounded-b-[2.5rem]"
        >
          <div
            className={`container mx-auto px-3 transition-[padding] duration-300 ease-out sm:px-4 md:px-6 ${
              isStuck ? 'py-1.5 md:py-2' : 'py-2 sm:py-3 md:py-4'
            }`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Logos (tamanhos oficiais por breakpoint: não alterar). Fora do layout desktop (variante desk) o
                  cabeçalho tem só as logos: CDL à esquerda e SPC à direita; menu, busca e contatos ficam no menu da
                  barra inferior. */}
              <div className="flex min-w-0 flex-1 shrink-0 items-center justify-between gap-2 sm:gap-3 md:gap-4 desk:flex-none desk:justify-start">
                <Link href="/" className={`flex items-center transition-[height,opacity] duration-300 ease-out hover:opacity-80 ${logoSize}`}>
                  <Image src="/logo-cdl.png" alt="CDL Ipirá - página inicial" width={350} height={140} className="h-full w-auto object-contain" priority />
                </Link>
                <a
                  href="https://www.spcbrasil.org.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center transition-[height,opacity] duration-300 ease-out hover:opacity-80 ${logoSize}`}
                >
                  <Image src="/spc-brasil-logo.png" alt="SPC Brasil (abre em nova aba)" width={350} height={140} className="h-full w-auto object-contain" priority />
                </a>
              </div>

              {/* Menu desktop com mega menu. Os grupos são `static`: o painel se posiciona pela barra inteira */}
              <nav ref={navRef} aria-label="Menu principal" className="hidden self-stretch desk:flex lg:gap-0.5 xl:gap-1">
                {NAV_GROUPS.map((group) => {
                  const isOpen = openGroup === group.id;
                  const isCurrent = group.items.some((item) => !item.external && isActivePath(pathname, item.href));
                  const { featured } = group;
                  return (
                    <div
                      key={group.id}
                      data-group={group.id}
                      className="flex items-center"
                      onPointerEnter={handlePointerEnter}
                      onPointerLeave={handlePointerLeave}
                      onKeyDown={handleKeyDown}
                      onBlur={handleBlur}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`mega-${group.id}`}
                        onPointerDown={(e) => (lastPointerType.current = e.pointerType)}
                        onClick={handleTriggerClick}
                        className={`relative flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[15px] font-semibold transition-colors xl:px-3.5 ${
                          isOpen
                            ? 'bg-[#003f7f]/[0.07] text-[#003f7f]'
                            : isCurrent
                              ? 'text-[#003f7f] hover:bg-[#003f7f]/[0.04]'
                              : 'text-[#001a3d] hover:bg-white/40 hover:text-[#003f7f]'
                        }`}
                      >
                        {group.label}
                        <FaChevronDown aria-hidden="true" className={`h-2.5 w-2.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        {isCurrent && !isOpen && <span aria-hidden="true" className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#003f7f]" />}
                      </button>

                      {isOpen && (
                        <div id={`mega-${group.id}`} className="pointer-events-none absolute inset-x-0 top-full pt-2">
                          <div className="container mx-auto px-6">
                            <div
                              onClick={(e) => (e.target as HTMLElement).closest('a') && setOpenGroup(null)}
                              className="pointer-events-auto grid max-h-[calc(100dvh-var(--header-height,0px)-3.75rem)] grid-cols-[minmax(0,1fr)_17rem] gap-3 overflow-y-auto rounded-3xl bg-white p-3 shadow-[0_40px_90px_-30px_rgba(0,26,61,0.45)] ring-1 ring-[#003f7f]/10 animate-slide-down xl:grid-cols-[minmax(0,1fr)_19rem]"
                            >
                              <div className="p-3">
                                <p className="mb-3 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                  <group.icon aria-hidden="true" className="h-3.5 w-3.5" />
                                  {group.label}
                                  <span className="font-medium normal-case tracking-normal text-gray-500">· {group.description}</span>
                                </p>
                                <ul className="grid grid-cols-2 gap-1">
                                  {group.items.map(({ href, label, description, icon: Icon, external }) => {
                                    const active = !external && isActivePath(pathname, href);
                                    return (
                                      <li key={href}>
                                        <SmartLink
                                          href={href}
                                          external={external}
                                          aria-current={active ? 'page' : undefined}
                                          className={`group flex h-full items-start gap-3.5 rounded-2xl p-3 transition-colors ${
                                            active ? 'bg-[#003f7f]/[0.05]' : 'hover:bg-gray-50'
                                          }`}
                                        >
                                          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors duration-200 ${ACCENT_TILE[group.accent]}`}>
                                            <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                                          </span>
                                          <span className="min-w-0 pt-0.5">
                                            <span className={`flex items-center gap-1.5 text-[15px] font-semibold ${active ? 'text-[#003f7f]' : 'text-gray-900 group-hover:text-[#003f7f]'}`}>
                                              {label}
                                              {external && <FaArrowRight aria-hidden="true" className="h-2.5 w-2.5 -rotate-45 text-gray-400" />}
                                            </span>
                                            <span className="mt-0.5 block text-sm leading-snug text-gray-500">{description}</span>
                                          </span>
                                        </SmartLink>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>

                              {/* Card de destaque nas cores da marca */}
                              <SmartLink
                                href={featured.href}
                                external={featured.external}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-linear-to-br from-[#001a3d] via-[#003f7f] to-[#0052a3] p-6 text-white"
                              >
                                <span aria-hidden="true" className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl ${group.accent === 'green' ? 'bg-[#00d670]/30' : 'bg-[#ffd000]/25'}`} />
                                <span aria-hidden="true" className="absolute inset-0 bg-[url('/pattern-grid.svg')] opacity-10" />
                                <span className="relative">
                                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                                    <featured.icon aria-hidden="true" className="h-[18px] w-[18px] text-[#ffd000]" />
                                  </span>
                                  <span className="block text-xs font-bold uppercase tracking-wider text-[#ffd000]">{featured.eyebrow}</span>
                                  <span className="mt-1.5 block text-lg font-extrabold leading-tight">{featured.label}</span>
                                  <span className="mt-2 block text-sm leading-relaxed text-white/80">{featured.description}</span>
                                </span>
                                <span className="relative mt-6 inline-flex h-10 items-center gap-2 self-start rounded-full bg-[#ffd000] px-4 text-sm font-bold text-[#003f7f] transition-colors group-hover:bg-[#ffed4e]">
                                  {featured.cta}
                                  <FaArrowRight aria-hidden="true" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                </span>
                              </SmartLink>

                              <div className="col-span-2 flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-5 py-3 text-sm text-gray-600">
                                <span>
                                  Precisa de ajuda? Central de Atendimento{' '}
                                  <a href={CONTACT.phone.href} className="font-semibold text-[#003f7f] hover:underline">
                                    {CONTACT.phone.label}
                                  </a>
                                </span>
                                <a
                                  href={CONTACT.whatsapp.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 font-semibold text-[#003f7f] hover:underline"
                                >
                                  <FaWhatsapp aria-hidden="true" className="h-4 w-4 text-[#00a859]" />
                                  Falar no WhatsApp
                                  <span className="sr-only"> (abre em nova aba)</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Ações (desktop) */}
              <div className="hidden shrink-0 items-center gap-2 desk:flex">
                <button
                  type="button"
                  onClick={openSearch}
                  aria-haspopup="dialog"
                  aria-expanded={overlay === 'search'}
                  aria-keyshortcuts="Control+K Meta+K"
                  aria-label="Pesquisar no site"
                  className="flex h-11 w-11 items-center justify-center gap-2 rounded-full text-[#003f7f] ring-1 ring-gray-200 transition-colors hover:bg-[#003f7f]/5 hover:ring-[#003f7f]/30 2xl:w-52 2xl:justify-start 2xl:px-4 2xl:text-sm 2xl:text-gray-500"
                >
                  <FaSearch aria-hidden="true" className="h-4 w-4 shrink-0 text-[#003f7f]" />
                  <span aria-hidden="true" className="hidden 2xl:inline">
                    Pesquisar no site
                  </span>
                </button>
                <SmartLink
                  href={ASSOCIE_URL}
                  external
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#ffd000] px-5 text-sm font-bold text-[#003f7f] shadow-[0_10px_24px_-10px_rgba(255,208,0,0.9)] transition-[background-color,translate,scale] hover:-translate-y-0.5 hover:bg-[#ffed4e] active:scale-[0.98] motion-reduce:hover:translate-y-0"
                >
                  <FaUserPlus aria-hidden="true" className="h-3.5 w-3.5 lg:hidden xl:block" />
                  Associe-se
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </header>

      {overlay === 'search' && <SearchDialog />}
    </>
  );
};

export default Header;

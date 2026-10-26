'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Form from 'next/form';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import {
  FaArrowRight,
  FaBars,
  FaEnvelope,
  FaHome,
  FaPhoneAlt,
  FaRegNewspaper,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaUserCircle,
  FaUserPlus,
  FaWhatsapp,
} from 'react-icons/fa';
import { useModalBehavior } from '@/lib/hooks/useModalBehavior';
import { ACCENT_TILE, ASSOCIE_URL, CONTACT, NAV_GROUPS, PORTAL_URL, isActivePath } from './navigation/navItems';
import { setOverlay, useOverlay } from './navigation/overlayStore';
import SmartLink from './navigation/SmartLink';

const close = () => setOverlay(null);

const QUICK_ACTIONS: { label: string; srLabel?: string; href: string; icon: IconType; external?: boolean; tone: string }[] = [
  { label: 'Associe-se', href: ASSOCIE_URL, icon: FaUserPlus, external: true, tone: 'bg-[#ffd000] text-[#003f7f]' },
  { label: 'Portal', srLabel: ' do Associado', href: PORTAL_URL, icon: FaUserCircle, external: true, tone: 'bg-[#003f7f] text-white' },
  { label: 'WhatsApp', href: CONTACT.whatsapp.href, icon: FaWhatsapp, external: true, tone: 'bg-[#00a859] text-white' },
  { label: 'Ligar', href: CONTACT.phone.href, icon: FaPhoneAlt, tone: 'bg-[#0052a3] text-white' },
];

const HOURS = CONTACT.hours.filter(({ time }) => time !== 'Fechado');

/**
 * Barra inferior estilo app (fora do layout desktop: variante desk, globals.css). O botão central "Menu" abre um menu que sobe da própria barra:
 * busca, atalhos, seções do site (abas com ícones, de navItems) e contatos. Substitui o hambúrguer do Header.
 */
const MobileBottomNav = () => {
  const pathname = usePathname();
  const isOpen = useOverlay() === 'menu';
  // Barra + menu formam a área do foco preso: o botão "Fechar" da barra continua alcançável pelo Tab
  const trapRef = useModalBehavior<HTMLDivElement>(isOpen, close);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  // Aba escolhida vale só para a página em que foi escolhida; ao navegar volta para a seção da rota atual
  const routeGroup = NAV_GROUPS.find((g) => g.items.some((i) => !i.external && isActivePath(pathname, i.href)))?.id ?? NAV_GROUPS[0].id;
  const [picked, setPicked] = useState<{ path: string; id: string } | null>(null);
  const tab = picked?.path === pathname ? picked.id : routeGroup;
  const group = NAV_GROUPS.find((g) => g.id === tab) ?? NAV_GROUPS[0];

  // Ao abrir, o foco vai para o painel (não para o campo de busca: no celular isso abriria o teclado)
  useEffect(() => {
    if (isOpen) panelRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  // A barra some quando o layout desktop liga (desk:hidden: girar o tablet, alargar a janela, diminuir o texto no painel
  // de acessibilidade): fecha para não deixar o scroll travado. Sem tamanho = escondida; o observer pega os três casos.
  useEffect(() => {
    const bar = barRef.current;
    if (!isOpen || !bar || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => !bar.offsetWidth && close());
    observer.observe(bar);
    return () => observer.disconnect();
  }, [isOpen]);

  // Menu aberto: a página atrás fica inerte. O Tab já fica preso (useModalBehavior), mas o deslizar do VoiceOver/TalkBack
  // saía do menu e lia o conteúdo escurecido. A barra fica de fora: o "Fechar" dela continua alcançável. Sem aria-modal
  // no painel pelo mesmo motivo (prenderia o leitor de tela longe do único botão de fechar).
  useEffect(() => {
    if (!isOpen) return;
    const page = [...document.querySelectorAll<HTMLElement>('body > :is(.skip-link, header, footer), #conteudo')];
    page.forEach((el) => (el.inert = true));
    return () => page.forEach((el) => (el.inert = false));
  }, [isOpen]);

  // Qualquer link (inclusive o da página atual, que não muda a rota) fecha o menu
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) close();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement;
    const query = input.value.trim();
    if (query.length < 2) {
      e.preventDefault();
      input.focus();
      return;
    }
    input.value = query;
    close();
  };

  // Setas/Home/End movem entre as abas (padrão WAI-ARIA de tabs com ativação automática)
  const handleTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const index = NAV_GROUPS.findIndex((g) => g.id === tab);
    const last = NAV_GROUPS.length - 1;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const target = NAV_GROUPS[(next + NAV_GROUPS.length) % NAV_GROUPS.length];
    setPicked({ path: pathname, id: target.id });
    document.getElementById(`menu-tab-${target.id}`)?.focus();
  };

  return (
    <div ref={trapRef} onClick={handleClick} className="desk:hidden">
      {/* Fundo escurecido sobre a página (a barra fica por cima, com o botão Fechar) */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[60] bg-[#001a3d]/30 transition-opacity duration-200 motion-reduce:transition-none ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <div
        id="menu-app"
        ref={panelRef}
        role="dialog"
        aria-labelledby="menu-app-title"
        tabIndex={-1}
        inert={!isOpen}
        className={`fixed inset-x-2 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[70] mx-auto flex max-h-[calc(100dvh-10.5rem-env(safe-area-inset-bottom))] max-w-xl origin-bottom flex-col overflow-hidden rounded-[1.75rem] liquid-glass liquid-glass-strong outline-none duration-200 ease-out motion-reduce:transition-none sm:inset-x-4 ${
          // Ao abrir fica visível na hora (para receber o foco); ao fechar só some depois da animação
          isOpen
            ? 'visible translate-y-0 scale-100 opacity-100 transition-[opacity,translate,scale]'
            : 'invisible translate-y-3 scale-[0.98] opacity-0 transition-[opacity,translate,scale,visibility] motion-reduce:translate-y-0 motion-reduce:scale-100'
        }`}
      >
        <div className="overflow-y-auto overscroll-contain p-3 sm:p-4">
          <h2 id="menu-app-title" className="sr-only">
            Menu do site
          </h2>

          <Form action="/pesquisa" role="search" onSubmit={handleSearch} className="relative">
            <label htmlFor="menu-search" className="sr-only">
              Pesquisar no site
            </label>
            <FaSearch aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#003f7f]" />
            <input
              id="menu-search"
              name="q"
              type="search"
              required
              minLength={2}
              autoComplete="off"
              enterKeyHint="search"
              placeholder="O que você procura?"
              className="h-[3.25rem] w-full rounded-2xl bg-white/60 pl-11 pr-14 text-base text-gray-900 placeholder:text-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003f7f]/40 [&::-webkit-search-cancel-button]:hidden"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl bg-[#003f7f] text-white transition-[background-color,scale] hover:bg-[#0052a3] active:scale-95"
            >
              <FaArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </Form>

          {/* Atalhos */}
          <ul aria-label="Atalhos" className="mt-3 grid grid-cols-4 gap-1 min-[360px]:gap-2">
            {QUICK_ACTIONS.map(({ label, srLabel, href, icon: Icon, external, tone }) => (
              <li key={label}>
                <SmartLink
                  href={href}
                  external={external}
                  className="group flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl p-1 text-center transition-colors hover:bg-white/50"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full transition-[scale] group-active:scale-95 ${tone}`}>
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="whitespace-nowrap text-[11px] font-semibold text-gray-800 min-[360px]:text-xs">
                    {label}
                    {srLabel && <span className="sr-only">{srLabel}</span>}
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>

          {/* Seções do site em abas segmentadas */}
          <div role="tablist" aria-label="Seções do site" onKeyDown={handleTabKey} className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-white/45 p-1">
            {NAV_GROUPS.map(({ id, label, icon: Icon }) => {
              const selected = id === tab;
              return (
                <button
                  key={id}
                  id={`menu-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="menu-tabpanel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setPicked({ path: pathname, id })}
                  className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-[11px] font-semibold leading-none transition-[background-color,color,box-shadow] min-[400px]:text-xs ${
                    selected ? 'bg-white text-[#003f7f] shadow-[0_2px_8px_-2px_rgba(0,26,61,0.2)]' : 'text-gray-500 hover:text-[#003f7f]'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="max-w-full truncate">{label}</span>
                </button>
              );
            })}
          </div>

          <div id="menu-tabpanel" role="tabpanel" aria-labelledby={`menu-tab-${group.id}`} className="pt-3">
            <p className="mb-2 px-1 text-xs text-gray-500">{group.description}</p>
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {group.items.map(({ href, label, icon: Icon, external }) => {
                const active = !external && isActivePath(pathname, href);
                return (
                  <li key={href}>
                    <SmartLink
                      href={href}
                      external={external}
                      aria-current={active ? 'page' : undefined}
                      className={`group relative flex h-full min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-2xl p-2 text-center ring-1 transition-[background-color,scale] active:scale-[0.97] ${
                        active ? 'bg-white/80 ring-[#003f7f]/25' : 'bg-white/55 ring-white/70 hover:bg-white/80'
                      }`}
                    >
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-colors ${ACCENT_TILE[group.accent]}`}>
                        <Icon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className={`text-xs font-semibold leading-tight ${active ? 'text-[#003f7f]' : 'text-gray-800'}`}>{label}</span>
                      {external && <FaArrowRight aria-hidden="true" className="absolute right-2.5 top-2.5 h-2.5 w-2.5 -rotate-45 text-gray-400" />}
                    </SmartLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Atendimento */}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-[#001a3d] py-2 pl-4 pr-2 text-white">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Atendimento</p>
              {HOURS.map(({ day, time }) => (
                <p key={day} className="text-xs leading-snug text-white/65">
                  {day} <span className="font-semibold tabular-nums text-white">{time}</span>
                </p>
              ))}
            </div>
            <div className="flex shrink-0 gap-1">
              <a
                href={CONTACT.phone.href}
                aria-label={`Ligar para ${CONTACT.phone.label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <FaPhoneAlt aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
              <a
                href={CONTACT.email.href}
                aria-label={`Enviar e-mail para ${CONTACT.email.label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <FaEnvelope aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav
        ref={barRef}
        aria-label="Navegação rápida"
        // Cápsula de vidro flutuante (estilo iOS 26): o conteúdo aparece por baixo e através dela; globals.css desconta
        // a altura + o vão (--bottom-nav) da área útil das seções. Vidro mais opaco que o padrão: rótulos de 11px
        // passam por cima do rodapé navy e das fotos e precisam de 4,5:1.
        className={`liquid-glass fixed inset-x-3 [--lg-alpha:0.72] bottom-[calc(0.5rem+env(safe-area-inset-bottom))] mx-auto max-w-lg rounded-[1.75rem] ${
          isOpen ? 'z-[70]' : 'z-50'
        }`}
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5 px-1">
          <NavButton href="/" icon={FaHome} label="Início" isActive={pathname === '/'} />
          <NavButton href="/imprensa/noticias" icon={FaRegNewspaper} label="Notícias" isActive={isActivePath(pathname, '/imprensa/noticias')} />
          <li>
            <button
              type="button"
              onClick={(e) => {
                // Safari não foca botões no toque: foca aqui para o foco voltar a ele ao fechar
                e.currentTarget.focus();
                setOverlay(isOpen ? null : 'menu');
              }}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls="menu-app"
              className="group flex h-16 w-full flex-col items-center justify-center gap-1 py-1"
            >
              {/* Mesma grade dos outros itens (rótulo alinhado); o círculo elevado sai da barra por cima */}
              <span className="relative h-8 w-14">
                <span
                  className={`absolute bottom-1 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-white ring-4 ring-white shadow-[0_12px_24px_-8px_rgba(0,63,127,0.75)] transition-[background-color,scale] group-active:scale-95 ${
                    isOpen ? 'bg-[#001a3d]' : 'bg-[#003f7f] group-hover:bg-[#0052a3]'
                  }`}
                >
                  {isOpen ? <FaTimes aria-hidden="true" className="h-5 w-5" /> : <FaBars aria-hidden="true" className="h-5 w-5" />}
                </span>
              </span>
              <span className="text-[11px] font-bold text-[#003f7f]">{isOpen ? 'Fechar' : 'Menu'}</span>
            </button>
          </li>
          <NavButton href="/produtos/spc-brasil" icon={FaShieldAlt} label="SPC" isActive={isActivePath(pathname, '/produtos/spc-brasil')} />
          <NavButton href="/imprensa/contato" icon={FaEnvelope} label="Contato" isActive={isActivePath(pathname, '/imprensa/contato')} />
        </ul>
      </nav>
    </div>
  );
};

const NavButton = ({ href, icon: Icon, label, isActive }: { href: string; icon: IconType; label: string; isActive: boolean }) => (
  <li>
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`group flex h-16 flex-col items-center justify-center gap-1 py-1 transition-colors ${
        isActive ? 'text-[#003f7f]' : 'text-[#001a3d] hover:text-[#003f7f]'
      }`}
    >
      {/* Indicador ativo: pílula tingida atrás do ícone */}
      <span
        className={`flex h-8 w-14 items-center justify-center rounded-full transition-[background-color,scale] group-active:scale-95 ${
          isActive ? 'bg-[#003f7f]/10' : 'group-hover:bg-white/60'
        }`}
      >
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </Link>
  </li>
);

export default MobileBottomNav;
